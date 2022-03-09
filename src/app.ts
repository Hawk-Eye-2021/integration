import {getContents, getContent} from "./scrapper/scrapper";
import {extractEntities} from "./entityExtractor/entitiyExtractor";
import {Source} from "./types/types";
import {extractSentiment} from "./sentimentExtractor/sentimentExtractor";
import {addContentToThemes} from "./api/api";
import express from 'express';
import cors from "cors"
import bodyParser from "body-parser";

import cron from "node-cron";

const sources: Source[] = [
    {
        name: "Infobae",
        id: 1
    }
]

// TODO GET SOURCES FIRST

// TODO Check if content exists before scrapping entire html

// TODO Limit concurrency

cron.schedule("0 * * * *", () => {
    Promise.all(sources.map(source => {
        getContents(source)
            .then(contents => Promise.all(contents.map((content) => getContent(content, source))))
            .then(contents => Promise.all(contents.map(extractEntities)))
            .then(contents => Promise.all(contents.map(extractSentiment)))
            .then(contents => Promise.all(contents.map(addContentToThemes)))
    }))
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