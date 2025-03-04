import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

export const IdeaNode = memo(({ data, isConnectable }: NodeProps) => {
  return (
    <div className="min-w-[180px] rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="!bg-primary !h-3 !w-3" />
      <div className="space-y-2">
        <h3 className="font-medium leading-none tracking-tight">{data.label}</h3>
        {data.description && <p className="text-sm text-muted-foreground">{data.description}</p>}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="!bg-primary !h-3 !w-3"
      />
    </div>
  )
})

IdeaNode.displayName = "IdeaNode"

