import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { _oid, mongodb } from "@/lib/db.server";
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  await auth.protect();

  try {
    const body = await request.json();
    const { chainId, content, role } = body;

    if (!chainId || !content || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const db = await mongodb();
    const newMessage = { chainId, content, role, createdAt: new Date() };

    await db.collection("messages").insertOne(newMessage);

    // Trigger async OpenAI response processing
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/process-response`, {
      method: "POST",
      body: JSON.stringify({ chainId, userMessage: content })
    });

    return NextResponse.json({ message: "Message received, processing response..." }, { status: 202 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}