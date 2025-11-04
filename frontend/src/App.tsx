import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { wsClient } from './lib/websocket-client';

import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/rbac/UsersPage';
import RolesPage from './pages/rbac/RolesPage';
import GroupsPage from './pages/rbac/GroupsPage';
import PermissionsPage from './pages/rbac/PermissionsPage';
import ApprovalsPage from './pages/workflow/ApprovalsPage';
import PatternsPage from './pages/workflow/PatternsPage';
import ExceptionsPage from './pages/workflow/ExceptionsPage';
import ClaimsPage from './pages/workflow/ClaimsPage';
import AdminSettings from './pages/AdminSettings';

const queryClient = new QueryClient();

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

function AppContent() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      wsClient.connect(user.id);
    }

    return () => {
      wsClient.disconnect();
    };
  }, [user]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={<AdminSettings />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/permissions" element={<PermissionsPage />} />
        <Route path="/approvals" element={<ApprovalsPage />} />
        <Route path="/patterns" element={<PatternsPage />} />
        <Route path="/exceptions" element={<ExceptionsPage />} />
        <Route path="/claims" element={<ClaimsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <SignedIn>
            <AppContent />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </Router>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
