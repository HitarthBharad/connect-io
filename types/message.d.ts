export type Message = {
    _id: string
    chainId: string,
    embedding: any,
    content: string
    role: "user" | "assistant"
    createdAt: Date
}