"use client";

import { Topic } from "@/types/topics";
import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

type TopicContextType = {
  topics: Topic[];
  addTopic: (topic: Omit<Topic, "_id" | "thoughtCount">) => Promise<void>;
  updateTopic: (_id: string, topic: Partial<Topic>) => Promise<void>;
  deleteTopic: (_id: string) => Promise<void>;
};

const TopicContext = createContext<TopicContextType | undefined>(undefined);

export function TopicProvider({ children }: { children: React.ReactNode }) {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch("/api/topics/get");
        if (!response.ok) toast.error("Something went wrong");
        const data: Topic[] = await response.json();
        setTopics(data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, []);

  const addTopic = async (topic: Omit<Topic, "_id" | "thoughtCount">) => {
    try {
      const response = await fetch("/api/topics/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...topic, thoughtCount: 0 }),
      });

      if (!response.ok) toast.error("Something went wrong while creating a new topic");

      const newTopic: Topic = await response.json();
      setTopics((prev) => [...prev, newTopic]);
    } catch (error) {
      console.error("Error adding topic:", error);
    }
  };

  // ✅ Update a topic via API
  const updateTopic = async (_id: string, topic: Partial<Topic>) => {
    try {
      topic = { ...topic, _id };

      const response = await fetch(`/api/topics/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...topic}),
      });

      if (!response.ok) toast.error("Something went wrong while updating your topic");

      setTopics((prev) => prev.map((t) => (t._id === _id ? { ...t, ...topic } : t)));
    } catch (error) {
      console.error("Error updating topic:", error);
    }
  };

  // ✅ Delete a topic via API
  const deleteTopic = async (_id: string) => {
    try {
      const topic = { _id };

      const response = await fetch(`/api/topics/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...topic}),
      });

      if (!response.ok) throw new Error("Failed to delete topic");

      setTopics((prev) => prev.filter((t) => t._id !== _id));
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

  return (
    <TopicContext.Provider value={{ topics, addTopic, updateTopic, deleteTopic }}>
      {children}
    </TopicContext.Provider>
  );
}

export function useTopics() {
  const context = useContext(TopicContext);
  if (context === undefined) {
    throw new Error("useTopics must be used within a TopicProvider");
  }
  return context;
}