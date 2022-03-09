import {getContents, getContent} from "./scrapper/scrapper";
import {extractEntities} from "./entityExtractor/entitiyExtractor";
import {Source} from "./types/types";
import {extractSentiment} from "./sentimentExtractor/sentimentExtractor";
import {addContentToThemes} from "./api/api";

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