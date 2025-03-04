"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RichTextEditor } from "@/components/rich-text-editor"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export function Journal() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would typically save the journal entry to a database
    console.log({ title, content, images })

    toast({
      title: "Journal Entry Saved",
      description: "Your journal entry has been saved successfully.",
    })
  }

  const handleImageUpload = (newImages: string[]) => {
    setImages((prev) => [...prev, ...newImages])
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create Journal Entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Journal Title</Label>
            <Input
              id="title"
              placeholder="Enter a title for your journal entry"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Journal Content</Label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          {/* <ImageUpload onUpload={handleImageUpload} /> */}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Save Journal Entry
          </Button>
        </CardFooter>
      </form>
      <Toaster />
    </Card>
  )
}

