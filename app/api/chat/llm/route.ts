import { NextRequest, NextResponse } from "next/server";
import { storeMessageWithEmbedding } from "@/lib/chat/embeddings";
import sendMessage from "@/lib/chat/sendMessage";

export async function POST(request: NextRequest) {
    try {
        const { chainId, query } = await request.json();
        if (!chainId || !query) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const message = await storeMessageWithEmbedding(chainId, query, "user");

        const messageId = message._id.toString();

        sendMessage({ ...message, _id: messageId, role: "user" });

        return NextResponse.json({ messageId }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}