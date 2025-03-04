"use client"

import type React from "react"

import { useCallback, useRef, useState, useEffect } from "react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  type Node,
  type Edge,
  type Connection,
  type NodeMouseHandler,
  MarkerType,
  ConnectionMode,
} from "reactflow"
import "reactflow/dist/style.css"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Trash2, Plus, Pencil, LinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { TopicCluster } from "./topic-cluster"
import { ThoughtNote } from "./thought-note"
import { CustomEdge } from "./custom-edge"
import { Thought } from "@/types/thoughts"
import { Topic } from "@/types/topics"
// import { useTopics } from "@/contexts/topic-context"
// import { useThoughts } from "@/contexts/thought-context"

// Define custom node types
const nodeTypes = {
  topicCluster: TopicCluster,
  thoughtNote: ThoughtNote,
}

// Define custom edge types
const edgeTypes = {
  custom: CustomEdge,
}

export default function ThoughtBoard() {
  const topics: Topic[] = [];
  const thoughts: Thought[] = [];
  // const { thoughts, addThought, updateThought, deleteThought } = useThoughts()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
  const [isAddingThought, setIsAddingThought] = useState(false)
  const [isEditingThought, setIsEditingThought] = useState(false)
  const [isEditingConnection, setIsEditingConnection] = useState(false)
  const [newThoughtData, setNewThoughtData] = useState({ text: "", topics: [] as string[] })
  const [newConnectionData, setNewConnectionData] = useState({ label: "" })
  const [isConnecting, setIsConnecting] = useState(false)
  const [topicSelectOpen, setTopicSelectOpen] = useState(false)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  // Initialize nodes from thoughts
  const initializeNodes = useCallback(() => {
    const thoughtNodes = thoughts.map((thought: any) => ({
      id: thought.id,
      type: "thoughtNote",
      position: thought.position || { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        text: thought.text,
        dateModified: thought.dateModified,
        topics: thought.topics,
        isSharedNode: thought.topics.length > 1,
      },
    }))

    setNodes(thoughtNodes)
  }, [thoughts, setNodes])

  // Update nodes when thoughts change
  useEffect(() => {
    initializeNodes()
  }, [thoughts, initializeNodes])

  // Handle connecting nodes
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: "custom",
        animated: true,
        label: "Related to",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges],
  )

  // Handle node selection
  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      setSelectedNode(node)
      if (node.type === "thoughtNote") {
        const thought = thoughts.find((t) => t._id === node.id)
        if (thought) {
          setNewThoughtData({
            text: thought.text,
            topics: thought.topics,
          })
        }
      }
    },
    [thoughts],
  )

  // Handle edge selection
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge)
    setNewConnectionData({ label: (edge.label as string) || "" })
    setIsEditingConnection(true)
  }, [])

  // Update thought positions after drag
  const onNodeDragStop: NodeMouseHandler = useCallback(
    (_, node) => {
      if (node.type === "thoughtNote") {
        // updateThought(node.id, {
        //   position: node.position,
        // })
      }
    },
    [],
  )

  // Add a new thought
  const addNewThought = useCallback(() => {
    if (newThoughtData.topics.length > 0 && reactFlowInstance) {
      const position = reactFlowInstance.project({
        x: Math.random() * 400 + 50,
        y: Math.random() * 400 + 50,
      })

      const thoughtData = {
        text: newThoughtData.text,
        topics: newThoughtData.topics,
        position,
      }

     // addThought(thoughtData)
      setNewThoughtData({ text: "", topics: [] })
      setIsAddingThought(false)
    }
  }, [newThoughtData, reactFlowInstance])

  // Edit an existing thought
  const editThought = useCallback(() => {
    if (selectedNode && selectedNode.type === "thoughtNote") {
      // updateThought(selectedNode.id, {
      //   text: newThoughtData.text,
      //   topics: newThoughtData.topics,
      // })
      setIsEditingThought(false)
      setSelectedNode(null)
    }
  }, [selectedNode, newThoughtData])

  // Edit connection label
  const editConnection = useCallback(() => {
    if (selectedEdge) {
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === selectedEdge.id) {
            return {
              ...edge,
              label: newConnectionData.label,
            }
          }
          return edge
        }),
      )
      setIsEditingConnection(false)
      setSelectedEdge(null)
    }
  }, [selectedEdge, newConnectionData, setEdges])

  // Delete selected node or edge
  const deleteSelected = useCallback(() => {
    if (selectedNode) {
      //deleteThought(selectedNode.id)
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id))
      setSelectedNode(null)
    } else if (selectedEdge) {
      setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id))
      setSelectedEdge(null)
    }
  }, [selectedNode, selectedEdge, setEdges])

  return (
    <div className="h-full w-full">
      {/* Toolbar */}
      <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
        <Button onClick={() => setIsAddingThought(true)} disabled={topics.length === 0}>
          <Plus className="mr-2 h-4 w-4" />
          Add Thought
        </Button>
        <Button variant={isConnecting ? "secondary" : "outline"} onClick={() => setIsConnecting(!isConnecting)}>
          <LinkIcon className="mr-2 h-4 w-4" />
          {isConnecting ? "Cancel Connection" : "Connect Thoughts"}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (selectedNode && selectedNode.type === "thoughtNote") {
              setIsEditingThought(true)
            }
          }}
          disabled={!selectedNode || selectedNode.type !== "thoughtNote"}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit Thought
        </Button>
        <Button variant="destructive" onClick={deleteSelected} disabled={!selectedNode && !selectedEdge}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Selected
        </Button>
      </div>

      {/* Flow Canvas */}
      <div className="h-[calc(100vh-60px)] w-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onNodeDragStop={onNodeDragStop}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionMode={isConnecting ? ConnectionMode.Loose : ConnectionMode.Strict}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>

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
                        {topics.map((topic) => (
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
                        {topics.map((topic) => (
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

      {/* Connection Dialog */}
      <Dialog open={isEditingConnection} onOpenChange={setIsEditingConnection}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Connection</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="connectionLabel">Label</Label>
              <Input
                id="connectionLabel"
                value={newConnectionData.label}
                onChange={(e) => setNewConnectionData({ label: e.target.value })}
                placeholder="Describe the connection"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingConnection(false)}>
              Cancel
            </Button>
            <Button onClick={editConnection}>Update Connection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

