import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { mongodb } from "@/lib/db.server";
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
    await auth.protect()

    try {
        const body = await request.json();
        const { name, nodes, edges } = body;

        const { userId } = await auth();

        if (!nodes || !edges || !name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            )
        }

        const newChain = {
            userId,
            nodes,
            edges,
            name,
            createdAt: new Date()
        };

        const dbInstance = await mongodb();

        await dbInstance
            .collection("chains")
            .insertOne(newChain);

        return NextResponse.json(newChain, { status: 201 })

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}