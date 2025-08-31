export type TaskStatus = '未着手' | '進行中' | 'レビュー待ち' | '完了';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type UserRole = 'admin' | 'manager' | 'developer' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  discordId?: string;
  role: UserRole;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  assignee: User;
  createdBy: string;
  creator: User;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  resourceLinks?: string[];
  tags?: string[];
}

export interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  taskId: string;
  message: string;
  type: 'reminder' | 'assignment' | 'status_change' | 'due_date';
  isRead: boolean;
  createdAt: Date;
}

export interface TaskFilter {
  status?: TaskStatus[];
  assigneeId?: string;
  priority?: Priority[];
  dueDateRange?: {
    start?: Date;
    end?: Date;
  };
  tags?: string[];
}