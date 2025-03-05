import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { _oid, mongodb } from "@/lib/db.server";
import { auth } from '@clerk/nextjs/server'

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

        const newThought = {
            name,
            text,
            topics: topics?.map((topic: string) => new _oid(topic)),
            createdAt: new Date()
        };

        const dbInstance = await mongodb();

        await dbInstance
            .collection("thoughts")
            .insertOne(newThought);

        return NextResponse.json(newThought, { status: 201 })

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}