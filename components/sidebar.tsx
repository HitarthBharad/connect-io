"use client"

import React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { useTopics } from "@/contexts/topic-context"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Brain, FolderCog } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onTopicFilter?: (topicIds: string[]) => void
}

export function Sidebar({ className, onTopicFilter }: SidebarProps) {
  const pathname = usePathname()
  const { topics } = useTopics()
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>([])

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics((prev) => {
      const newSelection = prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
      onTopicFilter?.(newSelection)
      return newSelection
    })
  }

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Navigation</h2>
          <div className="space-y-1">
            <Link href="/thoughts">
              <Button variant={pathname === "/thoughts" ? "secondary" : "ghost"} className="w-full justify-start">
                <Brain className="mr-2 h-4 w-4" />
                Thoughts
              </Button>
            </Link>
            <Link href="/topics">
              <Button variant={pathname === "/topics" ? "secondary" : "ghost"} className="w-full justify-start">
                <FolderCog className="mr-2 h-4 w-4" />
                Manage Topics
              </Button>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Filter by Topics</h2>
          <ScrollArea className="h-[300px] px-4">
            <div className="space-y-2">
              {topics.map((topic) => (
                <div key={topic.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={topic.id}
                    checked={selectedTopics.includes(topic.id)}
                    onCheckedChange={() => handleTopicToggle(topic.id)}
                  />
                  <label
                    htmlFor={topic.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {topic.label}
                  </label>
                  <div className={`h-3 w-3 rounded-full ${topic.color.split(" ")[0]}`} />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

