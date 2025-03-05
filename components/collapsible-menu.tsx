"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Check, ChevronsUpDown, Menu, Plus, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTopics } from "@/contexts/topic-context"
import { useThoughts } from "@/contexts/thought-context"
import type { Node } from "reactflow"

interface CollapsibleMenuProps {
  selectedNode: Node | null
  setSelectedNode: (node: Node | null) => void
  selectedTopics: string[]
}

export function CollapsibleMenu({ selectedNode, setSelectedNode, selectedTopics }: CollapsibleMenuProps) {
  const { topics } = useTopics()
  const { addThought, updateThought, deleteThought } = useThoughts()
  const [isAddingThought, setIsAddingThought] = useState(false)
  const [isEditingThought, setIsEditingThought] = useState(false)
  const [newThoughtData, setNewThoughtData] = useState({ name: "", text: "", topics: [] as string[] })
  const [topicSelectOpen, setTopicSelectOpen] = useState(false)

  // Add a new thought
  const addNewThought = useCallback(() => {
    if (newThoughtData.topics.length > 0) {
      const thoughtData = {
        name: newThoughtData.name,
        text: newThoughtData.text,
        topics: newThoughtData.topics,
        position: { x: Math.random() * 400 + 50, y: Math.random() * 400 + 50 },
      }

      addThought(thoughtData)
      setNewThoughtData({ name: "", text: "", topics: [] })
      setIsAddingThought(false)
    }
  }, [newThoughtData, addThought])

  // Edit an existing thought
  const editThought = useCallback(() => {
    if (selectedNode) {
      updateThought(selectedNode.id, {
        text: newThoughtData.text,
        topics: newThoughtData.topics,
      })
      setIsEditingThought(false)
      setSelectedNode(null)
    }
  }, [selectedNode, newThoughtData, updateThought, setSelectedNode])

  // Delete selected thought
  const deleteSelected = useCallback(() => {
    if (selectedNode) {
      deleteThought(selectedNode.id)
      setSelectedNode(null)
    }
  }, [selectedNode, deleteThought, setSelectedNode])

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="absolute left-4 top-4 z-10">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Thought Actions</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <Button className="w-full justify-start" onClick={() => setIsAddingThought(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Thought
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => {
                if (selectedNode) {
                  setNewThoughtData({
                    name: selectedNode.data.name,
                    text: selectedNode.data.text,
                    topics: selectedNode.data.topics,
                  })
                  setIsEditingThought(true)
                }
              }}
              disabled={!selectedNode}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Thought
            </Button>
            <Button
              className="w-full justify-start"
              variant="destructive"
              onClick={deleteSelected}
              disabled={!selectedNode}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Thought
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Thought Dialog */}
      <Dialog open={isAddingThought} onOpenChange={setIsAddingThought}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Thought</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="thoughtText">Thought</Label>
              <Input
                id="thoughtText"
                value={newThoughtData.text}
                onChange={(e) => setNewThoughtData({ ...newThoughtData, text: e.target.value })}
                placeholder="Enter your thought"
              />
            </div>
            <div className="grid gap-2">
              <Label>Topics</Label>
              <Popover open={topicSelectOpen} onOpenChange={setTopicSelectOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={topicSelectOpen} className="justify-between">
                    {newThoughtData.topics.length === 0
                      ? "Select topics..."
                      : `${newThoughtData.topics.length} selected`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search topics..." />
                    <CommandList>
                      <CommandEmpty>No topics found.</CommandEmpty>
                      <CommandGroup>
                        {topics
                          .filter((topic) => selectedTopics.includes(topic._id))
                          .map((topic) => (
                            <CommandItem
                              key={topic._id}
                              onSelect={() => {
                                setNewThoughtData((prev) => {
                                  const topics = prev.topics.includes(topic._id)
                                    ? prev.topics.filter((t) => t !== topic._id)
                                    : [...prev.topics, topic._id]
                                  return { ...prev, topics }
                                })
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  newThoughtData.topics.includes(topic._id) ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {topic.label}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingThought(false)}>
              Cancel
            </Button>
            <Button onClick={addNewThought} disabled={newThoughtData.topics.length === 0}>
              Add Thought
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Thought Dialog */}
      <Dialog open={isEditingThought} onOpenChange={setIsEditingThought}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Thought</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editThoughtText">Thought</Label>
              <Input
                id="editThoughtText"
                value={newThoughtData.text}
                onChange={(e) => setNewThoughtData({ ...newThoughtData, text: e.target.value })}
                placeholder="Enter your thought"
              />
            </div>
            <div className="grid gap-2">
              <Label>Topics</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="justify-between">
                    {newThoughtData.topics.length === 0
                      ? "Select topics..."
                      : `${newThoughtData.topics.length} selected`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search topics..." />
                    <CommandList>
                      <CommandEmpty>No topics found.</CommandEmpty>
                      <CommandGroup>
                        {topics
                          .filter((topic) => selectedTopics.includes(topic._id))
                          .map((topic) => (
                            <CommandItem
                              key={topic._id}
                              onSelect={() => {
                                setNewThoughtData((prev) => {
                                  const topics = prev.topics.includes(topic._id)
                                    ? prev.topics.filter((t) => t !== topic._id)
                                    : [...prev.topics, topic._id]
                                  return { ...prev, topics }
                                })
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  newThoughtData.topics.includes(topic._id) ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {topic.label}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingThought(false)}>
              Cancel
            </Button>
            <Button onClick={editThought} disabled={newThoughtData.topics.length === 0}>
              Update Thought
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

