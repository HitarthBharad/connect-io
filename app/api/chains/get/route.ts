import { NextRequest, NextResponse } from "next/server";
import { mongodb } from "@/lib/db.server";
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
    await auth.protect();

    try {
        const { userId } = await auth();

        const dbInstance = await mongodb();
        const topics = await dbInstance
            .collection("chains")
            .find({
                userId
            })
            .toArray();

        return NextResponse.json(topics, { status: 200 });
    }
    catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}