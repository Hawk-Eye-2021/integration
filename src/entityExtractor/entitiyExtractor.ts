import { fetch } from '../utils/middleware'
import {urls} from "../config/config"
import {Content} from "../types/types";


export const getEntitiesForContent = (content: Content): Promise<string[]> => {
    console.log(`Extracting entities from: ${content.title}`)

    return fetch(`${urls.entityExtractor}/contents`,
        {
            method: "POST",
            body: JSON.stringify({content: content.title}),
        })
        .then(res => {
            console.log(`Finished extracting entities from: ${content.title}`)
            return res.json()
        })
}