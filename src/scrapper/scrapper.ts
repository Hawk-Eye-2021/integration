import { fetch } from '../utils/middleware'
import {urls} from "../config/config"
import {Content, DataElement, Source} from "../types/types";

export const getContents = async (source: Source): Promise<DataElement[]> => {

    return fetch(`${urls.scrapper}/sources/${source.name.toLowerCase()}/contents`)
        .then(res => res.json())

}

export const getContent = async (url: string, source: Source): Promise<Content> => {
    console.log(`Getting content from: ${url}`)
    return fetch(`${urls.scrapper}/sources/${source.name.toLowerCase()}/contents/${encodeURIComponent(url)}`)
        .then(res => res.json())
        .then(res => ({...res, url}))
}
