import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { _oid, mongodb } from "@/lib/db.server";
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
    await auth.protect();
    
    try {
        const body = await request.json();
        const { _id, name, text, topics } = body;

        const { userId } = await auth();

        if (!_id) {
            return NextResponse.json(
                { error: "ID is required" },
                { status: 400 }
            )
        }

        if (!name || !text ) {
            return NextResponse.json(
                { error: "Label and Color is required" },
                { status: 400 }
            )
        }

        const thought = {
            name,
            text,
            userId,
            topics: topics?.map((topic: string) => new _oid(topic)),
            updatedAt: new Date()
        };

        const dbInstance = await mongodb();

        await dbInstance
            .collection("thoughts")
            .updateOne(
                { _id: new _oid(_id) },
                { $set: thought }
            );

        return NextResponse.json(thought, { status: 201 })
    }
    catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}