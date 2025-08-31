'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { Task, TaskStatus, Priority, TaskFilter } from '@/types/task';
import { TaskForm, TaskFormData } from './TaskForm';

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case '未着手':
      return 'default';
    case '進行中':
      return 'primary';
    case 'レビュー待ち':
      return 'warning';
    case '完了':
      return 'success';
    default:
      return 'default';
  }
};

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'low':
      return 'success';
    case 'medium':
      return 'info';
    case 'high':
      return 'warning';
    case 'urgent':
      return 'error';
    default:
      return 'default';
  }
};

const priorityLabels = {
  low: '低',
  medium: '中',
  high: '高',
  urgent: '緊急',
};

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'ユーザー認証機能の実装',
    description: 'JWT を使用したユーザー認証システムを実装する',
    status: '進行中',
    priority: 'high',
    assigneeId: '1',
    assignee: { id: '1', name: '田中太郎', email: 'tanaka@example.com', role: 'developer', permissions: [], createdAt: new Date(), updatedAt: new Date() },
    createdBy: '3',
    creator: { id: '3', name: '鈴木一郎', email: 'suzuki@example.com', role: 'manager', permissions: [], createdAt: new Date(), updatedAt: new Date() },
    dueDate: new Date('2025-09-05'),
    createdAt: new Date('2025-08-20'),
    updatedAt: new Date('2025-08-30'),
    resourceLinks: ['https://jwt.io/introduction/'],
    tags: ['認証', 'セキュリティ'],
  },
  {
    id: '2',
    title: 'API ドキュメントの作成',
    description: 'REST API の詳細なドキュメントを Swagger で作成する',
    status: 'レビュー待ち',
    priority: 'medium',
    assigneeId: '2',
    assignee: { id: '2', name: '佐藤花子', email: 'sato@example.com', role: 'developer', permissions: [], createdAt: new Date(), updatedAt: new Date() },
    createdBy: '3',
    creator: { id: '3', name: '鈴木一郎', email: 'suzuki@example.com', role: 'manager', permissions: [], createdAt: new Date(), updatedAt: new Date() },
    dueDate: new Date('2025-09-03'),
    createdAt: new Date('2025-08-18'),
    updatedAt: new Date('2025-08-29'),
    resourceLinks: ['https://swagger.io/'],
    tags: ['ドキュメント', 'API'],
  },
  {
    id: '3',
    title: 'データベース設計の見直し',
    description: 'パフォーマンス向上のためのDB設計見直し',
    status: '未着手',
    priority: 'low',
    assigneeId: '3',
    assignee: { id: '3', name: '鈴木一郎', email: 'suzuki@example.com', role: 'manager', permissions: [], createdAt: new Date(), updatedAt: new Date() },
    createdBy: '1',
    creator: { id: '1', name: '田中太郎', email: 'tanaka@example.com', role: 'developer', permissions: [], createdAt: new Date(), updatedAt: new Date() },
    dueDate: new Date('2025-09-10'),
    createdAt: new Date('2025-08-25'),
    updatedAt: new Date('2025-08-25'),
    tags: ['データベース', 'パフォーマンス'],
  },
];

interface TaskListProps {
  showMyTasks?: boolean;
}

export function TaskList({ showMyTasks = false }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filter, setFilter] = useState<TaskFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskFormData | null>(null);

  const filteredTasks = tasks.filter(task => {
    if (showMyTasks && task.assigneeId !== '1') return false; // Mock current user ID
    if (filter.status?.length && !filter.status.includes(task.status)) return false;
    if (filter.priority?.length && !filter.priority.includes(task.priority)) return false;
    if (filter.assigneeId && task.assigneeId !== filter.assigneeId) return false;
    return true;
  });

  const handleCreateTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      assignee: mockTasks[0].assignee, // Mock assignee lookup
      creator: mockTasks[0].creator,
      createdBy: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assigneeId: task.assigneeId,
      dueDate: task.dueDate,
      resourceLinks: task.resourceLinks || [],
      tags: task.tags || [],
    });
    setFormOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const clearFilters = () => {
    setFilter({});
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          {showMyTasks ? 'マイタスク' : '全タスク'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={showFilters ? 'contained' : 'outlined'}
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            フィルター
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
          >
            新規作成
          </Button>
        </Box>
      </Box>

      {showFilters && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              フィルター
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <FormControl sx={{ minWidth: 200, flex: 1 }}>
                <InputLabel>ステータス</InputLabel>
                <Select
                  multiple
                  value={filter.status || []}
                  label="ステータス"
                  onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value as TaskStatus[] }))}
                >
                  <MenuItem value="未着手">未着手</MenuItem>
                  <MenuItem value="進行中">進行中</MenuItem>
                  <MenuItem value="レビュー待ち">レビュー待ち</MenuItem>
                  <MenuItem value="完了">完了</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 200, flex: 1 }}>
                <InputLabel>優先度</InputLabel>
                <Select
                  multiple
                  value={filter.priority || []}
                  label="優先度"
                  onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value as Priority[] }))}
                >
                  <MenuItem value="low">低</MenuItem>
                  <MenuItem value="medium">中</MenuItem>
                  <MenuItem value="high">高</MenuItem>
                  <MenuItem value="urgent">緊急</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 200, flex: 1 }}>
                <InputLabel>担当者</InputLabel>
                <Select
                  value={filter.assigneeId || ''}
                  label="担当者"
                  onChange={(e) => setFilter(prev => ({ ...prev, assigneeId: e.target.value }))}
                >
                  <MenuItem value="">全員</MenuItem>
                  <MenuItem value="1">田中太郎</MenuItem>
                  <MenuItem value="2">佐藤花子</MenuItem>
                  <MenuItem value="3">鈴木一郎</MenuItem>
                </Select>
              </FormControl>
              <Button onClick={clearFilters} variant="outlined" sx={{ minWidth: 120 }}>
                クリア
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>タスク名</TableCell>
                  <TableCell>担当者</TableCell>
                  <TableCell>ステータス</TableCell>
                  <TableCell>優先度</TableCell>
                  <TableCell>期限</TableCell>
                  <TableCell>タグ</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {task.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {task.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                          {task.assignee.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">
                          {task.assignee.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.status}
                        color={getStatusColor(task.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={priorityLabels[task.priority]}
                        color={getPriorityColor(task.priority)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {task.dueDate?.toLocaleDateString('ja-JP')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {task.tags?.slice(0, 2).map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                        {(task.tags?.length || 0) > 2 && (
                          <Typography variant="caption" color="text.secondary">
                            +{(task.tags?.length || 0) - 2}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleEditTask(task)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteTask(task.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {filteredTasks.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                タスクが見つかりませんでした
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <TaskForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateTask}
        users={[]}
        editingTask={editingTask}
      />
    </Box>
  );
}