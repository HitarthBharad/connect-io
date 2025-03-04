export type ChainNode = {
    id: string
    position: { x: number; y: number }
    text: string
    topics: string[]
    dateModified: string
}

export type ChainEdge = {
    id: string
    source: string
    target: string
    label?: string
}

export type Chain = {
    _id: string
    name: string
    description?: string
    dateCreated: string
    lastModified: string
    nodes: ChainNode[]
    edges: ChainEdge[]
}