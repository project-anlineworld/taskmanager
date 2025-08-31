import { AppLayout } from '@/components/layout/AppLayout';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';
import { Container } from '@mui/material';

export default function NotificationsPage() {
  return (
    <AppLayout>
      <Container maxWidth="lg">
        <NotificationPanel />
      </Container>
    </AppLayout>
  );
}