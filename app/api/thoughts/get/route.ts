import { NextResponse } from "next/server";
import { mongodb } from "@/lib/db.server";
import { auth } from '@clerk/nextjs/server'

export async function GET() {
    await auth.protect();
    try {
        const dbInstance = await mongodb();
        const thoughts = await dbInstance
            .collection("thoughts")
            .find({})
            .toArray();

        return NextResponse.json(thoughts, { status: 200 });
    }
    catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}