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
import { CollapsibleMenu } from "@/components/collapsible-menu"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"
import { ThoughtNote } from "./thought-note"
import { CustomEdge } from "./custom-edge"
import { useThoughts } from "@/contexts/thought-context"
import { useChains } from "@/contexts/chain-context"
import { _oid } from "@/lib/db.server"
import { toast } from "sonner"

const nodeTypes = {
  thoughtNote: ThoughtNote,
}

const edgeTypes = {
  custom: CustomEdge,
}

interface ChainBoardProps {
  selectedTopics: string[]
}

export function ChainBoard({ selectedTopics }: ChainBoardProps) {
  const [isSaving, setIsSaving] = useState(false)
  const { thoughts } = useThoughts()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [name, setName] = useState("");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
  const [isEditingConnection, setIsEditingConnection] = useState(false)
  const [newConnectionData, setNewConnectionData] = useState({ label: "" })
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const {addChain} = useChains();

  // Initialize nodes from thoughts that belong to selected topics
  const initializeNodes = useCallback(() => {
    const relevantThoughts = thoughts.filter((thought) =>
      thought.topics.some((topicId) => selectedTopics.includes(topicId)),
    )

    const thoughtNodes = relevantThoughts.map((thought) => ({
      id: thought._id,
      type: "thoughtNote",
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        name: thought.name,
        text: thought.text,
        dateModified: new Date().toDateString(),
        topics: thought.topics,
        isSharedNode: thought.topics.length > 1,
      },
      style: { width: 150  },
    }))

    setNodes(thoughtNodes)
  }, [thoughts, selectedTopics, setNodes])

  useEffect(() => {
    initializeNodes()
  }, [initializeNodes, thoughts]) 

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: "custom",
        animated: true,
        label: "Connected to",
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
  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNode(node)
  }, [])

  // Handle edge selection
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge)
    setNewConnectionData({ label: (edge.label as string) || "" })
    setIsEditingConnection(true)
  }, [])

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

  const saveChain = useCallback(() => {
    if (nodes.length > 0) {
      setIsSaving(true)
    }
  }, [nodes.length])

  // Handle save confirmation
  const handleSaveConfirm = useCallback(() => {

    const chain = {
      name: name,
      nodes: nodes.map(({ id, position, data }) => ({
        id,
        position,
        text: data.text,
        topics: data.topics,
        dateModified: data.dateModified,
      })),
      edges: edges.map(({ id, source, target, label }) => ({
        id,
        source,
        target,
        label: typeof label === 'string' ? label : label?.toString() || undefined,
      })),
    }

    addChain(chain)

    toast("Chain saved");

    setIsSaving(false)
  }, [name, nodes, edges, addChain, toast])

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h1 className="text-xl font-semibold">Thought Chain</h1>
        <div className="flex items-center">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter chain name"
            className="mr-2"
          />
          <Button onClick={handleSaveConfirm} disabled={nodes.length === 0 || !name}>
            <Save className="mr-2 h-4 w-4" />
            Save Chain
          </Button>
        </div>
      </div>
      <div className="relative flex-1">
        <CollapsibleMenu
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          selectedTopics={selectedTopics}
        />
        <div className="h-[calc(100vh-60px)] w-full" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>

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

      <Dialog open={isSaving} onOpenChange={setIsSaving}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Thought Chain</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="chainName">Chain Name</Label>
              <Input
                id="chainName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name for your chain"
              />
            </div>
            {/* <div className="grid gap-2">
              <Label htmlFor="chainDescription">Description (Optional)</Label>
              <Input
                id="chainDescription"
                value={chainDescription}
                onChange={(e) => setChainDescription(e.target.value)}
                placeholder="Describe what this chain represents"
              />
            </div> */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaving(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfirm}>Save Chain</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

