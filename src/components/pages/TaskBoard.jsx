import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { taskService } from "@/services/api/taskService"
import TaskForm from "@/components/organisms/TaskForm"
import TaskList from "@/components/organisms/TaskList"
import FilterBar from "@/components/molecules/FilterBar"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"

const TaskBoard = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState({ status: "all", priority: "all" })
  const [showAddForm, setShowAddForm] = useState(false)

  // Load tasks on component mount
  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await taskService.getAll()
      setTasks(data)
    } catch (err) {
      setError("Failed to load tasks. Please try again.")
      console.error("Error loading tasks:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData)
      setTasks(prev => [newTask, ...prev])
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
      setTasks(prev => prev.map(task => 
        task.Id === id ? updatedTask : task
      ))
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

  // Sort tasks: incomplete first, then by priority, then by creation date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    
    // Sort by priority (high > medium > low)
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
    if (priorityDiff !== 0) return priorityDiff
    
    // Sort by creation date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadTasks} />

  return (
    <div className="space-y-8">
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
        <Empty onAddTask={() => setShowAddForm(true)} />
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

export default TaskBoard