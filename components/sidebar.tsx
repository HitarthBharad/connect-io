"use client"

import React from "react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onTopicFilter?: (topicIds: string[]) => void
}

export function Sidebar({ className, onTopicFilter }: SidebarProps) {


  return (
    <div>
      Sidebar
    </div>
  )
}

