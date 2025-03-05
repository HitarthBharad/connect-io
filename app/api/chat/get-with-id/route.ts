import { NextRequest, NextResponse } from "next/server";
import { mongodb } from "@/lib/db.server";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const messageId = searchParams.get("messageId");

  if (!messageId) {
    return NextResponse.json({ error: "Missing messageId" }, { status: 400 });
  }

  const dbInstance = await mongodb();
  const message = await dbInstance
    .collection("messages")
    .findOne({
      relatedMessageId: new ObjectId(messageId),
      processed: true
    });

  if (!message) {
    return NextResponse.json({ message: {}, count: 0 }, { status: 200 });
  }

  return NextResponse.json({message, count: 1}, {status: 200});
}