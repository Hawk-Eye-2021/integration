export interface Content {
    title: string;
    url: string;
    content: string[];
    source: Source;
    entities?: string[]
    sentiment?: string;
    id?: number;
}

export interface Source {
    id: number;
    name: string;
}

export interface Theme {
    id: number;
    name: string;
}