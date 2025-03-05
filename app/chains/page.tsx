"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useChains } from "@/contexts/chain-context"
import { Edit, MoreHorizontal, Plus, Trash2, MessageSquare, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { Message } from "@/types/message"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

export default function ChainsPage() {
    const { chains, deleteChain } = useChains()
    const { toast } = useToast()
    const router = useRouter()
    const [isImporting, setIsImporting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [chainToDelete, setChainToDelete] = useState<string | null>(null)

    const [isChatting, setIsChatting] = useState(false)
    const [activeChatChain, setActiveChatChain] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [loadingChat, setLoadingChat] = useState<boolean>(false);
    const [sendingMessage, setSendingMessage] = useState<boolean>(false);

    //   const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0]
    //     if (!file) return

    //     try {
    //       await importChain(file)
    //       toast({
    //         title: "Chain imported",
    //         description: "The chain was successfully imported.",
    //       })
    //       setIsImporting(false)
    //       if (fileInputRef.current) {
    //         fileInputRef.current.value = ""
    //       }
    //     } catch (error) {
    //       toast({
    //         title: "Import failed",
    //         description: error instanceof Error ? error.message : "Failed to import chain",
    //         variant: "destructive",
    //       })
    //     }
    //   }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messagesEndRef])

    const confirmDelete = (chainId: string) => {
        setChainToDelete(chainId)
        setIsDeleting(true)
    }

    const handleDelete = () => {
        if (chainToDelete) {
            deleteChain(chainToDelete)
            toast({
                title: "Chain deleted",
                description: "The chain was successfully deleted.",
            })
            setIsDeleting(false)
            setChainToDelete(null)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }
    const openChat = async (chainId: string) => {
        const chain = chains.find((c) => c._id === chainId)
        if (!chain) return

        setActiveChatChain(chainId);
        setLoadingChat(true)
        const response = await fetch("/api/message/get", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chainId }),
        });

        if (!response.ok) {
            toast({
                title: "Error",
                description: "Unable to load the previous chat at this moment"
            });
            setLoadingChat(false);
            setIsChatting(true);
            return;
        }

        const messages = await response.json();
        if (messages.length == 0) {
            setMessages([
                {
                    _id: `welcome-${Date.now()}`,
                    chainId,
                    content: `Hello! I'm your thought chain assistant for "${chain.name}". How can I help you explore these connected thoughts?`,
                    role: "assistant",
                    createdAt: new Date(),
                },
            ])
        }
        else {
            setMessages(messages);
        }
        setLoadingChat(false);
        setIsChatting(true);
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
    }

    const sendMessage = async () => {
        setNewMessage("");
        setSendingMessage(true);
        if (!newMessage.trim() || !activeChatChain) return;

        const userMessage: Omit<Message, "_id"> = {
            chainId: activeChatChain,
            content: newMessage,
            role: "user",
            createdAt: new Date(),
        }

        setMessages((prev) => [...prev, { ...userMessage, _id: `user-message-${new Date()}` }]);

        const response = await fetch("/api/message/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({...userMessage}),
        });

        if (!response.ok) {
            toast({
                title: "Error",
                description: "Unable to load the previous chat at this moment"
            })
            return;
        }

        const newMessages = await response.json();

        setMessages((prev) =>
            prev.length > 0
                ? [
                    ...prev.slice(0, -1),
                    {
                        _id: newMessages[0]._id,
                        chainId: newMessages[0].chainId,
                        content: newMessages[0].content,
                        role: "user",
                        createdAt: newMessages[0].createdAt,
                    },
                ]
                : [
                    {
                        _id: newMessages[0]._id,
                        chainId: newMessages[0].chainId,
                        content: newMessages[0].content,
                        role: "user",
                        createdAt: newMessages[0].createdAt,
                    },
                ]
        );

        setMessages((prev) => [...prev, newMessages[1]]);

        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)

        setSendingMessage(false);
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const TypingIndicator = () => (
        <div className="flex space-x-1 items-center justify-center px-2">
            <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
    )

    return (
        <div className="container mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">My Chain of thoughts</h1>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => router.push("/chains/add")}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Chain
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="table" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="table">Table View</TabsTrigger>
                    <TabsTrigger value="cards">Card View</TabsTrigger>
                </TabsList>

                <TabsContent value="table">
                    {chains.length > 0 ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Nodes</TableHead>
                                        <TableHead>Connections</TableHead>
                                        <TableHead className="w-[80px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {chains.map((chain) => (
                                        <TableRow key={chain._id}>
                                            <TableCell className="font-medium">{chain.name}</TableCell>
                                            <TableCell>{chain.nodes?.length || 0}</TableCell>
                                            <TableCell>{chain.edges?.length || 0}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openChat(chain._id)}>
                                                            <MessageSquare className="mr-2 h-4 w-4" />
                                                            Chat
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => router.push(`/chain/edit/${chain._id}`)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem onClick={() => confirmDelete(chain._id)}>
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed">
                            <p className="mb-4 text-muted-foreground">No chains found</p>
                            <Button onClick={() => router.push("/chains/add")}>Create your first chain</Button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="cards">
                    {chains.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {chains.map((chain) => (
                                <Card key={chain._id}>
                                    <CardHeader>
                                        <CardTitle>{chain.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Created:</span>
                                                <span className="text-sm">{formatDate(new Date().toString())}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Last modified:</span>
                                                <span className="text-sm">{formatDate(new Date().toString())}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Nodes:</span>
                                                <span className="text-sm">{chain.nodes?.length || 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Connections:</span>
                                                <span className="text-sm">{chain.edges?.length || 0}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <Button variant="outline" size="sm" onClick={() => openChat(chain._id)}>
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            Chat
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => router.push(`/chain/edit/${chain._id}`)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => confirmDelete(chain._id)}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed">
                            <p className="mb-4 text-muted-foreground">No chains found</p>
                            <Button onClick={() => router.push("/chain")}>Create your first chain</Button>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Import Dialog */}
            <Dialog open={isImporting} onOpenChange={setIsImporting}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import Chain</DialogTitle>
                        <DialogDescription>Upload a JSON file containing a thought chain.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsImporting(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Chain</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this chain? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleting(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Chat Dialog */}
            <Dialog open={isChatting} onOpenChange={setIsChatting}>
                <DialogContent className="sm:max-w-[500px] md:max-w-[600px] h-[80vh] p-0 gap-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle>Chat with {chains.find((c) => c._id === activeChatChain)?.name}</DialogTitle>
                        <DialogDescription>
                            Ask questions about this thought chain to explore connections and insights.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col h-full overflow-hidden">
                        <div className="flex-1 overflow-y-auto px-6 pb-4">
                            <div className="space-y-2 pt-2">
                                {loadingChat ? (
                                    <div className="flex items-center space-x-4">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[250px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                        </div>
                                    </div>
                                ) : (
                                    messages.map((message) => (
                                        <div
                                            key={message._id}
                                            className={cn(
                                                "flex gap-2 rounded-lg px-3 py-2 text-sm",
                                                message?.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto",
                                            )}
                                        >
                                            <Avatar className="h-6 w-6 shrink-0 mt-0.5">
                                                <AvatarFallback>{message?.role === "user" ? "U" : "AI"}</AvatarFallback>
                                            </Avatar>
                                            <div
                                                className={cn(
                                                    "break-words overflow-hidden rounded-lg px-3 py-2",
                                                    message?.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                                                )}
                                                style={{
                                                    maxWidth: "calc(100% - 2rem)",
                                                    width: "fit-content",
                                                }}
                                            >
                                                {message?.content}
                                            </div>
                                        </div>
                                    ))
                                )}

                                {sendingMessage && (
                                    <div className="flex gap-2 rounded-lg px-3 py-2 text-sm mr-auto">
                                        <Avatar className="h-6 w-6 shrink-0 mt-0.5">
                                            <AvatarFallback>AI</AvatarFallback>
                                        </Avatar>
                                        <div
                                            className="bg-muted rounded-lg px-3 py-2"
                                            style={{
                                                maxWidth: "calc(100% - 2rem)",
                                                width: "fit-content",
                                            }}
                                        >
                                            <TypingIndicator />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        <div className="border-t p-4 bg-background">
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1"
                                />
                                <Button size="icon" onClick={sendMessage} disabled={sendingMessage && loadingChat && !newMessage.trim()}>
                                    <Send className="h-4 w-4" />
                                    <span className="sr-only">Send</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
