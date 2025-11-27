import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { isToday } from "date-fns"
import { taskService } from "@/services/api/taskService"
import TaskForm from "@/components/organisms/TaskForm"
import TaskList from "@/components/organisms/TaskList"
import FilterBar from "@/components/molecules/FilterBar"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"

const Today = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState({ status: "all", priority: "all" })
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await taskService.getAll()
      // Filter for today's tasks
      const todayTasks = data.filter(task => isToday(new Date(task.dueDate)))
      setTasks(todayTasks)
    } catch (err) {
      setError("Failed to load today's tasks. Please try again.")
      console.error("Error loading tasks:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskData) => {
    try {
      // Set due date to today if not specified
      const today = new Date().toISOString().split('T')[0]
      const newTask = await taskService.create({
        ...taskData,
        dueDate: taskData.dueDate || today
      })
      
      // Only add to list if it's due today
      if (isToday(new Date(newTask.dueDate))) {
        setTasks(prev => [newTask, ...prev])
      }
      
      setShowAddForm(false)
      toast.success("Task created successfully!")
    } catch (err) {
      toast.error("Failed to create task")
      console.error("Error creating task:", err)
    }
  }

  const handleUpdateTask = async (id, updates) => {
    try {
      const updatedTask = await taskService.update(id, updates)
      
      // Check if task is still due today after update
      if (isToday(new Date(updatedTask.dueDate))) {
        setTasks(prev => prev.map(task => 
          task.Id === id ? updatedTask : task
        ))
      } else {
        // Remove from today's list if no longer due today
        setTasks(prev => prev.filter(task => task.Id !== id))
      }
      
      toast.success("Task updated successfully!")
    } catch (err) {
      toast.error("Failed to update task")
      console.error("Error updating task:", err)
    }
  }

  const handleToggleComplete = async (id) => {
    try {
      const updatedTask = await taskService.toggleComplete(id)
      setTasks(prev => prev.map(task => 
        task.Id === id ? updatedTask : task
      ))
      
      if (updatedTask.completed) {
        toast.success("Task completed! Great work!")
      } else {
        toast.info("Task marked as incomplete")
      }
    } catch (err) {
      toast.error("Failed to update task")
      console.error("Error toggling task:", err)
    }
  }

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return
    }

    try {
      await taskService.delete(id)
      setTasks(prev => prev.filter(task => task.Id !== id))
      toast.success("Task deleted successfully")
    } catch (err) {
      toast.error("Failed to delete task")
      console.error("Error deleting task:", err)
    }
  }

  // Filter tasks based on current filter settings
  const filteredTasks = tasks.filter(task => {
    const statusMatch = filter.status === "all" || 
      (filter.status === "active" && !task.completed) ||
      (filter.status === "completed" && task.completed)

    const priorityMatch = filter.priority === "all" || task.priority === filter.priority

    return statusMatch && priorityMatch
  })

  // Sort tasks: incomplete first, then by priority
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
    if (priorityDiff !== 0) return priorityDiff
    
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadTasks} />

  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ApperIcon name="Calendar" size={32} className="mr-3 text-primary" />
            Today
          </h1>
          <p className="text-gray-600 mt-1">
            {totalCount === 0 
              ? "No tasks scheduled for today" 
              : `${completedCount}/${totalCount} tasks completed`
            }
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Today's Progress</span>
            <span className="text-sm text-gray-500">{completedCount}/{totalCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-300"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar 
        filter={filter}
        onFilterChange={setFilter}
        onAddTask={() => setShowAddForm(true)}
      />

      {/* Add Task Form */}
      {showAddForm && (
        <TaskForm 
          onSubmit={handleCreateTask}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Task List */}
      {sortedTasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-6">
            <ApperIcon name="Calendar" size={36} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {filter.status === "completed" ? "No completed tasks today" :
             filter.status === "active" ? "No pending tasks for today" :
             "No tasks for today"}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter.status === "completed" ? "Complete some tasks to see them here!" :
             filter.status === "active" ? "All your tasks for today are completed!" :
             totalCount === 0 ? "Add some tasks to get started with your day." :
             "Try adjusting your filters to see more tasks."}
          </p>
          {filter.status !== "completed" && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <ApperIcon name="Plus" size={18} className="mr-2 inline" />
              Add Task for Today
            </button>
          )}
        </div>
      ) : (
        <TaskList 
          tasks={sortedTasks}
          onUpdateTask={handleUpdateTask}
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </div>
  )
}

export default Today