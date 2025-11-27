import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { taskService } from "@/services/api/taskService"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import PriorityBadge from "@/components/atoms/PriorityBadge"
import { format, isToday, isTomorrow, addDays } from "date-fns"

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    today: 0,
    thisWeek: 0
  })

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const data = await taskService.getAll()
      setTasks(data)
      calculateStats(data)
    } catch (error) {
      console.error("Error loading tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (tasksList) => {
    const now = new Date()
    const weekFromNow = addDays(now, 7)

    const newStats = {
      total: tasksList.length,
      completed: tasksList.filter(t => t.completed).length,
      pending: tasksList.filter(t => !t.completed).length,
      overdue: tasksList.filter(t => !t.completed && new Date(t.dueDate) < now).length,
      today: tasksList.filter(t => !t.completed && isToday(new Date(t.dueDate))).length,
      thisWeek: tasksList.filter(t => !t.completed && new Date(t.dueDate) <= weekFromNow).length
    }

    setStats(newStats)
  }

  const getTasksByCategory = (category) => {
    const now = new Date()
    switch (category) {
      case "today":
        return tasks.filter(t => !t.completed && isToday(new Date(t.dueDate)))
      case "upcoming":
        return tasks.filter(t => !t.completed && new Date(t.dueDate) > now).slice(0, 5)
      case "overdue":
        return tasks.filter(t => !t.completed && new Date(t.dueDate) < now)
      default:
        return []
    }
  }

  const formatDueDate = (dateString) => {
    const date = new Date(dateString)
    if (isToday(date)) return "Today"
    if (isTomorrow(date)) return "Tomorrow"
    return format(date, "MMM d")
  }

  const StatCard = ({ title, value, icon, color, link }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{loading ? "..." : value}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shadow-lg`}>
          <ApperIcon name={icon} size={24} className="text-white" />
        </div>
      </div>
      {link && (
        <Link to={link} className="inline-flex items-center mt-4 text-primary hover:text-secondary text-sm font-medium">
          View all
          <ApperIcon name="ArrowRight" size={14} className="ml-1" />
        </Link>
      )}
    </motion.div>
  )

  const TaskSection = ({ title, tasks: sectionTasks, emptyMessage, link }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        {link && sectionTasks.length > 0 && (
          <Link to={link} className="text-primary hover:text-secondary text-sm font-medium">
            View all
          </Link>
        )}
      </div>
      
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : sectionTasks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{emptyMessage}</p>
      ) : (
        <div className="space-y-3">
          {sectionTasks.map(task => (
            <div key={task.Id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{task.title}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <PriorityBadge priority={task.priority} />
                  <span className="text-xs text-gray-500">{formatDueDate(task.dueDate)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your productivity overview.</p>
        </div>
        <Link to="/tasks">
          <Button className="bg-gradient-to-r from-primary to-secondary text-white">
            <ApperIcon name="Plus" size={18} className="mr-2" />
            Add Task
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon="CheckSquare"
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          link="/tasks"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon="CheckCheck"
          color="bg-gradient-to-r from-green-500 to-green-600"
          link="/completed"
        />
        <StatCard
          title="Due Today"
          value={stats.today}
          icon="Calendar"
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          link="/today"
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          icon="AlertTriangle"
          color="bg-gradient-to-r from-red-500 to-red-600"
        />
      </div>

      {/* Task Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TaskSection
          title="Due Today"
          tasks={getTasksByCategory("today")}
          emptyMessage="No tasks due today. Great job staying on top of things!"
          link="/today"
        />
        
        <TaskSection
          title="Upcoming Tasks"
          tasks={getTasksByCategory("upcoming")}
          emptyMessage="No upcoming tasks. Time to plan your next steps!"
          link="/upcoming"
        />
      </div>

      {/* Overdue Tasks */}
      {stats.overdue > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <ApperIcon name="AlertTriangle" size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900">Overdue Tasks</h3>
              <p className="text-red-700 mt-1">
                You have {stats.overdue} overdue task{stats.overdue !== 1 ? "s" : ""} that need attention.
              </p>
              <Link to="/tasks?filter=overdue" className="mt-3 inline-block">
                <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                  Review overdue tasks
                  <ApperIcon name="ArrowRight" size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/tasks">
            <Button variant="outline" className="w-full justify-center">
              <ApperIcon name="CheckSquare" size={16} className="mr-2" />
              My Tasks
            </Button>
          </Link>
          <Link to="/projects">
            <Button variant="outline" className="w-full justify-center">
              <ApperIcon name="FolderOpen" size={16} className="mr-2" />
              Projects
            </Button>
          </Link>
          <Link to="/calendar">
            <Button variant="outline" className="w-full justify-center">
              <ApperIcon name="CalendarDays" size={16} className="mr-2" />
              Calendar
            </Button>
          </Link>
          <Link to="/teams">
            <Button variant="outline" className="w-full justify-center">
              <ApperIcon name="Users" size={16} className="mr-2" />
              Teams
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard