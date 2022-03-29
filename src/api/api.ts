import {Content, Source, Theme} from "../types/types";
import {urls} from "../config/config"
import { fetch } from '../utils/middleware'

const getThemeByName = (name: string): Promise<Theme> => {

    return fetch(`${urls.api}/themes?name=${name}`)
        .then(res => res.json())
        .then(res => res[0])
}
const createTheme = (name: string): Promise<Theme> => {

    return fetch(`${urls.api}/themes`, {
        method: "POST",
        body: JSON.stringify({
            name
        }),
        headers: {'Content-Type': 'application/json'}
    })
        .then(res => res.json())
        .then(res => res)
}

export const saveContent = (content: Content, sourceId: string): Promise<string> => {
    return fetch(`${urls.api}/contents`, {
        method: "POST",
        body: JSON.stringify({
            title: content.title,
            sourceId,
            url: content.url
        }),
        headers: {'Content-Type': 'application/json'}
    })
        .then(res => res.json())
        .then(res => res && res.id)
}


export const addContentToTheme = (contentId: string, themeId: string, sentiment: string) => {

    return fetch(`${urls.api}/themes/${themeId}/contents`, {
        method: "POST",
        body: JSON.stringify({
            contentId,
            sentiment
        }),
        headers: {'Content-Type': 'application/json'}
    })
        .then(res => res.json())
}



export const getSources: () => Promise<Source[]> = async (): Promise<Source[]> => {
    return await fetch(`${urls.api}/sources`, {method: "GET"})
        .then(res => res.json())
}


export const contentExistsForUrl = (url: string): Promise<boolean> => {
    const encodedUrl = encodeURIComponent(url);
    console.log(`fetching content with url: ${url}`)
    return fetch(`${urls.api}/contents/?url=${encodedUrl}`, {method: "GET"})
        .then(res => res.json())
        .then(res => res.length > 0)
        .then(res => {
            console.log(res ?'content exists' : 'content does not exists')
            return res
        })
}

export const getOrCreateThemeByName = async (entity: string) => {
    const theme = await getThemeByName(entity)
    if (!theme || !theme.id){
        return createTheme(entity)
    }
    return theme
}