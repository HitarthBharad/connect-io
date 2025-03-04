export type Message = {
    _id: string
    chainId: string,
    content: string
    role: "user" | "assistant"
    createdAt: Date
}