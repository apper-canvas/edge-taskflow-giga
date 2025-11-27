import React from "react"
import { cn } from "@/utils/cn"

const PriorityBadge = ({ priority, className }) => {
  const priorityConfig = {
    high: {
      label: "High",
      className: "priority-high bg-primary text-white"
    },
    medium: {
      label: "Medium", 
      className: "priority-medium bg-secondary text-white"
    },
    low: {
      label: "Low",
      className: "priority-low bg-accent text-white"
    }
  }

  const config = priorityConfig[priority] || priorityConfig.medium

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
      config.className,
      className
    )}>
      {config.label}
    </span>
  )
}

export default PriorityBadge