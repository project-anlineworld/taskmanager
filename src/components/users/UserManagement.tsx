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
  Avatar,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { User, UserRole } from '@/types/task';

const roleLabels = {
  admin: '管理者',
  manager: 'マネージャー',
  developer: '開発者',
  viewer: '閲覧者',
};

const getRoleColor = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return 'error';
    case 'manager':
      return 'warning';
    case 'developer':
      return 'primary';
    case 'viewer':
      return 'default';
    default:
      return 'default';
  }
};

const mockUsers: User[] = [
  {
    id: '1',
    name: '田中太郎',
    email: 'tanaka@example.com',
    discordId: 'tanaka#1234',
    role: 'developer',
    permissions: [],
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-08-30'),
  },
  {
    id: '2',
    name: '佐藤花子',
    email: 'sato@example.com',
    discordId: 'sato#5678',
    role: 'developer',
    permissions: [],
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-08-29'),
  },
  {
    id: '3',
    name: '鈴木一郎',
    email: 'suzuki@example.com',
    discordId: 'suzuki#9012',
    role: 'manager',
    permissions: [],
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2025-08-28'),
  },
  {
    id: '4',
    name: '高橋次郎',
    email: 'takahashi@example.com',
    role: 'admin',
    permissions: [],
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2025-08-31'),
  },
];

interface UserFormData {
  name: string;
  email: string;
  discordId: string;
  role: UserRole;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    discordId: '',
    role: 'developer',
  });

  const handleOpenForm = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        discordId: user.discordId || '',
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        discordId: '',
        role: 'developer',
      });
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData, updatedAt: new Date() }
          : user
      ));
    } else {
      const newUser: User = {
        ...formData,
        id: Date.now().toString(),
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUsers(prev => [...prev, newUser]);
    }
    
    handleCloseForm();
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('このユーザーを削除してもよろしいですか？')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          ユーザー管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => handleOpenForm()}
        >
          新規ユーザー追加
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ユーザー</TableCell>
                  <TableCell>メールアドレス</TableCell>
                  <TableCell>Discord ID</TableCell>
                  <TableCell>権限</TableCell>
                  <TableCell>登録日</TableCell>
                  <TableCell>最終更新</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar>{user.name.charAt(0)}</Avatar>
                        <Typography variant="body2" fontWeight="medium">
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.discordId || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={roleLabels[user.role]}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.createdAt.toLocaleDateString('ja-JP')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.updatedAt.toLocaleDateString('ja-JP')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleOpenForm(user)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.role === 'admin'}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'ユーザー情報を編集' : '新規ユーザー追加'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="名前"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                fullWidth
              />
              <TextField
                label="メールアドレス"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Discord ID"
                value={formData.discordId}
                onChange={(e) => setFormData(prev => ({ ...prev, discordId: e.target.value }))}
                fullWidth
                placeholder="username#1234"
              />
              <FormControl fullWidth>
                <InputLabel>権限</InputLabel>
                <Select
                  value={formData.role}
                  label="権限"
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
                >
                  <MenuItem value="viewer">閲覧者</MenuItem>
                  <MenuItem value="developer">開発者</MenuItem>
                  <MenuItem value="manager">マネージャー</MenuItem>
                  <MenuItem value="admin">管理者</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm}>
              キャンセル
            </Button>
            <Button type="submit" variant="contained">
              {editingUser ? '更新' : '追加'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}