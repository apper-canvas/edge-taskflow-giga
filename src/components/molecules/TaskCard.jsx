import React, { useState } from "react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import Checkbox from "@/components/atoms/Checkbox"
import Button from "@/components/atoms/Button"
import PriorityBadge from "@/components/atoms/PriorityBadge"
import TaskForm from "@/components/organisms/TaskForm"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const TaskCard = ({ task, onUpdate, onToggleComplete, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleUpdate = (updatedData) => {
    onUpdate(task.Id, updatedData)
    setIsEditing(false)
  }

  const handleToggle = () => {
    onToggleComplete(task.Id)
  }

  const handleDelete = () => {
    onDelete(task.Id)
  }

  // Check if task is overdue
  const isOverdue = !task.completed && new Date(task.dueDate) < new Date()
  
  // Check if task is due soon (within 24 hours)
  const isDueSoon = !task.completed && !isOverdue && 
    new Date(task.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000)

  if (isEditing) {
    return (
      <TaskForm
        task={task}
        onSubmit={handleUpdate}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <motion.div
      layout
      className={cn(
        "task-card bg-white rounded-2xl p-6 border transition-all duration-200",
        task.completed && "task-complete",
        isOverdue && "border-red-200 bg-red-50/30",
        isDueSoon && !isOverdue && "border-warning bg-yellow-50/30",
        !isOverdue && !isDueSoon && "border-gray-200"
      )}
    >
      <div className="flex items-start space-x-4">
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-1">
          <Checkbox
            checked={task.completed}
            onChange={handleToggle}
            className="checkbox-animate"
          />
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className={cn(
                "font-semibold text-gray-900 task-title text-lg",
                task.completed && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={cn(
                  "text-gray-600 mt-1 text-sm",
                  task.completed && "text-gray-400"
                )}>
                  {task.description}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <PriorityBadge priority={task.priority} />
              
              {/* Action Buttons */}
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                  title="Edit task"
                >
                  <ApperIcon name="Edit2" size={16} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-gray-400 hover:text-red-600 p-2"
                  title="Delete task"
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div className="flex items-center space-x-4 text-sm">
            <div className={cn(
              "flex items-center",
              isOverdue && "text-red-600 font-medium",
              isDueSoon && !isOverdue && "text-warning font-medium",
              !isOverdue && !isDueSoon && "text-gray-500"
            )}>
              <ApperIcon 
                name="Calendar" 
                size={14} 
                className="mr-1" 
              />
              <span>
                {format(new Date(task.dueDate), "MMM d, yyyy")}
                {isOverdue && " (Overdue)"}
                {isDueSoon && !isOverdue && " (Due soon)"}
              </span>
            </div>

            {task.completed && task.completedAt && (
              <div className="text-gray-400">
                <ApperIcon name="CheckCircle" size={14} className="mr-1 inline" />
                Completed {format(new Date(task.completedAt), "MMM d")}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskCard