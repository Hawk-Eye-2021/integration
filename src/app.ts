import {getContents, getContent} from "./scrapper/scrapper";
import {extractEntities} from "./entityExtractor/entitiyExtractor";
import {Source} from "./types/types";
import {extractSentiment} from "./sentimentExtractor/sentimentExtractor";
import {addContentToThemes, filterExistingContents, getSources, parseContent} from "./api/api";
import express from 'express';
import cors from "cors"
import bodyParser from "body-parser";

import cron from "node-cron";

// TODO Limit concurrency

const run = async () => {
    const sources: Source[] = await getSources();
    return Promise.all(sources.map(source => {
        getContents(source)
            .then(contents => Promise.all(contents.map(parseContent)))
            .then(filterExistingContents)
            .then(contents => Promise.all(contents.map((content) => getContent(content.url, source))))
            .then(contents => Promise.all(contents.map(extractEntities)))
            .then(contents => Promise.all(contents.map(extractSentiment)))
            .then(contents => Promise.all(contents.map(addContentToThemes)))
    }))
}
cron.schedule("0 * * * *", () => {
    run()
})

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