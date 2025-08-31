'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  PlayArrow as PlayArrowIcon,
  RateReview as ReviewIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { TaskStatus } from '@/types/task';

interface StatusCount {
  status: TaskStatus;
  count: number;
  color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  icon: React.ReactNode;
}

const statusCounts: StatusCount[] = [
  {
    status: '未着手',
    count: 8,
    color: 'default',
    icon: <AssignmentIcon />,
  },
  {
    status: '進行中',
    count: 5,
    color: 'primary',
    icon: <PlayArrowIcon />,
  },
  {
    status: 'レビュー待ち',
    count: 3,
    color: 'warning',
    icon: <ReviewIcon />,
  },
  {
    status: '完了',
    count: 12,
    color: 'success',
    icon: <CheckCircleIcon />,
  },
];

export function TaskSummary() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        タスクサマリー
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {statusCounts.map((item) => (
          <Box key={item.status} sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '22%' } }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Box sx={{ color: 'text.secondary' }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h4" component="div">
                    {item.count}
                  </Typography>
                </Box>
                <Chip
                  label={item.status}
                  color={item.color}
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}