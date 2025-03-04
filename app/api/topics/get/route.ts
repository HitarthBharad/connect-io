import { NextResponse } from "next/server";
import { mongodb } from "@/lib/db.server";
import { auth } from '@clerk/nextjs/server'

export async function GET() {
    await auth.protect();
    
    try {
        const dbInstance = await mongodb();
        const topics = await dbInstance
            .collection("topics")
            .find({})
            .toArray();

        return NextResponse.json(topics, { status: 200 });
    }
    catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}