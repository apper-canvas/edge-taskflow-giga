import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import TaskCard from "@/components/molecules/TaskCard"

const TaskList = ({ tasks, onUpdateTask, onToggleComplete, onDeleteTask }) => {
  // Separate completed and active tasks
  const activeTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)

  return (
    <div className="space-y-8">
      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
            Active Tasks ({activeTasks.length})
          </h2>
          
          <div className="grid gap-4">
            <AnimatePresence>
              {activeTasks.map((task) => (
                <motion.div
                  key={task.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <TaskCard
                    task={task}
                    onUpdate={onUpdateTask}
                    onToggleComplete={onToggleComplete}
                    onDelete={onDeleteTask}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-600 mb-4 flex items-center">
            <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
            Completed Tasks ({completedTasks.length})
          </h2>
          
          <div className="grid gap-4">
            <AnimatePresence>
              {completedTasks.map((task) => (
                <motion.div
                  key={task.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  layout
                  className="opacity-70"
                >
                  <TaskCard
                    task={task}
                    onUpdate={onUpdateTask}
                    onToggleComplete={onToggleComplete}
                    onDelete={onDeleteTask}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskList