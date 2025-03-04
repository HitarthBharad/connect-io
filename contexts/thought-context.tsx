"use client"

import { Thought } from "@/types/thoughts"
import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"

type ThoughtContextType = {
  thoughts: Thought[]
  addThought: (thought: Omit<Thought, "_id" | "dateModified">) => void
  updateThought: (_id: string, thought: Partial<Thought>) => void
  deleteThought: (_id: string) => void
  filteredThoughts: (topicIds: string[]) => Thought[]
}

const ThoughtContext = createContext<ThoughtContextType | undefined>(undefined)

export function ThoughtProvider({ children }: { children: React.ReactNode }) {
  const [thoughts, setThoughts] = useState<Thought[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("thoughts")
      return saved ? JSON.parse(saved) : []
    }
    return []
  });

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch("/api/thoughts/get");
        if (!response.ok) toast.error("Something went wrong");
        const data: Thought[] = await response.json();
        setThoughts(data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, []);

  const addThought = async (thought: Omit<Thought, "_id" | "dateModified">) => {
    try {
      const response = await fetch("/api/thoughts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(thought),
      });

      if (!response.ok) toast.error("Something went wrong while creating a new topic");

      const newThought: Thought = await response.json();
      setThoughts((prev) => [...prev, newThought]);
    } catch (error) {
      console.error("Error adding thought:", error);
    }
  }

  const updateThought = async (_id: string, thought: Partial<Thought>) => {
    try {

      const response = await fetch(`/api/thoughts/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...thought, _id}),
      });

      if (!response.ok) toast.error("Something went wrong while updating your topic");

      setThoughts((prev) => prev.map((t) => (t._id === _id ? { ...t, ...{...thought, _id} } : t)));
    } catch (error) {
      console.error("Error updating topic:", error);
    }
  }

  const deleteThought = async (_id: string) => {
    try {
      const topic = {_id};

      const response = await fetch(`/api/thoughts/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(topic),
      });

      if (!response.ok) toast.error("Something went wrong while deleting the thought");

      setThoughts((prev) => prev.filter((t) => t._id !== _id));
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  }

  const filteredThoughts = (topicIds: string[]) => {
    if (topicIds.length === 0) return thoughts
    return thoughts.filter((thought) => thought.topics.some((topicId) => topicIds.includes(topicId)))
  }

  return (
    <ThoughtContext.Provider
      value={{
        thoughts,
        addThought,
        updateThought,
        deleteThought,
        filteredThoughts,
      }}
    >
      {children}
    </ThoughtContext.Provider>
  )
}

export function useThoughts() {
  const context = useContext(ThoughtContext)
  if (context === undefined) {
    throw new Error("useThoughts must be used within a ThoughtProvider")
  }
  return context
}

