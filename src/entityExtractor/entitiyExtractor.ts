import fetch from "node-fetch";
import {urls} from "../config/config"
import {Content} from "../types/types";

export const extractEntities = (content: Content): Promise<Content> => {
    console.log(`Extracting entities from: ${content.title}`)

    return fetch(`${urls.entityExtractor}/contents`,
        {
            method: "POST",
            body: JSON.stringify({content: content.title}),
        })
        .then(res => res.json())
        .then(res => ({...content, entities: res}))
}