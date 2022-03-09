import fetch from "node-fetch";
import {urls} from "../config/config"
import {Content} from "../types/types";

export const extractSentiment = (content: Content): Promise<Content> => {

    return fetch(`${urls.sentimentExtractor}/api/sentiment`,
        {
            method: "POST",
            body: JSON.stringify({sentence: content.title, twitter: content.source.name === "Twitter"})
        })
        .then(res => res.json())
        .then(res => ({...content, sentiment: res}))
}