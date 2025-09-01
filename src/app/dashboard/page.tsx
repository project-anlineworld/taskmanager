'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useTasks } from '@/hooks/useTasks'
import { supabase, Task, Profile } from '@/lib/supabase'
import TaskBoard from '@/components/TaskBoard'
import TaskModal from '@/components/TaskModal'

export default function DashboardPage() {
  const { isAuthenticated, loading: authLoading, user, signOut } = useAuth()
  const { tasks, loading: tasksLoading, createTask, updateTask, deleteTask } = useTasks()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('display_name')
      
      setProfiles(data || [])
    }
    
    if (isAuthenticated) {
      fetchProfiles()
    }
  }, [isAuthenticated])

  const handleStatusChange = async (id: string, status: Task['status']) => {
    await updateTask(id, { status })
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    const task = tasks.find(t => t.id === id)
    const isCompleted = task?.status === '完了'
    const message = isCompleted 
      ? 'この完了済みタスクを終了（削除）しますか？' 
      : 'このタスクを削除しますか？'
    
    if (window.confirm(message)) {
      await deleteTask(id)
    }
  }

  const handleSaveTask = async (taskData: Partial<Task>) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData)
    } else {
      // Ensure title is provided for new tasks
      if (taskData.title) {
        await createTask({
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          assignee_id: taskData.assignee_id,
          due_date: taskData.due_date,
          estimated_hours: taskData.estimated_hours,
          tags: taskData.tags,
        })
      }
    }
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth')
  }

  if (authLoading || tasksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" suppressHydrationWarning>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">タスク管理システム</h1>
              <p className="mt-1 text-sm text-gray-500">
                ようこそ、{user?.email}さん
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                新しいタスク
              </button>
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">未着手</h3>
              <p className="text-2xl font-bold text-gray-900">
                {tasks.filter(t => t.status === '未着手').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">進行中</h3>
              <p className="text-2xl font-bold text-blue-600">
                {tasks.filter(t => t.status === '進行中').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">レビュー待ち</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {tasks.filter(t => t.status === 'レビュー待ち').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">完了</h3>
              <p className="text-2xl font-bold text-green-600">
                {tasks.filter(t => t.status === '完了').length}
              </p>
            </div>
          </div>
        </div>

        <TaskBoard
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveTask}
        task={editingTask}
        profiles={profiles}
      />
    </div>
  )
}