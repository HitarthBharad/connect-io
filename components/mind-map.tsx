"use client"

import { useCallback, useRef, useState } from "react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type NodeMouseHandler,
  type OnConnect,
} from "reactflow"
import "reactflow/dist/style.css"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Trash2 } from "lucide-react"
import { IdeaNode } from "./idea-node"

// Define custom node types
const nodeTypes = {
  idea: IdeaNode,
}

// Initial nodes and edges
const initialNodes: Node[] = [
  {
    id: "1",
    type: "idea",
    position: { x: 250, y: 100 },
    data: { label: "Main Idea", description: "Start with your main concept here" },
  },
]

const initialEdges: Edge[] = []

export default function MindMap() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isAddingNode, setIsAddingNode] = useState(false)
  const [newNodeData, setNewNodeData] = useState({ label: "", description: "" })
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  // Handle connecting nodes
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds))
    },
    [setEdges],
  )

  // Handle node selection
  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNode(node)
  }, [])

  // Add a new node
  const addNode = useCallback(() => {
    if (reactFlowInstance) {
      const position = reactFlowInstance.project({
        x: Math.random() * 400 + 50,
        y: Math.random() * 400 + 50,
      })

      const newNode: Node = {
        id: (nodes.length + 1).toString(),
        type: "idea",
        position,
        data: {
          label: newNodeData.label || "New Idea",
          description: newNodeData.description || "Add details here",
        },
      }

      setNodes((nds) => nds.concat(newNode))
      setNewNodeData({ label: "", description: "" })
      setIsAddingNode(false)
    }
  }, [reactFlowInstance, nodes.length, newNodeData, setNodes])

  // Delete selected node
  const deleteNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id))
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id))
      setSelectedNode(null)
    }
  }, [selectedNode, setNodes, setEdges])

  // Save mind map to local storage
  const saveMindMap = useCallback(() => {
    if (nodes.length > 0) {
      localStorage.setItem("mindMapNodes", JSON.stringify(nodes))
      localStorage.setItem("mindMapEdges", JSON.stringify(edges))
      alert("Mind map saved!")
    }
  }, [nodes, edges])

  // Load mind map from local storage
  const loadMindMap = useCallback(() => {
    const savedNodes = localStorage.getItem("mindMapNodes")
    const savedEdges = localStorage.getItem("mindMapEdges")

    if (savedNodes && savedEdges) {
      setNodes(JSON.parse(savedNodes))
      setEdges(JSON.parse(savedEdges))
    }
  }, [setNodes, setEdges])

  return (
    <div className="h-full w-full">
      <div className="absolute left-4 top-16 z-10 flex flex-col gap-2">
        <Button onClick={() => setIsAddingNode(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Idea
        </Button>
        <Button variant="destructive" onClick={deleteNode} disabled={!selectedNode}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Selected
        </Button>
        <Button variant="outline" onClick={saveMindMap}>
          Save Mind Map
        </Button>
        <Button variant="outline" onClick={loadMindMap}>
          Load Mind Map
        </Button>
      </div>

      <div className="h-[calc(100vh-60px)] w-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Dialog for adding new nodes */}
      <Dialog open={isAddingNode} onOpenChange={setIsAddingNode}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Idea</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newNodeData.label}
                onChange={(e) => setNewNodeData({ ...newNodeData, label: e.target.value })}
                className="col-span-3"
                placeholder="Enter idea title"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Details
              </Label>
              <Input
                id="description"
                value={newNodeData.description}
                onChange={(e) => setNewNodeData({ ...newNodeData, description: e.target.value })}
                className="col-span-3"
                placeholder="Enter additional details"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingNode(false)}>
              Cancel
            </Button>
            <Button onClick={addNode}>Add Idea</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

