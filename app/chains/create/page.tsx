"use client"

import { useState, useCallback } from "react"
import { ChainBoard } from "@/components/chain-board"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTopics } from "@/contexts/topic-context"

export default function CreateChainPage() {
  const { topics } = useTopics()
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [topicSelectOpen, setTopicSelectOpen] = useState(false)
  const [isStarted, setIsStarted] = useState(false)

  const handleStart = useCallback(() => {
    if (selectedTopics.length > 0) {
      setIsStarted(true)
    }
  }, [selectedTopics])

  if (isStarted) {
    return <ChainBoard selectedTopics={selectedTopics} />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 items-center justify-center">
        <div className="mx-auto w-full max-w-sm space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Select Topics</h2>
            <p className="text-sm text-muted-foreground">Choose one or more topics to create a thought chain</p>
          </div>
          <Popover open={topicSelectOpen} onOpenChange={setTopicSelectOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={topicSelectOpen}
                className="w-full justify-between"
              >
                {selectedTopics.length === 0 ? "Select topics..." : `${selectedTopics.length} topics selected`}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search topics..." />
                <CommandList>
                  <CommandEmpty>No topics found.</CommandEmpty>
                  <CommandGroup>
                    {topics.map((topic) => (
                      <CommandItem
                        key={topic._id}
                        onSelect={() => {
                          setSelectedTopics((prev) => {
                            const topics = prev.includes(topic._id)
                              ? prev.filter((t) => t !== topic._id)
                              : [...prev, topic._id]
                            return topics
                          })
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedTopics.includes(topic._id) ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {topic.label}
                        <div className={`ml-auto h-3 w-3 rounded-full ${topic.color.split(" ")[0]}`} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Button className="w-full" onClick={handleStart} disabled={selectedTopics.length === 0}>
            Create Chain
          </Button>
        </div>
      </div>
    </div>
  )
}

