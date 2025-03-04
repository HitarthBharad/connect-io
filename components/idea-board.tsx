"use client"
import "reactflow/dist/style.css"
import { TopicCluster } from "./topic-cluster"
import { ThoughtNote } from "./thought-note"
import { CustomEdge } from "./custom-edge"

// Define custom node types
const nodeTypes = {
  topicCluster: TopicCluster,
  thoughtNote: ThoughtNote,
}

// Define custom edge types
const edgeTypes = {
  custom: CustomEdge,
}

// Topic colors
const topicColors = [
  "bg-blue-50 dark:bg-blue-950",
  "bg-green-50 dark:bg-green-950",
  "bg-purple-50 dark:bg-purple-950",
  "bg-amber-50 dark:bg-amber-950",
  "bg-rose-50 dark:bg-rose-950",
  "bg-cyan-50 dark:bg-cyan-950",
  "bg-emerald-50 dark:bg-emerald-950",
  "bg-indigo-50 dark:bg-indigo-950",
]

// Initial nodes and edges are handled in ThoughtBoard component

export default function IdeaBoard() {
  //This component is a placeholder.  All logic is handled in ThoughtBoard
  return <div>Idea Board Placeholder</div>
}

