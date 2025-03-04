import { memo } from "react"
import type { NodeProps } from "reactflow"
import { ChevronDown, ChevronRight } from "lucide-react"

export const TopicCluster = memo(({ data, selected }: NodeProps) => {
  const baseColor = data.color.split(" ")[0] // Get the base color class

  return (
    <div
      className={`
        relative
        ${baseColor} dark:bg-opacity-20
        p-6
        transition-all
        cursor-pointer
        ${selected ? "ring-2 ring-primary" : ""}
        ${data.isExpanded ? "opacity-100" : "hover:scale-105"}
        animate-in
      `}
      style={{
        borderRadius: "60% 40% 50% 45% / 45% 50% 40% 55%",
        filter: "drop-shadow(0 4px 6px rgb(0 0 0 / 0.1))",
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {data.isExpanded ? (
            <ChevronDown className="h-4 w-4 transition-transform" />
          ) : (
            <ChevronRight className="h-4 w-4 transition-transform" />
          )}
          <h3 className="text-lg font-semibold">{data.label}</h3>
        </div>
        <div className="rounded-full bg-background/50 px-2 py-0.5 text-sm">
          {data.ideaCount} {data.ideaCount === 1 ? "idea" : "ideas"}
        </div>
      </div>
    </div>
  )
})

TopicCluster.displayName = "TopicCluster"

