import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { isToday, isTomorrow, format, addDays } from "date-fns"
import { taskService } from "@/services/api/taskService"
import TaskForm from "@/components/organisms/TaskForm"
import TaskList from "@/components/organisms/TaskList"
import FilterBar from "@/components/molecules/FilterBar"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import ApperIcon from "@/components/ApperIcon"

const Upcoming = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState({ status: "active", priority: "all" })
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await taskService.getAll()
      // Filter for upcoming tasks (future dates, not today)
      const upcomingTasks = data.filter(task => {
        const taskDate = new Date(task.dueDate)
        const today = new Date()
        today.setHours(23, 59, 59, 999) // End of today
        return taskDate > today
      })
      setTasks(upcomingTasks)
    } catch (err) {
      setError("Failed to load upcoming tasks. Please try again.")
      console.error("Error loading tasks:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskData) => {
    try {
      // Set due date to tomorrow if not specified or if it's today
      const tomorrow = addDays(new Date(), 1).toISOString().split('T')[0]
      const dueDate = taskData.dueDate && new Date(taskData.dueDate) > new Date() 
        ? taskData.dueDate 
        : tomorrow

      const newTask = await taskService.create({
        ...taskData,
        dueDate
      })
      
      // Only add to list if it's an upcoming task
      if (new Date(newTask.dueDate) > new Date()) {
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
      
      // Check if task is still upcoming after update
      if (new Date(updatedTask.dueDate) > new Date()) {
        setTasks(prev => prev.map(task => 
          task.Id === id ? updatedTask : task
        ))
      } else {
        // Remove from upcoming list if no longer upcoming
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

  // Group tasks by date
  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const taskDate = new Date(task.dueDate)
    let dateKey

    if (isTomorrow(taskDate)) {
      dateKey = "Tomorrow"
    } else if (taskDate <= addDays(new Date(), 7)) {
      dateKey = format(taskDate, "EEEE") // Day of week
    } else {
      dateKey = format(taskDate, "MMM d, yyyy")
    }

    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(task)
    return groups
  }, {})

  // Sort groups by date
  const sortedGroupKeys = Object.keys(groupedTasks).sort((a, b) => {
    // Get first task from each group to compare dates
    const dateA = new Date(groupedTasks[a][0].dueDate)
    const dateB = new Date(groupedTasks[b][0].dueDate)
    return dateA - dateB
  })

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadTasks} />

  const activeCount = tasks.filter(t => !t.completed).length
  const totalCount = tasks.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ApperIcon name="Clock" size={32} className="mr-3 text-primary" />
            Upcoming
          </h1>
          <p className="text-gray-600 mt-1">
            {totalCount === 0 
              ? "No upcoming tasks scheduled" 
              : `${activeCount} pending task${activeCount !== 1 ? 's' : ''} coming up`
            }
          </p>
        </div>
      </div>

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

      {/* Grouped Task Lists */}
      {sortedGroupKeys.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-6">
            <ApperIcon name="Clock" size={36} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {filter.status === "completed" ? "No completed upcoming tasks" :
             filter.status === "active" ? "No pending upcoming tasks" :
             "No upcoming tasks"}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter.status === "completed" ? "Complete some upcoming tasks to see them here!" :
             filter.status === "active" ? "All your upcoming tasks are completed!" :
             totalCount === 0 ? "Plan ahead by scheduling tasks for the future." :
             "Try adjusting your filters to see more tasks."}
          </p>
          {filter.status !== "completed" && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <ApperIcon name="Plus" size={18} className="mr-2 inline" />
              Schedule a Task
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {sortedGroupKeys.map(dateKey => {
            const dateTasks = groupedTasks[dateKey].sort((a, b) => {
              // Sort within each date group
              if (a.completed !== b.completed) {
                return a.completed ? 1 : -1
              }
              
              const priorityOrder = { high: 3, medium: 2, low: 1 }
              const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
              if (priorityDiff !== 0) return priorityDiff
              
              return new Date(b.createdAt) - new Date(a.createdAt)
            })

            return (
              <div key={dateKey}>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                  {dateKey}
                  <span className="ml-2 text-sm text-gray-500 font-normal">
                    ({dateTasks.length} task{dateTasks.length !== 1 ? 's' : ''})
                  </span>
                </h2>
                <TaskList 
                  tasks={dateTasks}
                  onUpdateTask={handleUpdateTask}
                  onToggleComplete={handleToggleComplete}
                  onDeleteTask={handleDeleteTask}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Upcoming