import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { _oid, mongodb } from "@/lib/db.server";
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
    await auth.protect();
    
    try {
        const body = await request.json();
        const { _id } = body;

        if (!_id) {
            return NextResponse.json(
                { error: "ID is required" },
                { status: 400 }
            )
        }

        const dbInstance = await mongodb();

        await dbInstance
            .collection("thoughts")
            .deleteOne({ _id: new _oid(_id) });

        return NextResponse.json({ success: true, message: "Thought removed" }, { status: 200 })

    }
    catch (err) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}