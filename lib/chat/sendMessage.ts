import { Message } from "@/types/message";
import OpenAI from "openai";
import { env } from "process";
import generatePrompt from "./generatePromt";
import getRelevantMessages from "./getMessages";
import { _oid, mongodb } from "../db.server";
import { Chain } from "@/types/chains";
import { WithId } from "mongodb";
import { storeMessageWithEmbedding } from "./embeddings";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

const sendMessage = async (message: Message) => {

    const relevantMessages = await getRelevantMessages(message?._id.toString(), message?.chainId, message?.embedding);
    const context = relevantMessages.map(msg => msg?.content).join("\n");
    const dbInstance = await mongodb();
    const chain = await dbInstance
    .collection("chains")
    .findOne({_id: new _oid(message?.chainId)}) as WithId<Chain> | null;

    if(chain) {
        const prompt = generatePrompt(context, chain, message?.content);
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const aiMessage = await storeMessageWithEmbedding(message.chainId, response.choices[0]?.message?.content || "No response", "assistant");

        await dbInstance
        .collection("messages")
        .updateOne({_id: new _oid(aiMessage._id)}, {$set: {relatedMessageId: new _oid(message?._id), processed: true}});

        await dbInstance
        .collection("messages")
        .updateOne({_id: new _oid(message._id)}, {$set: {relatedMessageId: new _oid(aiMessage?._id), processed: true}});
    }
    return;
}

export default sendMessage;