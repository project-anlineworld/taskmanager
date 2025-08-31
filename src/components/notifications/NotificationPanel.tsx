'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Divider,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Assignment as TaskIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  MarkAsUnread as MarkAsUnreadIcon,
} from '@mui/icons-material';
import { Notification, User } from '@/types/task';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'assignment':
      return <PersonIcon color="primary" />;
    case 'status_change':
      return <TaskIcon color="success" />;
    case 'reminder':
      return <ScheduleIcon color="warning" />;
    case 'due_date':
      return <ScheduleIcon color="error" />;
    default:
      return <NotificationsIcon />;
  }
};

const typeLabels = {
  assignment: 'アサイン通知',
  status_change: 'ステータス変更',
  reminder: 'リマインダー',
  due_date: '期限通知',
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    recipientId: '1',
    senderId: '3',
    taskId: '1',
    message: 'ユーザー認証機能の実装がアサインされました',
    type: 'assignment',
    isRead: false,
    createdAt: new Date('2025-08-31T10:00:00'),
  },
  {
    id: '2',
    recipientId: '2',
    senderId: '1',
    taskId: '2',
    message: 'API ドキュメントの作成がレビュー待ちになりました',
    type: 'status_change',
    isRead: true,
    createdAt: new Date('2025-08-30T14:30:00'),
  },
  {
    id: '3',
    recipientId: '1',
    senderId: 'system',
    taskId: '1',
    message: 'ユーザー認証機能の実装の期限が近づいています（2025/09/05）',
    type: 'due_date',
    isRead: false,
    createdAt: new Date('2025-08-31T09:00:00'),
  },
];

const mockUsers: User[] = [
  { id: '1', name: '田中太郎', email: 'tanaka@example.com', role: 'developer', permissions: [], createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: '佐藤花子', email: 'sato@example.com', role: 'developer', permissions: [], createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: '鈴木一郎', email: 'suzuki@example.com', role: 'manager', permissions: [], createdAt: new Date(), updatedAt: new Date() },
];

interface NotificationFormData {
  recipientId: string;
  message: string;
  type: 'reminder' | 'assignment' | 'status_change' | 'due_date';
}

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState<NotificationFormData>({
    recipientId: '',
    message: '',
    type: 'reminder',
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = activeTab === 0 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const handleMarkAsUnread = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: false } : n)
    );
  };

  const handleDelete = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotification: Notification = {
      id: Date.now().toString(),
      ...formData,
      senderId: '1', // Current user ID
      taskId: 'manual', // Manual notification
      isRead: false,
      createdAt: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev]);
    setFormOpen(false);
    setFormData({
      recipientId: '',
      message: '',
      type: 'reminder',
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4">
            通知
          </Typography>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {unreadCount > 0 && (
            <Button variant="outlined" onClick={handleMarkAllAsRead}>
              全て既読にする
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => setFormOpen(true)}
          >
            手動通知送信
          </Button>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          >
            <Tab label="全ての通知" />
            <Tab label={`未読 (${unreadCount})`} />
          </Tabs>

          <List>
            {filteredNotifications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  {activeTab === 0 ? '通知はありません' : '未読の通知はありません'}
                </Typography>
              </Box>
            ) : (
              filteredNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      backgroundColor: notification.isRead ? 'transparent' : 'action.hover',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ListItemIcon>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="body2" fontWeight={notification.isRead ? 'normal' : 'bold'}>
                            {notification.message}
                          </Typography>
                          <Chip
                            label={typeLabels[notification.type]}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {notification.createdAt.toLocaleString('ja-JP')}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {notification.isRead ? (
                          <IconButton size="small" onClick={() => handleMarkAsUnread(notification.id)}>
                            <MarkAsUnreadIcon fontSize="small" />
                          </IconButton>
                        ) : (
                          <IconButton size="small" onClick={() => handleMarkAsRead(notification.id)}>
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton size="small" onClick={() => handleDelete(notification.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < filteredNotifications.length - 1 && <Divider />}
                </React.Fragment>
              ))
            )}
          </List>
        </CardContent>
      </Card>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>手動通知送信</DialogTitle>
        <form onSubmit={handleSendNotification}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>送信先</InputLabel>
                <Select
                  value={formData.recipientId}
                  label="送信先"
                  onChange={(e) => setFormData(prev => ({ ...prev, recipientId: e.target.value }))}
                >
                  {mockUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>通知タイプ</InputLabel>
                <Select
                  value={formData.type}
                  label="通知タイプ"
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'reminder' | 'assignment' | 'status_change' | 'due_date' }))}
                >
                  <MenuItem value="reminder">リマインダー</MenuItem>
                  <MenuItem value="assignment">アサイン通知</MenuItem>
                  <MenuItem value="status_change">ステータス変更</MenuItem>
                  <MenuItem value="due_date">期限通知</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="メッセージ"
                required
                multiline
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                fullWidth
                placeholder="通知メッセージを入力してください"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormOpen(false)}>
              キャンセル
            </Button>
            <Button type="submit" variant="contained" startIcon={<SendIcon />}>
              送信
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}