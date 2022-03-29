import {addContentToTheme, contentExistsForUrl, getOrCreateThemeByName, getSources, saveContent} from "./api/api";
import {getContent, getCurrentUrls} from "./scrapper/scrapper";
import {Source} from "./types/types";
import {getEntitiesForContent} from "./entityExtractor/entitiyExtractor";
import {getSentimentsForContentEntities} from "./sentimentExtractor/sentimentExtractor";
import express from 'express';
import cors from "cors"
import bodyParser from "body-parser";

const MAX_URLS_PER_RUN = 5

const run = async () => {

    const sources: Source[] = await getSources()

    for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
        const source = sources[sourceIndex]

        const urls = await getCurrentUrls(source)

        const newUrls = []
        for (let urlIndex = 0; urlIndex < urls.length; urlIndex++) {
            const url = urls[urlIndex]
            if (!await contentExistsForUrl(url)) {
                newUrls.push(url)
            }
            if (newUrls.length === MAX_URLS_PER_RUN){
                break
            }
        }

        const urlsToParse = newUrls.slice(0, MAX_URLS_PER_RUN)

        for (let urlToParseIndex = 0; urlToParseIndex < urlsToParse.length; urlToParseIndex++) {

            const newUrl = urlsToParse[urlToParseIndex]
            const content =  await getContent(newUrl, source)
            const entities = await getEntitiesForContent(content)
            if (entities.length === 0) continue
            const sentiments = await getSentimentsForContentEntities(content, entities)

            const contentId = await saveContent(content, source.id)
            for (let entityIndex = 0; entityIndex < entities.length; entityIndex++) {
                const entity = entities[entityIndex]
                const sentiment = sentiments.find(s => s.entity === entity)
                const theme = await getOrCreateThemeByName(entity)
                await addContentToTheme(contentId, theme.id, sentiment.value)
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