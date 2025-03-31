import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { _oid, mongodb } from "@/lib/db.server";
import { auth } from '@clerk/nextjs/server'
import { generateEmbedding } from "@/lib/chat/embeddings";
import reduceEmbeddingDimension from "@/lib/chat/reduceEmbeddingDimension";
import processText from "@/lib/chat/processText";
// import { reduceEmbeddingDimension } from "@/lib/chat/reduceEmbeddingDimension";

export async function POST(request: NextRequest) {
    await auth.protect();

    try {
        const body = await request.json();
        const { name, text, topics } = body;

        if (!name || !text) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            )
        }

        const { userId } = await auth();

        if(!userId) {
            return NextResponse.json({success: false});
        }

        const newThought = {
            userId,
            name,
            text,
            topics: topics?.map((topic: string) => new _oid(topic)),
            processd: false,
            createdAt: new Date()
        };

        const dbInstance = await mongodb();

        const thoughtInstance = await dbInstance
            .collection("thoughts")
            .insertOne(newThought);

        processText(text, thoughtInstance.insertedId.toString(), userId);

        return NextResponse.json({...newThought, _id: thoughtInstance.insertedId}, { status: 201 })

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}