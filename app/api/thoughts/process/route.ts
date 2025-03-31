import { generateEmbedding } from "@/lib/chat/embeddings";
import processText from "@/lib/chat/processText";
import TempEmbed from "@/lib/chat/temp";
import { _oid, mongodb } from "@/lib/db.server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    // const dbInstance = await mongodb();

    // await dbInstance
    // .collection("thoughts")
    // .updateMany({ userId: "user_2trzJ8YoqWOzCUx9Xlkl28cjW0Y" }, {$set: {processed: true}});
    // return NextResponse.json({status: "OK" }, { status: 200 });
    
    return NextResponse.json({status: "OK", data: await processText("processText", "67e9b941dd027d0838c1a2de", "user_2trzJ8YoqWOzCUx9Xlkl28cjW0Y") }, { status: 200 });
}