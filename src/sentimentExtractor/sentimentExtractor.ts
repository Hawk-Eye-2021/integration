import fetch from "node-fetch";
import {urls} from "../config/config"
import {Content} from "../types/types";

export const extractSentiment = (content: Content): Promise<Content> => {
    console.log(`Extracting sentiment from: ${content.title}`)

    return fetch(`${urls.sentimentExtractor}/api/sentiment`,
        {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({extraction: {title: content.title, entities: content.entities}})
        })
        .then(res => {
            console.log(`Finished extracting sentiment from: ${content.title}`)
            return res.json()
        })
        .then(res => ({...content, ...res}))
}