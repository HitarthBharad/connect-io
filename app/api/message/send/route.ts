import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { _oid, mongodb } from "@/lib/db.server";
import { Chain } from "@/types/chains";
import OpenAI from "openai";
import { env } from "@/lib/env";
import { auth } from '@clerk/nextjs/server'

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

function generatePrompt(graph: Chain, userQuestion: string) {
  let prompt = "You are a smart personal assitant who will provide personally curated answer given below context of interconnected thoughts:\n\n";

  graph.nodes.forEach(node => {
    prompt += `Node ${node.id}: "${node.text}" (Topics: ${node.topics.join(", ")})\n`;
  });

  prompt += "\nConnections:\n";
  graph.edges.forEach(edge => {
    prompt += `Node ${edge.source} ${edge.label || "connects to"} Node ${edge.target}\n`;
  });

  prompt += `\n${userQuestion}`;

  prompt += `\n return the answer in 100 to 200 words without mentioning any internal IDs. Only provide a simple text response without any rich text. You are not allowed to think beyond the scope of the given thoughts `
  return prompt;
}

const queryLLM = async (prompt: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0]?.message?.content || "No response";
}


export async function POST(request: NextRequest) {

  await auth.protect();
  
  try {
    const body = await request.json();
    const { chainId, content, role } = body;

    if (!chainId || !content || !role) {
      return NextResponse.json(
        { error: "Request not complete" },
        { status: 400 }
      )
    }

    const newMessage = {
      chainId,
      content,
      role,
      createdAt: new Date()
    };

    const dbInstance = await mongodb();

    const userQuestion = await dbInstance
      .collection("messages")
      .insertOne(newMessage);

    const chain = await dbInstance
      .collection("chains")
      .findOne({
        _id: new _oid(chainId)
      });

    const prompt = generatePrompt(chain as unknown as Chain, newMessage.content);
    const response = await queryLLM(prompt);

    const aiMessage = {
      chainId,
      content: response,
      role: "assistant",
      createdAt: new Date()
    };

    const aiResponse = await dbInstance
      .collection("messages")
      .insertOne({
        chainId,
        content: response,
        role: "assistant",
        createdAt: new Date()
      });

    return NextResponse.json([
      { ...newMessage, _id: userQuestion.insertedId },
      { ...aiMessage, _id: aiResponse.insertedId }
    ], { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}