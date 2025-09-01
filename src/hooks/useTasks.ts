'use client'

import { useState, useEffect } from 'react'
import { supabase, Task } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:assignee_id(id, username, display_name, avatar_url),
          reporter:reporter_id(id, username, display_name, avatar_url),
          reviewer:reviewer_id(id, username, display_name, avatar_url)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setTasks(data || [])
      }
    } catch {
      setError('タスクの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchTasks()
    }
  }, [user])

  const createTask = async (taskData: {
    title: string
    description?: string
    status?: Task['status']
    priority?: Task['priority']
    assignee_id?: string
    due_date?: string
    estimated_hours?: number
    tags?: string[]
  }) => {
    if (!user) return { error: { message: 'Not authenticated' } }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...taskData,
        reporter_id: user.id,
      })
      .select(`
        *,
        assignee:assignee_id(id, username, display_name, avatar_url),
        reporter:reporter_id(id, username, display_name, avatar_url),
        reviewer:reviewer_id(id, username, display_name, avatar_url)
      `)
      .single()

    if (data && !error) {
      setTasks(prev => [data, ...prev])
    }

    return { data, error }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        assignee:assignee_id(id, username, display_name, avatar_url),
        reporter:reporter_id(id, username, display_name, avatar_url),
        reviewer:reviewer_id(id, username, display_name, avatar_url)
      `)
      .single()

    if (data && !error) {
      setTasks(prev => prev.map(task => task.id === id ? data : task))
    }

    return { data, error }
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (!error) {
      setTasks(prev => prev.filter(task => task.id !== id))
    }

    return { error }
  }

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status)
  }

  const getMyTasks = () => {
    return tasks.filter(task => task.assignee_id === user?.id)
  }

  const getReportedTasks = () => {
    return tasks.filter(task => task.reporter_id === user?.id)
  }

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
    getTasksByStatus,
    getMyTasks,
    getReportedTasks,
  }
}