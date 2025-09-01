'use client'

import { Task } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface TaskCardProps {
  task: Task
  onStatusChange: (id: string, status: Task['status']) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

const statusColors = {
  '未着手': 'bg-gray-100 text-gray-800 border-gray-200',
  '進行中': 'bg-blue-100 text-blue-800 border-blue-200',
  'レビュー待ち': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  '完了': 'bg-green-100 text-green-800 border-green-200',
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600',
}

const priorityLabels = {
  low: '低',
  medium: '中',
  high: '高',
  urgent: '緊急',
}

export default function TaskCard({ task, onStatusChange, onEdit, onDelete }: TaskCardProps) {
  const { user, isManager } = useAuth()

  const canEdit = user && (
    task.assignee_id === user.id || 
    task.reporter_id === user.id || 
    isManager
  )

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(task.id, e.target.value as Task['status'])
  }

  return (
    <div className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
      task.status === '完了' ? 'opacity-80 bg-gray-50' : ''
    }`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg text-gray-900 flex-1 mr-2">
          {task.title}
        </h3>
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
            {priorityLabels[task.priority]}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[task.status]}`}>
            {task.status}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 mb-3 text-sm">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {task.tags?.map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
            #{tag}
          </span>
        ))}
      </div>

      <div className="text-xs text-gray-500 mb-3 space-y-1">
        {task.assignee && (
          <div>担当: {task.assignee.display_name || task.assignee.username}</div>
        )}
        {task.reporter && (
          <div>報告者: {task.reporter.display_name || task.reporter.username}</div>
        )}
        {task.due_date && (
          <div>期限: {new Date(task.due_date).toLocaleDateString('ja-JP')}</div>
        )}
        {task.estimated_hours && (
          <div>見積: {task.estimated_hours}時間</div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <select
          value={task.status}
          onChange={handleStatusChange}
          disabled={!canEdit || task.status === '完了'}
          className="text-xs border rounded px-2 py-1 text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="未着手">未着手</option>
          <option value="進行中">進行中</option>
          <option value="レビュー待ち">レビュー待ち</option>
          <option value="完了">完了</option>
        </select>

        {canEdit && (
          <div className="flex gap-1">
            {task.status !== '完了' && (
              <button
                onClick={() => onEdit(task)}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
              >
                編集
              </button>
            )}
            {/* 完了したタスクは担当者・報告者も削除可能、他は管理者のみ */}
            {(task.status === '完了' && canEdit) || isManager ? (
              <button
                onClick={() => onDelete(task.id)}
                className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
              >
                {task.status === '完了' ? '終了' : '削除'}
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}