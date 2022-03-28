import fetch from "node-fetch";
import {Content, Theme} from "../types/types";
import {urls} from "../config/config"

const getThemeByName = (name: string): Promise<Theme[]> => {

    return fetch(`${urls.api}/themes?name=${name}`)
        .then(res => res.json())
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

const createContent = (content: Content): Promise<Content> => {
    return fetch(`${urls.api}/contents`, {
        method: "POST",
        body: JSON.stringify({
            title: content.title,
            sourceId: content.source.id,
            url: content.url
        }),
        headers: {'Content-Type': 'application/json'}
    })
        .then(async res => {
            if(res.status >= 400) throw new Error((await res.json()).message)
            else return res.json()
        })
        .then(res => ({...content, id: res.id}))
}


const addContentToTheme = (theme: Theme, content: Content) => {

    const sentiment = content.sentiments[theme.name];
    return fetch(`${urls.api}/themes/${theme.id}/contents`, {
        method: "POST",
        body: JSON.stringify({
            contentId: content.id,
            sentiment
        }),
        headers: {'Content-Type': 'application/json'}
    })
        .then(res => res.json())
}

export const addContentToThemes = async (content: Content): Promise<void> => {
    console.log(`Adding content to themes: ${content.title}`)

    try {

        const themes = await Promise.all(content.entities.map(async (entity) => {
            let [theme] = await getThemeByName(entity);

            if(!theme) {
                theme = await createTheme(entity)
            }

            return theme;
        }))

        if (themes.every(t => t.id)){
            const savedContent = await createContent(content);

            await themes.map(theme => addContentToTheme(theme, savedContent))
        } else {
            throw new Error(`Theme already exists`)
        }
    } catch (e) {
        console.error(e)
    }
}

export const getSources = async () => {
    return await fetch(`${urls.api}/sources`, {method: "GET"})
        .then(res => res.json())
}


export const parseContent = (url: string) => {

    const encodedUrl = encodeURIComponent(url);
    return fetch(`${urls.api}/contents/?url=${encodedUrl}`, {method: "GET"})
        .then(res => res.json())
        .then(res => ({url, exists: res.length > 0}))
}

export const filterExistingContents = (contents: {url: string, exists: boolean}[]) => {
    const filteredContents = contents.filter(content => !content.exists);
    console.log(`Initially scrapped ${contents.length} - ${filteredContents.length} don't exist`)

    return filteredContents;
}