export interface Content {
    title: string;
    url: string;
    content: string[];
    id?: number;
}

export interface Source {
    id: string;
    name: string;
}

export interface Theme {
    id: string;
    name: string;
}

export interface Sentiment {
    entity: string,
    value: string
}

export type DataElement = {
    url: string,
    data?: {
        title: string,
        content: string
    }
}