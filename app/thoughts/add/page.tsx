"use client";

import RichTextEditor from "@/components/text-editor/editor";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useThoughts } from "@/contexts/thought-context";
import { useTopics } from "@/contexts/topic-context";
import generateRandomTailwindColor from "@/lib/generateColor";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InsertThought() {
    const router = useRouter();
    const { topics, addTopic } = useTopics();
    const { addThought } = useThoughts();
    const { toast } = useToast();

    const [topicSelectOpen, setTopicSelectOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        text: "",
        topics: [] as string[],
    });

    const setContent = (text: string) => {
        setFormData(prev => ({ ...prev, text }));
    };

    const onSubmit = async () => {
        setLoading(true);
        const thoght = await addThought(formData);

        if(thoght) {
            setFormData({
                name: "",
                text: "",
                topics: [] as string[],
            });
            setLoading(false);
            router.push("/thoughts");
        }

        setLoading(false);
        toast({
            title: "Oops!",
            description: "Unable to handle your request at the moment"
        })
    }

    return (
        <div className="grid gap-4">
            <div className="flex items-center justify-between">
                <h1 className="">Add your entry</h1>
                <Button
                    color="primary"
                    onClick={onSubmit}
                    className="w-32 mt-4"
                    disabled={loading}
                >
                    Add
                </Button>
            </div>
            <div className="flex gap-4">
                <div className="flex flex-col w-1/2">
                    <Label htmlFor="name" className="mb-2">Journal Title</Label>
                    <Input
                        id="name"
                        placeholder="Enter a title for your journal entry"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        disabled={loading}
                        required
                    />
                </div>

                <div className="flex flex-col w-1/2">
                    <Label className="mb-2">Topics</Label>
                    <Popover open={topicSelectOpen} onOpenChange={setTopicSelectOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={topicSelectOpen}
                                className="justify-between w-full"
                                disabled={loading}
                            >
                                {formData.topics.length === 0 ? "Select topics..." : `${formData.topics.length} selected`}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput
                                    placeholder="Search topics..."
                                    value={searchTerm}
                                    disabled={loading}
                                    onValueChange={setSearchTerm}
                                    onKeyDown={async (e) => {
                                        if (e.key === "Enter" && searchTerm.trim() !== "") {
                                            if (highlightedIndex !== -1) {
                                                const selectedTopic = topics[highlightedIndex];
                                                setFormData((prev) => {
                                                    const topics = prev.topics.includes(selectedTopic._id)
                                                        ? prev.topics
                                                        : [...prev.topics, selectedTopic._id];
                                                    return { ...prev, topics };
                                                });
                                                setSearchTerm("");
                                                return;
                                            }

                                            const newColor = generateRandomTailwindColor();
                                            const newTopic = await addTopic({ label: searchTerm, color: newColor });

                                            if (newTopic) {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    topics: [...prev.topics, newTopic._id]
                                                }));
                                                setSearchTerm(""); 
                                            } else {
                                                toast({
                                                    title: "Error",
                                                    description: "Oops, Something went wrong!"
                                                });
                                            }
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                <CommandList>
                                    <CommandEmpty>No topics found. Press enter to add new topic.</CommandEmpty>
                                    <CommandGroup>
                                        {topics.map((topic, index) => (
                                            <CommandItem
                                                key={topic._id}
                                                onSelect={() => {
                                                    setFormData((prev) => {
                                                        const updatedTopics = prev.topics.includes(topic._id)
                                                            ? prev.topics.filter(t => t !== topic._id)
                                                            : [...prev.topics, topic._id];
                                                        return { ...prev, topics: updatedTopics };
                                                    });
                                                    setSearchTerm(""); 
                                                }}
                                                onMouseEnter={() => setHighlightedIndex(index)} 
                                                onMouseLeave={() => setHighlightedIndex(-1)} 
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        formData.topics.includes(topic._id) ? "opacity-100" : "opacity-0"
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
            <hr />

            <div className="grid gap-4">
                {
                    loading ? (
                        <div className="flex items-center space-x-4 w-full h-full">
                            <Skeleton className="h-full w-full rounded-full" />
                        </div>
                    ) : (
                        <RichTextEditor content={formData.text} setContent={setContent} />
                    )
                }
            </div>
        </div>
    )
}