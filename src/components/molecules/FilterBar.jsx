import React from "react"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const FilterBar = ({ filter, onFilterChange, onAddTask }) => {
  const statusOptions = [
    { value: "all", label: "All Tasks" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" }
  ]

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          {/* Status Filter Buttons */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {statusOptions.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                size="sm"
                onClick={() => onFilterChange(prev => ({ ...prev, status: option.value }))}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all",
                  filter.status === option.value
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* Priority Filter */}
          <Select
            value={filter.priority}
            onChange={(value) => onFilterChange(prev => ({ ...prev, priority: value }))}
            options={priorityOptions}
            className="min-w-[160px]"
          />
        </div>

        {/* Add Task Button */}
        <Button
          onClick={onAddTask}
          className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all"
        >
          <ApperIcon name="Plus" size={18} className="mr-2" />
          Add Task
        </Button>
      </div>
    </div>
  )
}

export default FilterBar