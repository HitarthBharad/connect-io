"use client"

import { useState } from "react"
import { useTopics } from "@/contexts/topic-context"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

const topicColors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-purple-100 text-green-800",
    "bg-amber-100 text-amber-800",
    "bg-rose-100 text-rose-800",
    "bg-cyan-100 text-cyan-800",
    "bg-emerald-100 text-emerald-800",
    "bg-indigo-100 text-indigo-800",
]

export default function TopicsPage() {
    const { topics, addTopic, updateTopic, deleteTopic } = useTopics()
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingTopic, setEditingTopic] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        label: "",
        color: topicColors[0],
    })

    const handleSubmit = () => {
        if (editingTopic) {
            updateTopic(editingTopic, formData)
            setIsEditOpen(false)
        } else {
            addTopic(formData)
            setIsAddOpen(false)
        }
        setFormData({ label: "", color: topicColors[0] })
        setEditingTopic(null)
    }

    const handleEdit = (topic: { _id: string; label: string; color: string }) => {
        setEditingTopic(topic._id)
        setFormData({ label: topic.label, color: topic.color })
        setIsEditOpen(true)
    }

    const gradientClasses = (baseColor: string) => {
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
    };

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Manage Topics</h1>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Topic
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Topic</DialogTitle>
                            <DialogDescription>Add a new topic to organize your thoughts.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.label}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="color">Color</Label>
                                <Select
                                    value={formData.color}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, color: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a color" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {topicColors.map((color, index) => (
                                            <SelectItem key={color} value={color}>
                                                <div className="flex items-center">
                                                    <div className={`mr-2 h-4 w-4 rounded ${color.split(" ")[0]}`} />
                                                    Color {index + 1}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit}>Create Topic</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 justify-center">
                {topics.map((topic) => (
                    <Card key={topic._id} className={`w-full max-w-[280px] ${gradientClasses(topic.color)}`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium">{topic.label}</CardTitle>
                            <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(topic)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" color="error" onClick={() => deleteTopic(topic._id)}>
                                    <Trash2 className="h-4 w-4 text-red-800 hover:text-red-900 cursor-pointer" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-4">
                                <div className={`h-4 w-4 rounded ${topic.color.split(" ")[0]}`} />
                                <CardDescription>0 thoughts</CardDescription>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Topic</DialogTitle>
                        <DialogDescription>Modify the topic&apos;s details.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.label}
                                onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-color">Color</Label>
                            <Select
                                value={formData.color}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, color: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a color" />
                                </SelectTrigger>
                                <SelectContent>
                                    {topicColors.map((color, index) => (
                                        <SelectItem key={color} value={color}>
                                            <div className="flex items-center">
                                                <div className={`mr-2 h-4 w-4 rounded ${color.split(" ")[0]}`} />
                                                Color {index + 1}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
