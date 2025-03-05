import OpenAI from "openai";
import { mongodb } from "../db.server";
import { env } from "../env";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export const generateEmbedding = async (text: string) => {
    const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
    });

    return response.data[0].embedding;
};

export const storeMessageWithEmbedding = async (chainId: string, content: string, role: string) => {
    const embedding = await generateEmbedding(content);
    const dbInstance = await mongodb();

    const message = {
        chainId,
        content,
        role,
        embedding,
        processed: false,
        relatedMessageId: null,
        createdAt: new Date(),
    };

    const messageWithId = await dbInstance.collection("messages").insertOne(message);
    return {...message, _id: messageWithId.insertedId};
};