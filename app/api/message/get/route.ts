import { NextRequest, NextResponse } from "next/server";
import { mongodb } from "@/lib/db.server";
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
    await auth.protect();
    
    try {
        const body = await request.json();
        const { chainId } = body;
    
        const dbInstance = await mongodb();
        const messages = await dbInstance
            .collection("messages")
            .find({
                chainId: chainId
            })
            .sort({createdAt: 1})
            .toArray();

        return NextResponse.json(messages, { status: 200 });
    }
    catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}