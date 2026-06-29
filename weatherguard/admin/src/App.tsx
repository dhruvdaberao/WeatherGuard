import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AllUsersPage, PendingUsersPage, ApprovedUsersPage, RejectedUsersPage } from './pages/AdminUsersPages';
import { AdminLayout } from './components/admin/AdminLayout';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { HireMePage } from './pages/HireMePage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster 
        position="top-center" 
        toastOptions={{
          className: 'text-sm font-medium tracking-wide shadow-lg',
          style: {
            padding: '16px 24px',
            borderRadius: '12px',
            maxWidth: '500px',
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e', // green-500
              secondary: '#fff',
            },
          },
        }}
      />
      <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/hire-me" element={<HireMePage />} />
        
        {/* Protected Routes (User Dashboard) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminLayout>
                <AdminDashboardPage />
              </AdminLayout>
            </AdminRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/users" element={
          <ProtectedRoute><AdminRoute><AdminLayout><AllUsersPage /></AdminLayout></AdminRoute></ProtectedRoute>
        } />
        
        <Route path="/admin/pending" element={
          <ProtectedRoute><AdminRoute><AdminLayout><PendingUsersPage /></AdminLayout></AdminRoute></ProtectedRoute>
        } />
        
        <Route path="/admin/approved" element={
          <ProtectedRoute><AdminRoute><AdminLayout><ApprovedUsersPage /></AdminLayout></AdminRoute></ProtectedRoute>
        } />
        
        <Route path="/admin/rejected" element={
          <ProtectedRoute><AdminRoute><AdminLayout><RejectedUsersPage /></AdminLayout></AdminRoute></ProtectedRoute>
        } />

        <Route path="/" element={<LoginPage />} />
      </Routes>
      </Router>
    </>
  );
}

export default App;
