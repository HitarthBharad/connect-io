import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { mongodb } from "@/lib/db.server";
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  await auth.protect();
  try {
    const body = await request.json();
    const { label, color } = body;

    if (!label || !color) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    const newTopic = {
      label,
      color,
      createdAt: new Date()
    };

    const dbInstance = await mongodb();

    await dbInstance
    .collection("topics")
    .insertOne(newTopic);

    return NextResponse.json(newTopic, { status: 201 })

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}