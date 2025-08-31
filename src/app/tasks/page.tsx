import { AppLayout } from '@/components/layout/AppLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { Container } from '@mui/material';

export default function TasksPage() {
  return (
    <AppLayout>
      <Container maxWidth="lg">
        <TaskList />
      </Container>
    </AppLayout>
  );
}