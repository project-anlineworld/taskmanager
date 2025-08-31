'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale';
import { TaskStatus, Priority, User } from '@/types/task';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => void;
  users: User[];
  editingTask?: TaskFormData | null;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  dueDate: Date | null | undefined;
  resourceLinks: string[];
  tags: string[];
}

const statusOptions: TaskStatus[] = ['未着手', '進行中', 'レビュー待ち', '完了'];
const priorityOptions: Priority[] = ['low', 'medium', 'high', 'urgent'];

const priorityLabels = {
  low: '低',
  medium: '中',
  high: '高',
  urgent: '緊急',
};

const mockUsers: User[] = [
  { id: '1', name: '田中太郎', email: 'tanaka@example.com', role: 'developer', permissions: [], createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: '佐藤花子', email: 'sato@example.com', role: 'developer', permissions: [], createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: '鈴木一郎', email: 'suzuki@example.com', role: 'manager', permissions: [], createdAt: new Date(), updatedAt: new Date() },
];

export function TaskForm({ open, onClose, onSubmit, users = mockUsers, editingTask }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: editingTask?.title || '',
    description: editingTask?.description || '',
    status: editingTask?.status || '未着手',
    priority: editingTask?.priority || 'medium',
    assigneeId: editingTask?.assigneeId || '',
    dueDate: editingTask?.dueDate || null,
    resourceLinks: editingTask?.resourceLinks || [],
    tags: editingTask?.tags || [],
  });

  const [newResourceLink, setNewResourceLink] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({
      title: '',
      description: '',
      status: '未着手',
      priority: 'medium',
      assigneeId: '',
      dueDate: null,
      resourceLinks: [],
      tags: [],
    });
  };

  const addResourceLink = () => {
    if (newResourceLink.trim()) {
      setFormData(prev => ({
        ...prev,
        resourceLinks: [...prev.resourceLinks, newResourceLink.trim()]
      }));
      setNewResourceLink('');
    }
  };

  const removeResourceLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resourceLinks: prev.resourceLinks.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTask ? 'タスクを編集' : '新しいタスクを作成'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="タスク名"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                fullWidth
              />

              <TextField
                label="説明"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                fullWidth
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>ステータス</InputLabel>
                  <Select
                    value={formData.status}
                    label="ステータス"
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as TaskStatus }))}
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>優先度</InputLabel>
                  <Select
                    value={formData.priority}
                    label="優先度"
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Priority }))}
                  >
                    {priorityOptions.map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        {priorityLabels[priority]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>担当者</InputLabel>
                  <Select
                    value={formData.assigneeId}
                    label="担当者"
                    onChange={(e) => setFormData(prev => ({ ...prev, assigneeId: e.target.value }))}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <DatePicker
                  label="期限"
                  value={formData.dueDate}
                  onChange={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
                  sx={{ flex: 1 }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  参考資料リンク
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    size="small"
                    placeholder="URLを入力"
                    value={newResourceLink}
                    onChange={(e) => setNewResourceLink(e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <Button variant="outlined" size="small" onClick={addResourceLink}>
                    追加
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.resourceLinks.map((link, index) => (
                    <Chip
                      key={index}
                      label={link}
                      onDelete={() => removeResourceLink(index)}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  タグ
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    size="small"
                    placeholder="タグを入力"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <Button variant="outlined" size="small" onClick={addTag}>
                    追加
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => removeTag(index)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit" variant="contained">
              {editingTask ? '更新' : '作成'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}