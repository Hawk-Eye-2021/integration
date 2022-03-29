import { fetch } from '../utils/middleware'
import {urls} from "../config/config"
import {Content, Sentiment} from "../types/types";

export const getSentimentsForContentEntities = (content: Content, entities: string[]): Promise<Sentiment[]> => {
    console.log(`Extracting sentiment from: ${content.title}`)

    return  fetch(`${urls.sentimentExtractor}/api/sentiment`,
        {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({extraction: {title: content.title, entities}})
        })
        .then(res => {
            console.log(`Finished extracting sentiment from: ${content.title}`)
            return res.json()
        })
        .then(res =>
            Object.entries(res.sentiments).map(([entity, value]: [entity: string, value: string]) => ({entity, value}))
        )
}