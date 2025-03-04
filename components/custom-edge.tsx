import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath } from "reactflow"

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              // Everything inside EdgeLabelRenderer has no pointer events by default
              pointerEvents: "all",
            }}
            className="nodrag nopan rounded-md bg-white px-2 py-1 shadow-md dark:bg-secondary"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

