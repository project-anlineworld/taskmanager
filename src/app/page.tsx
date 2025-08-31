import { AppLayout } from '@/components/layout/AppLayout';
import { TaskSummary } from '@/components/dashboard/TaskSummary';
import { RecentTasks } from '@/components/dashboard/RecentTasks';
import { Container, Typography, Box } from '@mui/material';

export default function Home() {
  return (
    <AppLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            ダッシュボード
          </Typography>
          <Typography variant="body1" color="text.secondary">
            タスクの進捗状況を確認しましょう
          </Typography>
        </Box>
        <TaskSummary />
        <RecentTasks />
      </Container>
    </AppLayout>
  );
}
