import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Checkbox = forwardRef(({ 
  className, 
  checked = false,
  onChange,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange && onChange(!checked)}
      className={cn(
        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/30 hover:scale-110",
        checked 
          ? "bg-gradient-to-r from-success to-emerald-500 border-success text-white shadow-sm" 
          : "border-gray-300 hover:border-primary bg-white",
        className
      )}
      {...props}
    >
      {checked && (
        <ApperIcon name="Check" size={14} className="text-white" />
      )}
    </button>
  )
})

Checkbox.displayName = "Checkbox"

export default Checkbox