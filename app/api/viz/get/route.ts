import { NextRequest, NextResponse } from "next/server";
import { mongodb } from "@/lib/db.server";
import { auth } from '@clerk/nextjs/server';
import { DBSCAN } from 'density-clustering';

type Thought = {
    _id: string,
    embedding: number[],
    name: string,
    reducedEmbedding: number[],
    text: string,
    topics: string[],
    userId: string
}

function calculateDistance(embedding: any, otherEmbedding: any): number {
    return embedding.reduce((sum: number, value: number, idx: any) => {
        return sum + Math.pow(value - otherEmbedding[idx], 2);
    }, 0);
}

type Edge = {
    sourceNodeIndex: number,
    targetNodeIndex: number,
    distance: number
}

const generateRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const generateEdgesWithDBSCAN = (
    data: Thought[],
    eps: number = 0.5,
    minPoints: number = 2,
    k: number = 5
): { edges: Edge[], nodeColors: string[] } => {
    const edges: Edge[] = [];
    const nodeColors: string[] = [];
    const dbscan = new DBSCAN();

    const clusters = dbscan.run(data.map((d) => d.reducedEmbedding), eps, minPoints);

    const clusterColors = clusters.map(() => generateRandomColor());

    clusters.forEach((cluster, clusterIndex) => {
        if (cluster.length > 1) {
            cluster.forEach((i: number) => {
                nodeColors[i] = clusterColors[clusterIndex];
            });

            cluster.forEach((i: number) => {
                const closestNodes: { index: number; distance: number }[] = [];

                cluster.forEach((j: number) => {
                    if (i !== j) {
                        const distance = calculateDistance(data[i]?.reducedEmbedding, data[j]?.reducedEmbedding);
                        closestNodes.push({ index: j, distance });
                    }
                });

                closestNodes.sort((a, b) => a.distance - b.distance);
                for (let idx = 0; idx < Math.min(k, closestNodes.length); idx++) {
                    edges.push({
                        sourceNodeIndex: i,
                        targetNodeIndex: closestNodes[idx].index,
                        distance: closestNodes[idx].distance,
                    });
                }
            });
        }
    });

    return { edges, nodeColors };
};

export async function GET(request: NextRequest) {
    await auth.protect();
    try {
        const { userId } = await auth();

        if(!userId) {
            return NextResponse.json({
                status: false
            }, {status: 400});
        }
        const dbInstance = await mongodb();

        const thoughtList = await dbInstance
            .collection<Thought>("thoughts")
            .find({ userId: userId, processed: true })
            .toArray();

        const { edges, nodeColors } = generateEdgesWithDBSCAN(thoughtList);


        const nodes = thoughtList.map((t, index) => ({position: t.reducedEmbedding, label: t.name, description: t.text, _id: t._id, color: nodeColors[index]}));

        return NextResponse.json({edges, nodes}, {status: 200});
    }
    catch(err) {
        console.error(err);

        return NextResponse.json({
            status: false
        }, {status: 500});
    }
}