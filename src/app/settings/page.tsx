import { AppLayout } from '@/components/layout/AppLayout';
import { UserManagement } from '@/components/users/UserManagement';
import { Container } from '@mui/material';

export default function SettingsPage() {
  return (
    <AppLayout>
      <Container maxWidth="lg">
        <UserManagement />
      </Container>
    </AppLayout>
  );
}