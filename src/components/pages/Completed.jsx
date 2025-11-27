import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { format, isToday, isYesterday, subDays } from "date-fns"
import { taskService } from "@/services/api/taskService"
import TaskList from "@/components/organisms/TaskList"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"

const Completed = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [timeFilter, setTimeFilter] = useState("all")

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await taskService.getAll()
      // Filter for completed tasks only
      const completedTasks = data.filter(task => task.completed)
      setTasks(completedTasks)
    } catch (err) {
      setError("Failed to load completed tasks. Please try again.")
      console.error("Error loading tasks:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleComplete = async (id) => {
    try {
      const updatedTask = await taskService.toggleComplete(id)
      
      if (updatedTask.completed) {
        // Task was re-completed, keep in list
        setTasks(prev => prev.map(task => 
          task.Id === id ? updatedTask : task
        ))
        toast.success("Task completed!")
      } else {
        // Task was uncompleted, remove from completed list
        setTasks(prev => prev.filter(task => task.Id !== id))
        toast.info("Task moved back to active")
      }
    } catch (err) {
      toast.error("Failed to update task")
      console.error("Error toggling task:", err)
    }
  }

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this task?")) {
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

  // Filter tasks based on time period
  const getFilteredTasks = () => {
    const now = new Date()
    
    return tasks.filter(task => {
      if (!task.completedAt) return false
      
      const completedDate = new Date(task.completedAt)
      
      switch (timeFilter) {
        case "today":
          return isToday(completedDate)
        case "yesterday":
          return isYesterday(completedDate)
        case "week":
          return completedDate >= subDays(now, 7)
        case "month":
          return completedDate >= subDays(now, 30)
        case "all":
        default:
          return true
      }
    })
  }

  const filteredTasks = getFilteredTasks()

  // Group tasks by completion date
  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const completedDate = new Date(task.completedAt)
    let dateKey

    if (isToday(completedDate)) {
      dateKey = "Today"
    } else if (isYesterday(completedDate)) {
      dateKey = "Yesterday"
    } else {
      dateKey = format(completedDate, "MMM d, yyyy")
    }

    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(task)
    return groups
  }, {})

  // Sort groups by date (newest first)
  const sortedGroupKeys = Object.keys(groupedTasks).sort((a, b) => {
    const dateA = new Date(groupedTasks[a][0].completedAt)
    const dateB = new Date(groupedTasks[b][0].completedAt)
    return dateB - dateA
  })

  const timeFilterOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" }
  ]

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadTasks} />

  const totalCompleted = tasks.length
  const filteredCount = filteredTasks.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ApperIcon name="CheckCheck" size={32} className="mr-3 text-green-600" />
            Completed Tasks
          </h1>
          <p className="text-gray-600 mt-1">
            {totalCompleted === 0 
              ? "No completed tasks yet" 
              : `${filteredCount} of ${totalCompleted} completed task${totalCompleted !== 1 ? 's' : ''}`
            }
          </p>
        </div>
      </div>

      {/* Achievement Badge */}
      {totalCompleted > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
              <ApperIcon name="Trophy" size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-900">Great Job!</h3>
              <p className="text-green-700">
                You've completed {totalCompleted} task{totalCompleted !== 1 ? 's' : ''}. 
                Keep up the excellent work!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Filter by completion time</h3>
          <div className="w-48">
            <Select
              value={timeFilter}
              onChange={setTimeFilter}
              options={timeFilterOptions}
            />
          </div>
        </div>
      </div>

      {/* Grouped Task Lists */}
      {sortedGroupKeys.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-6">
            <ApperIcon name="CheckCheck" size={36} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {totalCompleted === 0 
              ? "No completed tasks yet" 
              : "No tasks completed in this period"
            }
          </h3>
          <p className="text-gray-600 mb-6">
            {totalCompleted === 0 
              ? "Start completing tasks to see your achievements here!" 
              : "Try selecting a different time period to see more completed tasks."
            }
          </p>
          {timeFilter !== "all" && (
            <Button
              onClick={() => setTimeFilter("all")}
              variant="outline"
              className="mr-3"
            >
              Show All Completed Tasks
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {sortedGroupKeys.map(dateKey => {
            const dateTasks = groupedTasks[dateKey].sort((a, b) => {
              // Sort by completion time (newest first)
              return new Date(b.completedAt) - new Date(a.completedAt)
            })

            return (
              <div key={dateKey}>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                  {dateKey}
                  <span className="ml-2 text-sm text-gray-500 font-normal">
                    ({dateTasks.length} task{dateTasks.length !== 1 ? 's' : ''} completed)
                  </span>
                </h2>
                <TaskList 
                  tasks={dateTasks}
                  onToggleComplete={handleToggleComplete}
                  onDeleteTask={handleDeleteTask}
                  showCompleted={true}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Completed