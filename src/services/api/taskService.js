import mockTasks from "@/services/mockData/tasks.json"

// Simulate localStorage for persistent data
const STORAGE_KEY = "taskflow_tasks"

// Initialize localStorage with mock data if empty
const initializeStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTasks))
    return mockTasks
  }
  return JSON.parse(stored)
}

// Save tasks to localStorage
const saveTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

// Get tasks from localStorage
const getTasks = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : mockTasks
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const taskService = {
  // Get all tasks
  async getAll() {
    await delay(200)
    const tasks = getTasks()
    return [...tasks]
  },

  // Get task by ID
  async getById(id) {
    await delay(200)
    const tasks = getTasks()
    const task = tasks.find(task => task.Id === parseInt(id))
    return task ? { ...task } : null
  },

  // Create new task
async create(taskData) {
    await delay(300)
    const tasks = getTasks()
    
    // Generate new ID
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) : 0
    const newTask = {
      Id: maxId + 1,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      userId: taskData.userId || 1, // Default to user 1 for now
      projectId: taskData.projectId || null
    }
    
    const updatedTasks = [newTask, ...tasks]
    saveTasks(updatedTasks)
    
    return { ...newTask }
  },

  // Update task
  async update(id, updates) {
    await delay(250)
    const tasks = getTasks()
    const taskIndex = tasks.findIndex(task => task.Id === parseInt(id))
    
    if (taskIndex === -1) {
      throw new Error("Task not found")
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      ...updates,
      completedAt: updates.completed && !tasks[taskIndex].completed 
        ? new Date().toISOString() 
        : updates.completed === false 
          ? null 
          : tasks[taskIndex].completedAt
    }
    
    tasks[taskIndex] = updatedTask
    saveTasks(tasks)
    
    return { ...updatedTask }
  },

  // Delete task
  async delete(id) {
    await delay(200)
    const tasks = getTasks()
    const filteredTasks = tasks.filter(task => task.Id !== parseInt(id))
    
    if (filteredTasks.length === tasks.length) {
      throw new Error("Task not found")
    }
    
    saveTasks(filteredTasks)
    return true
  },

  // Toggle task completion
  async toggleComplete(id) {
    await delay(200)
    const tasks = getTasks()
    const taskIndex = tasks.findIndex(task => task.Id === parseInt(id))
    
    if (taskIndex === -1) {
      throw new Error("Task not found")
    }
    
    const task = tasks[taskIndex]
    const updatedTask = {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null
    }
    
    tasks[taskIndex] = updatedTask
    saveTasks(tasks)
    
    return { ...updatedTask }
  }
}

// Initialize storage on module load
initializeStorage()