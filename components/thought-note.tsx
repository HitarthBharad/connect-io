import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Layers } from "lucide-react"

export const ThoughtNote = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={`max-w-[250px] rounded-md border bg-card p-3 shadow-sm transition-shadow ${
        selected ? "ring-1 ring-primary shadow-md" : ""
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-primary !h-3 !w-3" />
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm">{data.name}</p>
        {data.isSharedNode && (
          <Layers className="h-4 w-4 text-muted-foreground">
            <title>Shared across multiple topics</title>
          </Layers>
        )}
      </div>
      <div className="mt-2 text-xs text-muted-foreground">Modified: {data.dateModified}</div>
      <Handle type="source" position={Position.Bottom} className="!bg-primary !h-3 !w-3" />
    </div>
  )
})

ThoughtNote.displayName = "ThoughtNote"

