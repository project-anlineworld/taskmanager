import { AppLayout } from '@/components/layout/AppLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { Container } from '@mui/material';

export default function MyTasksPage() {
  return (
    <AppLayout>
      <Container maxWidth="lg">
        <TaskList showMyTasks={true} />
      </Container>
    </AppLayout>
  );
}