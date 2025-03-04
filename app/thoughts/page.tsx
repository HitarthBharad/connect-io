"use client"

import { useState } from "react"
import { useTopics } from "@/contexts/topic-context"
import { useThoughts } from "@/contexts/thought-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Plus, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { RichTextEditor } from "@/components/rich-text-editor"

const getContentPreview = (htmlContent: string) => {
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = htmlContent
    const textContent = tempDiv.textContent || tempDiv.innerText || ""
    const words = textContent.trim().split(/\s+/)
    const preview = words.slice(0, 20).join(" ")
    return words.length > 20 ? `${preview}...` : preview
}

export default function ThoughtsPage() {
    const { topics } = useTopics()
    const { thoughts, addThought, updateThought, deleteThought, filteredThoughts } = useThoughts()
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingThought, setEditingThought] = useState<string | null>(null)
    const [selectedTopics, setSelectedTopics] = useState<string[]>([])
    const [formData, setFormData] = useState({
        name: "",
        text: "",
        topics: [] as string[],
    })
    const [topicSelectOpen, setTopicSelectOpen] = useState(false)
    const [filterTopics, setFilterTopics] = useState<string[]>([])

    const displayedThoughts = filteredThoughts(filterTopics)

    const handleSubmit = () => {
        if (editingThought) {
            console.log(editingThought);
            updateThought(editingThought, formData)
            setIsEditOpen(false)
        } else {
            addThought({
                name: formData.name,
                text: formData.text,
                topics: formData.topics,
            })
            setIsAddOpen(false)
        }
        setFormData({ name: "", text: "", topics: [] })
        setEditingThought(null)
    }

    const handleEdit = (thought: {
        _id: string
        name: string,
        text: string,
        topics: string[]
    }) => {
        setEditingThought(thought._id)
        setFormData({
            name: thought.name,
            text: thought.text,
            topics: thought.topics
        })
        setIsEditOpen(true)
    }

    const gradientClasses = (thoughtTopics: string[]) => {
        const colors = thoughtTopics
            .map(topicId => {
                const topic = topics.find(t => t._id === topicId);
                return topic?.color;
            })
            .filter(Boolean);

        if (colors.length == 0) {
            return "relative overflow-hidden bg-gradient-to-br from-white via-white to-gray-50 before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-gray-400 before:to-gray-200";
        }

        const colorMap: Record<string, string> = {
            "blue": "to-blue-100 before:from-blue-400 after:to-blue-200",
            "green": "to-green-100 before:from-green-400 after:to-green-200",
            "purple": "to-purple-100 before:from-purple-400 after:to-purple-200",
            "amber": "to-amber-100 before:from-amber-400 after:to-amber-200",
            "rose": "to-rose-100 before:from-rose-400 after:to-rose-200",
            "cyan": "to-cyan-100 before:from-cyan-400 after:to-cyan-200",
            "emerald": "to-emerald-100 before:from-emerald-400 after:to-emerald-200",
            "indigo": "to-indigo-100 before:from-indigo-400 after:to-indigo-200",
        };

        const extractColor = (color: string | undefined) => {
            const match = color?.match(/bg-(\w+)-100/);
            return match ? match[1] : "gray";
        };

        const primaryColor = extractColor(colors[0] || "gray");
        const secondaryColor = colors.length > 1 ? extractColor(colors[1] || "gray") : primaryColor;

        return cn(
            "relative overflow-hidden bg-gradient-to-br from-white",
            `via-${primaryColor}-100 to-${secondaryColor}-100`, // Card Background Gradient
            "before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r",
            `before:from-${primaryColor}-400 before:via-${primaryColor}-300 before:to-${secondaryColor}-200` // Top Border Gradient
        );
    };

    /*
        const colorMap: Record<string, string> = {
            "blue": "to-blue-100 before:from-blue-400 after:to-blue-200",
            "green": "to-green-100 before:from-green-400 after:to-green-200",
            "purple": "to-purple-100 before:from-purple-400 after:to-purple-200",
            "amber": "to-amber-100 before:from-amber-400 after:to-amber-200",
            "rose": "to-rose-100 before:from-rose-400 after:to-rose-200",
            "cyan": "to-cyan-100 before:from-cyan-400 after:to-cyan-200",
            "emerald": "to-emerald-100 before:from-emerald-400 after:to-emerald-200",
            "indigo": "to-indigo-100 before:from-indigo-400 after:to-indigo-200",
        };

        const extractColor = (color: string) => {
            const match = color.match(/bg-(\w+)-100/);
            return match ? match[1] : "gray";
        };

        const primaryColor = extractColor(baseColor);

        return cn([
            "relative overflow-hidden bg-gradient-to-br from-white via-white",
            colorMap[primaryColor] || "to-gray-100 before:from-gray-400 after:to-gray-200",
        ]);
    */

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Thoughts</h1>
                    <p className="text-muted-foreground">Capture and organize your thoughts.</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Thought
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Thought</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-4 py-4">
                                <Label htmlFor="name">Journal Title</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter a title for your journal entry"
                                    value={formData.name}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Content</Label>
                                <RichTextEditor
                                    value={formData.text}
                                    onChange={(newValue) => setFormData((prev) => ({ ...prev, text: newValue }))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Topics</Label>
                                <Popover open={topicSelectOpen} onOpenChange={setTopicSelectOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={topicSelectOpen}
                                            className="justify-between"
                                        >
                                            {formData.topics.length === 0 ? "Select topics..." : `${formData.topics.length} selected`}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search topics..." />
                                            <CommandList>
                                                <CommandEmpty>No topics found.</CommandEmpty>
                                                <CommandGroup>
                                                    {topics.map((topic) => (
                                                        <CommandItem
                                                            key={topic._id}
                                                            onSelect={() => {
                                                                setFormData((prev) => {
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
                                                                    formData.topics.includes(topic._id) ? "opacity-100" : "opacity-0",
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
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit}>Create Thought</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayedThoughts.map((thought) => (
                    <Card key={thought._id}
                        className={gradientClasses(thought.topics)}
                    // className="relative overflow-hidden bg-gradient-to-br from-white via-white to-blue-100 text-blue-800 
                    // before:absolute before:top-0 before:left-0 before:right-0 before:h-1 
                    // before:bg-gradient-to-r before:from-blue-100 before:via-amber-100 before:to-amber-100"      
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-base font-medium">{thought.name}</CardTitle>
                            <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(thought)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => deleteThought(thought._id)}>
                                    <Trash2 className="h-4 w-4 text-red-800 hover:text-red-900 cursor-pointer" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {thought?.topics?.map((topicId) => {
                                    const topic = topics.find((t) => t._id === topicId)
                                    if (!topic) return null
                                    return (
                                        <div
                                            key={topicId}
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${topic.color
                                                }`}
                                        >
                                            {topic.label}
                                        </div>
                                    )
                                })}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2 mt-2">{getContentPreview(thought.text)}</p>
                            <CardDescription className="mt-2 text-sm font-mono text-gray-500 italic">
                                Modified: {new Date().toDateString()}
                            </CardDescription>              
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Thought</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-4 py-4">
                            <Label htmlFor="edit-name">Journal Title</Label>
                            <Input
                                id="edit-name"
                                placeholder="Enter a title for your journal entry"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Content</Label>
                            <RichTextEditor
                                value={formData.text}
                                onChange={(newValue) => setFormData((prev) => ({ ...prev, text: newValue }))}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Topics</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" className="justify-between">
                                        {formData.topics.length === 0 ? "Select topics..." : `${formData.topics.length} selected`}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search topics..." />
                                        <CommandList>
                                            <CommandEmpty>No topics found.</CommandEmpty>
                                            <CommandGroup>
                                                {topics.map((topic) => (
                                                    <CommandItem
                                                        key={topic._id}
                                                        onSelect={() => {
                                                            setFormData((prev) => {
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
                                                                formData.topics.includes(topic._id) ? "opacity-100" : "opacity-0",
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
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}