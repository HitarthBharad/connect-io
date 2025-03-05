import { _oid, mongodb } from "@/lib/db.server";
import { cosineSimilarity } from "./consineSimilarity";

type RelevantMessageType = {
    content: string,
    _id: string,
    similarity: number
}

type GetMessageType = (userMessageId: string, chainId: string, queryEmbedding: number[]) => Promise<RelevantMessageType[]>;

const getRelevantMessages: GetMessageType = async (userMessageId, chainId, queryEmbedding) => {
    const dbInstance = await mongodb();

    const messages = await dbInstance
        .collection("messages")
        .find({
            chainId, 
            embedding: {
                $exists: true,
                $type: "array"
            },
            $expr: {
                $allElementsTrue: {
                    $map: {
                        input: "$embedding",
                        as: "item",
                        in: { $isNumber: "$$item" }
                    }
                }
            }
        })
        .project({ _id: 1, content: 1, embedding: 1 })
        .toArray();

    console.log("Chain ID :" + chainId);
    console.log("Messages found in this chain : " + messages.length);

    if(messages.length> 0) {
        const FormattedMessages: RelevantMessageType[] = messages.map(msg => ({
            _id: msg._id.toString(),
            content: msg.content,
            similarity: cosineSimilarity(queryEmbedding, msg.embedding)
        }));
    
        return FormattedMessages
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5);
    }
    return []
};

export default getRelevantMessages;