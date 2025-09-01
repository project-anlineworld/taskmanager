'use client'

import { Task } from '@/lib/supabase'
import TaskCard from './TaskCard'

interface TaskBoardProps {
  tasks: Task[]
  onStatusChange: (id: string, status: Task['status']) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

const statusColumns: { status: Task['status']; label: string; color: string }[] = [
  { status: '未着手', label: '未着手', color: 'bg-gray-50 border-gray-200' },
  { status: '進行中', label: '進行中', color: 'bg-blue-50 border-blue-200' },
  { status: 'レビュー待ち', label: 'レビュー待ち', color: 'bg-yellow-50 border-yellow-200' },
  { status: '完了', label: '完了', color: 'bg-green-50 border-green-200' },
]

export default function TaskBoard({ tasks, onStatusChange, onEdit, onDelete }: TaskBoardProps) {
  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statusColumns.map(column => {
        const columnTasks = getTasksByStatus(column.status)
        
        return (
          <div key={column.status} className={`border rounded-lg ${column.color}`}>
            <div className="p-4 border-b">
              <h2 className="font-semibold text-lg">
                {column.label}
                <span className="ml-2 text-sm bg-white px-2 py-1 rounded-full">
                  {columnTasks.length}
                </span>
              </h2>
            </div>
            
            <div className="p-4 space-y-4 min-h-96">
              {columnTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={onStatusChange}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
              
              {columnTasks.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  タスクはありません
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}