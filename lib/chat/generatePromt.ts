import { Chain } from "@/types/chains";
import { WithId } from "mongodb";

const generatePrompt = (context: string, graph: WithId<Chain> , userQuestion: string) => {
    let prompt = "You are a smart personal assitant who will provide personally curated answer given below context of interconnected thoughts. return the answer in 100 to 200 words without mentioning any internal IDs. Only provide a simple text response without any rich text. You are not allowed to think beyond the scope of the given thoughts, Thoughts: \n\n";
  
    graph.nodes.forEach(node => {
      prompt += `Node ${node.id}: "${node.text}" (Topics: ${node.topics.join(", ")})\n`;
    });
  
    prompt += "\nConnections:\n";
    graph.edges.forEach(edge => {
      prompt += `Node ${edge.source} ${edge.label || "connects to"} Node ${edge.target}\n`;
    });

    prompt += `\nContext:\n${context}\n`;
  
    prompt += `\nUser: ${userQuestion}\n`;
  
    prompt += `\n  `
    return prompt;
}

export default generatePrompt;