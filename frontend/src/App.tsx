import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { Suspense, lazy } from 'react'
import MainLayout from './components/Layout/MainLayout'
import AuthLayout from './components/Layout/AuthLayout'
import ProtectedLayout from './components/Layout/ProtectedLayout'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import PublicRoute from './components/Auth/PublicRoute'
import RequirePermission from './components/Auth/RequirePermission'
import { 
  Login, Register, ForgotPassword, 
  ResetPassword
} from './pages/Auth'

// Lazy load main pages
const Dashboard = lazy(() => import('./pages/Dashboard'))
const People = lazy(() => import('./pages/People'))
const PersonDetail = lazy(() => import('./pages/People/PersonDetail'))
const PersonForm = lazy(() => import('./pages/People/PersonForm'))
const Churches = lazy(() => import('./pages/Churches'))
const ChurchDetail = lazy(() => import('./pages/Churches/ChurchDetail'))
const ChurchForm = lazy(() => import('./pages/Churches/ChurchForm'))
const Committees = lazy(() => import('./pages/Committees'))
const CommitteeDetail = lazy(() => import('./pages/Committees/CommitteeDetail'))
const CommitteeForm = lazy(() => import('./pages/Committees/CommitteeForm'))
const Teams = lazy(() => import('./pages/Teams'))
const TeamDetail = lazy(() => import('./pages/Teams/TeamDetail'))
const TeamForm = lazy(() => import('./pages/Teams/TeamForm'))
const Groups = lazy(() => import('./pages/Groups'))
const GroupDetail = lazy(() => import('./pages/Groups/GroupDetail'))
const GroupForm = lazy(() => import('./pages/Groups/GroupForm'))
const Events = lazy(() => import('./pages/Events'))
const Reports = lazy(() => import('./pages/Reports'))
const Evaluations = lazy(() => import('./pages/Evaluations'))
const Search = lazy(() => import('./pages/Search'))
const ExportImport = lazy(() => import('./pages/ExportImport'))
const Notifications = lazy(() => import('./pages/Notifications'))
const Financial = lazy(() => import('./pages/Financial'))
const Resources = lazy(() => import('./pages/Resources'))
const RoleManagement = lazy(() => import('./pages/RoleManagement'))
const Settings = lazy(() => import('./pages/Settings'))
const Profile = lazy(() => import('./pages/Profile'))

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
)

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Auth routes - restricted for authenticated users */}
              <Route path="/auth/login" element={
                <PublicRoute restricted>
                  <AuthLayout><Login /></AuthLayout>
                </PublicRoute>
              } />
              <Route path="/auth/register" element={
                <PublicRoute restricted>
                  <AuthLayout><Register /></AuthLayout>
                </PublicRoute>
              } />
              <Route path="/auth/forgot-password" element={
                <PublicRoute restricted>
                  <AuthLayout><ForgotPassword /></AuthLayout>
                </PublicRoute>
              } />
              <Route path="/auth/reset-password" element={
                <PublicRoute restricted>
                  <AuthLayout><ResetPassword /></AuthLayout>
                </PublicRoute>
              } />
              
              {/* Legacy auth route redirects */}
              <Route path="/login" element={<Navigate to="/auth/login" replace />} />
              <Route path="/register" element={<Navigate to="/auth/register" replace />} />
              <Route path="/forgot-password" element={<Navigate to="/auth/forgot-password" replace />} />
              <Route path="/reset-password" element={<Navigate to="/auth/reset-password" replace />} />

              {/* Main application routes - protected */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <MainLayout>
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/people" element={
                          <RequirePermission resource="people" action="view">
                            <People />
                          </RequirePermission>
                        } />
                        <Route path="/people/new" element={
                          <RequirePermission resource="people" action="create">
                            <PersonForm />
                          </RequirePermission>
                        } />
                        <Route path="/people/:id" element={
                          <RequirePermission resource="people" action="view">
                            <PersonDetail />
                          </RequirePermission>
                        } />
                        <Route path="/people/:id/edit" element={
                          <RequirePermission resource="people" action="update">
                            <PersonForm />
                          </RequirePermission>
                        } />
                        <Route path="/churches" element={<Churches />} />
                        <Route path="/churches/new" element={<ChurchForm />} />
                        <Route path="/churches/:id" element={<ChurchDetail />} />
                        <Route path="/churches/:id/edit" element={<ChurchForm />} />
                        <Route path="/committees" element={<Committees />} />
                        <Route path="/committees/new" element={<CommitteeForm />} />
                        <Route path="/committees/:id" element={<CommitteeDetail />} />
                        <Route path="/committees/:id/edit" element={<CommitteeForm />} />
                        <Route path="/teams" element={<Teams />} />
                        <Route path="/teams/new" element={<TeamForm />} />
                        <Route path="/teams/:id" element={<TeamDetail />} />
                        <Route path="/teams/:id/edit" element={<TeamForm />} />
                        <Route path="/groups" element={
                          <RequirePermission resource="groups" action="view">
                            <Groups />
                          </RequirePermission>
                        } />
                        <Route path="/groups/new" element={
                          <RequirePermission resource="groups" action="create">
                            <GroupForm />
                          </RequirePermission>
                        } />
                        <Route path="/groups/:id" element={
                          <RequirePermission resource="groups" action="view">
                            <GroupDetail />
                          </RequirePermission>
                        } />
                        <Route path="/groups/:id/edit" element={
                          <RequirePermission resource="groups" action="update">
                            <GroupForm />
                          </RequirePermission>
                        } />
                        <Route path="/events" element={<Events />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/evaluations" element={<Evaluations />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/export-import" element={<ExportImport />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/financial" element={
                          <RequirePermission resource="financial" action="view">
                            <Financial />
                          </RequirePermission>
                        } />
                        <Route path="/resources" element={
                          <RequirePermission resource="resources" action="view">
                            <Resources />
                          </RequirePermission>
                        } />
                        <Route path="/role-management" element={<RoleManagement />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </MainLayout>
                  </ProtectedLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App