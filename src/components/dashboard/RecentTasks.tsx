'use client';

import React from 'react';
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
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { Task, TaskStatus } from '@/types/task';

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

const mockTasks: Partial<Task>[] = [
  {
    id: '1',
    title: 'ユーザー認証機能の実装',
    status: '進行中',
    assignee: { id: '1', name: '田中太郎', email: '', role: 'developer', permissions: [], createdAt: new Date(), updatedAt: new Date() },
    dueDate: new Date('2025-09-05'),
  },
  {
    id: '2',
    title: 'API ドキュメントの作成',
    status: 'レビュー待ち',
    assignee: { id: '2', name: '佐藤花子', email: '', role: 'developer', permissions: [], createdAt: new Date(), updatedAt: new Date() },
    dueDate: new Date('2025-09-03'),
  },
  {
    id: '3',
    title: 'データベース設計の見直し',
    status: '未着手',
    assignee: { id: '3', name: '鈴木一郎', email: '', role: 'developer', permissions: [], createdAt: new Date(), updatedAt: new Date() },
    dueDate: new Date('2025-09-10'),
  },
  {
    id: '4',
    title: 'フロントエンド UI の修正',
    status: '完了',
    assignee: { id: '1', name: '田中太郎', email: '', role: 'developer', permissions: [], createdAt: new Date(), updatedAt: new Date() },
    dueDate: new Date('2025-08-30'),
  },
];

export function RecentTasks() {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            最近のタスク
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>タスク名</TableCell>
                <TableCell>担当者</TableCell>
                <TableCell>ステータス</TableCell>
                <TableCell>期限</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockTasks.map((task) => (
                <TableRow key={task.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {task.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {task.assignee?.name?.charAt(0)}
                      </Avatar>
                      <Typography variant="body2">
                        {task.assignee?.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.status}
                      color={getStatusColor(task.status!)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {task.dueDate?.toLocaleDateString('ja-JP')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}