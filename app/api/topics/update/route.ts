import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { _oid, mongodb } from "@/lib/db.server";
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
    await auth.protect();

    try {
        const body = await request.json();
        const { label, color, _id } = body;

        if (!_id) {
            return NextResponse.json(
                { error: "ID is required" },
                { status: 400 }
            )
        }

        if (!label || !color) {
            return NextResponse.json(
                { error: "Label and Color is required" },
                { status: 400 }
            )
        }
        
        const { userId } = await auth();

        const topic = {
            label,
            userId,
            color,
            updatedAt: new Date()
        };

        const dbInstance = await mongodb();

        await dbInstance
            .collection("topics")
            .updateOne(
                { _id: new _oid(_id) },
                { $set: topic }
            );

        return NextResponse.json(topic, { status: 201 })
    }
    catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}