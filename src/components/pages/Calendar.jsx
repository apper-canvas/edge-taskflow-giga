import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Calendar = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ApperIcon name="CalendarDays" size={32} className="mr-3 text-primary" />
            Calendar
          </h1>
          <p className="text-gray-600 mt-1">Visualize your tasks and deadlines on a calendar</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary text-white">
          <ApperIcon name="Plus" size={18} className="mr-2" />
          Add Event
        </Button>
      </div>

      {/* Coming Soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-8">
          <ApperIcon name="CalendarDays" size={40} className="text-white" />
        </div>
        
        <div className="space-y-4 max-w-lg mx-auto">
          <h3 className="text-3xl font-bold text-gray-800">Calendar View Coming Soon!</h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            We're building a beautiful calendar interface that will give you a visual overview of all your tasks, deadlines, and upcoming events.
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mt-8">
            <h4 className="font-semibold text-gray-800 mb-3">What's Coming:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Calendar" size={16} className="text-primary flex-shrink-0" />
                <span>Monthly & weekly views</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Clock" size={16} className="text-primary flex-shrink-0" />
                <span>Drag & drop scheduling</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Bell" size={16} className="text-primary flex-shrink-0" />
                <span>Smart reminders</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Repeat" size={16} className="text-primary flex-shrink-0" />
                <span>Recurring events</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <p className="text-sm text-gray-500">
            In the meantime, check out your tasks organized by time:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/today">
              <Button variant="outline" size="sm">
                <ApperIcon name="Calendar" size={16} className="mr-2" />
                Today
              </Button>
            </a>
            <a href="/upcoming">
              <Button variant="outline" size="sm">
                <ApperIcon name="Clock" size={16} className="mr-2" />
                Upcoming
              </Button>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Calendar