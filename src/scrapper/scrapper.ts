import fetch from "node-fetch";
import {urls} from "../config/config"
import {Content, Source} from "../types/types";

export const getContents = async (source: Source): Promise<string[]> => {

    return fetch(`${urls.scrapper}/sources/${source.name.toLowerCase()}/contents`)
        .then(res => res.json())
}

export const getContent = async (url: string, source: Source): Promise<Content> => {
    return fetch(`${urls.scrapper}/sources/infobae/contents/${encodeURIComponent(url)}`)
        .then(res => res.json())
        .then(res => ({...res, url, source}))
}
