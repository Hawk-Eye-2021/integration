import {addContentToTheme, contentExistsForUrl, getOrCreateThemeByName, getSources, saveContent} from "./api/api";
import {getContent, getContents} from "./scrapper/scrapper";
import {Source} from "./types/types";
import {getEntitiesForContent} from "./entityExtractor/entitiyExtractor";
import {getSentimentsForContentEntities} from "./sentimentExtractor/sentimentExtractor";
import express from 'express';
import cors from "cors"
import bodyParser from "body-parser";

const MAX_CONTENTS_PER_RUN = 20

const run = async () => {

    const sources: Source[] = await getSources()

    for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
        const source = sources[sourceIndex]

        const contents = await getContents(source)

        const newContents = []
        for (let contentIndex = 0; contentIndex < contents.length; contentIndex++) {
            const url = contents[contentIndex].url
            if (!await contentExistsForUrl(url)) {
                newContents.push(contents[contentIndex])
            }
            if (newContents.length === MAX_CONTENTS_PER_RUN){
                break
            }
        }

        const contentsToParse = newContents.slice(0, MAX_CONTENTS_PER_RUN)

        for (let contentsToParseIndex = 0; contentsToParseIndex < contentsToParse.length; contentsToParseIndex++) {

            try {
                const newContent = contentsToParse[contentsToParseIndex]
                let content;
                if(!newContent.data) {
                    content = await getContent(newContent.url, source)
                } else {
                    content = {url: newContent.url, title: newContent.data.content}
                }

                const entities = await getEntitiesForContent(content)
                const sentiments = await getSentimentsForContentEntities(content, entities)
                const contentId = await saveContent(content, source.id)
                for (let entityIndex = 0; entityIndex < entities.length; entityIndex++) {
                    const entity = entities[entityIndex]
                    const sentiment = sentiments.find(s => s.entity === entity)
                    const theme = await getOrCreateThemeByName(entity)
                    await addContentToTheme(contentId, theme.id, sentiment.value)
                }
            } catch (e) {
                console.error(e)
            }
        }
    }

}

const app = express();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Timezones by location application is running on port ${port}.`);
});

app.use(cors())
app.use(bodyParser.json())

app.get("/health", (req, res) => {
    console.log("health")
    res.send("OK")
})

app.get("/run", async (req, res) => {
    console.log("running")
    run()
    res.send("OK")
})