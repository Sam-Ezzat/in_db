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
const Locations = lazy(() => import('./pages/Locations'))
const LocationDetail = lazy(() => import('./pages/Locations/LocationDetail'))
const LocationForm = lazy(() => import('./pages/Locations/LocationForm'))
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
const EventDetail = lazy(() => import('./pages/Events/EventDetail'))
const EventForm = lazy(() => import('./pages/Events/EventForm'))
const PublicRegistrationForm = lazy(() => import('./pages/EventRegistration/PublicRegistrationForm'))
const Attendance = lazy(() => import('./pages/Attendance'))
const AttendanceDetail = lazy(() => import('./pages/Attendance/AttendanceDetail'))
const AttendanceForm = lazy(() => import('./pages/Attendance/AttendanceForm'))
const BulkAttendanceForm = lazy(() => import('./pages/Attendance/BulkAttendanceForm'))
const Messaging = lazy(() => import('./pages/Communications/Messaging'))
const NotificationSystem = lazy(() => import('./pages/Communications/NotificationSystem'))
const CampaignManagement = lazy(() => import('./pages/Communications/CampaignManagement'))
const WhatsAppMessenger = lazy(() => import('./pages/Communications/WhatsAppMessenger'))
const EmailComposer = lazy(() => import('./pages/Communications/EmailComposer'))
const Communications = lazy(() => import('./pages/Communications'))
const Reports = lazy(() => import('./pages/Reports'))
const ReportDetail = lazy(() => import('./pages/Reports/ReportDetail'))
const ReportForm = lazy(() => import('./pages/Reports/ReportForm'))
const ReportsDashboard = lazy(() => import('./pages/Reports/ReportsDashboard'))
const KPIs = lazy(() => import('./pages/KPIs'))
const KPIDetail = lazy(() => import('./pages/KPIs/KPIDetail'))
const KPIForm = lazy(() => import('./pages/KPIs/KPIForm'))
const KPIEvaluations = lazy(() => import('./pages/KPIs/KPIEvaluations'))
const EvaluationDetail = lazy(() => import('./pages/KPIs/EvaluationDetail'))
const EvaluationForm = lazy(() => import('./pages/KPIs/EvaluationForm'))
const Evaluations = lazy(() => import('./pages/Evaluations'))
const SurveyEvaluationDetail = lazy(() => import('./pages/Evaluations/EvaluationDetail'))
const SurveyEvaluationForm = lazy(() => import('./pages/Evaluations/EvaluationForm'))
const Search = lazy(() => import('./pages/Search'))
const ExportImport = lazy(() => import('./pages/ExportImport'))
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
              {/* Public event registration - no auth required */}
              <Route path="/register-event/:eventId" element={<PublicRegistrationForm />} />
              
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
                        <Route path="/locations" element={
                          <RequirePermission resource="locations" action="view">
                            <Locations />
                          </RequirePermission>
                        } />
                        <Route path="/locations/new" element={
                          <RequirePermission resource="locations" action="create">
                            <LocationForm />
                          </RequirePermission>
                        } />
                        <Route path="/locations/:id" element={
                          <RequirePermission resource="locations" action="view">
                            <LocationDetail />
                          </RequirePermission>
                        } />
                        <Route path="/locations/:id/edit" element={
                          <RequirePermission resource="locations" action="update">
                            <LocationForm />
                          </RequirePermission>
                        } />
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
                        <Route path="/events" element={
                          <RequirePermission resource="events" action="view">
                            <Events />
                          </RequirePermission>
                        } />
                        <Route path="/events/new" element={
                          <RequirePermission resource="events" action="create">
                            <EventForm />
                          </RequirePermission>
                        } />
                        <Route path="/events/:id" element={
                          <RequirePermission resource="events" action="view">
                            <EventDetail />
                          </RequirePermission>
                        } />
                        <Route path="/events/:id/edit" element={
                          <RequirePermission resource="events" action="update">
                            <EventForm />
                          </RequirePermission>
                        } />
                        
                        {/* Attendance Routes */}
                        <Route path="/attendance" element={
                          <RequirePermission resource="attendance" action="view">
                            <Attendance />
                          </RequirePermission>
                        } />
                        <Route path="/attendance/new" element={
                          <RequirePermission resource="attendance" action="create">
                            <AttendanceForm />
                          </RequirePermission>
                        } />
                        <Route path="/attendance/bulk" element={
                          <RequirePermission resource="attendance" action="create">
                            <BulkAttendanceForm />
                          </RequirePermission>
                        } />
                        <Route path="/attendance/:id" element={
                          <RequirePermission resource="attendance" action="view">
                            <AttendanceDetail />
                          </RequirePermission>
                        } />
                        <Route path="/attendance/:id/edit" element={
                          <RequirePermission resource="attendance" action="update">
                            <AttendanceForm />
                          </RequirePermission>
                        } />
                        
                        {/* Communication Routes */}
                        <Route path="/communications" element={<Communications />} />
                        <Route path="/communications/messages" element={<Messaging />} />
                        <Route path="/communications/messages/:id" element={<Messaging />} />
                        <Route path="/communications/notifications" element={<NotificationSystem />} />
                        <Route path="/communications/campaigns" element={<CampaignManagement />} />
                        <Route path="/communications/campaigns/:id" element={<CampaignManagement />} />
                        <Route path="/communications/campaigns/:id/edit" element={<CampaignManagement />} />
                        <Route path="/communications/whatsapp" element={<WhatsAppMessenger />} />
                        <Route path="/communications/email" element={<EmailComposer />} />
                        
                        {/* Reports Routes */}
                        <Route path="/reports" element={
                          <RequirePermission resource="reports" action="view">
                            <Reports />
                          </RequirePermission>
                        } />
                        <Route path="/reports/dashboard" element={
                          <RequirePermission resource="reports" action="view">
                            <ReportsDashboard />
                          </RequirePermission>
                        } />
                        <Route path="/reports/new" element={
                          <RequirePermission resource="reports" action="create">
                            <ReportForm />
                          </RequirePermission>
                        } />
                        <Route path="/reports/:id" element={
                          <RequirePermission resource="reports" action="view">
                            <ReportDetail />
                          </RequirePermission>
                        } />
                        <Route path="/reports/:id/edit" element={
                          <RequirePermission resource="reports" action="update">
                            <ReportForm />
                          </RequirePermission>
                        } />
                        
                        {/* KPI Routes */}
                        <Route path="/kpis" element={
                          <RequirePermission resource="kpis" action="view">
                            <KPIs />
                          </RequirePermission>
                        } />
                        <Route path="/kpis/new" element={
                          <RequirePermission resource="kpis" action="create">
                            <KPIForm />
                          </RequirePermission>
                        } />
                        <Route path="/kpis/:id" element={
                          <RequirePermission resource="kpis" action="view">
                            <KPIDetail />
                          </RequirePermission>
                        } />
                        <Route path="/kpis/:id/edit" element={
                          <RequirePermission resource="kpis" action="update">
                            <KPIForm />
                          </RequirePermission>
                        } />

                        {/* KPI Evaluations Routes */}
                        <Route path="/kpi-evaluations" element={
                          <RequirePermission resource="evaluations" action="view">
                            <KPIEvaluations />
                          </RequirePermission>
                        } />
                        <Route path="/kpi-evaluations/new" element={
                          <RequirePermission resource="evaluations" action="create">
                            <EvaluationForm />
                          </RequirePermission>
                        } />
                        <Route path="/kpi-evaluations/:id" element={
                          <RequirePermission resource="evaluations" action="view">
                            <EvaluationDetail />
                          </RequirePermission>
                        } />
                        <Route path="/kpi-evaluations/:id/edit" element={
                          <RequirePermission resource="evaluations" action="update">
                            <EvaluationForm />
                          </RequirePermission>
                        } />
                        
                        {/* Survey Evaluation Routes */}
                        <Route path="/evaluations" element={<Evaluations />} />
                        <Route path="/evaluations/new" element={
                          <RequirePermission resource="evaluations" action="create">
                            <SurveyEvaluationForm />
                          </RequirePermission>
                        } />
                        <Route path="/evaluations/:id/edit" element={
                          <RequirePermission resource="evaluations" action="update">
                            <SurveyEvaluationForm />
                          </RequirePermission>
                        } />
                        <Route path="/evaluations/:id" element={
                          <RequirePermission resource="evaluations" action="view">
                            <SurveyEvaluationDetail />
                          </RequirePermission>
                        } />
                        
                        <Route path="/search" element={<Search />} />
                        <Route path="/export-import" element={<ExportImport />} />
                        <Route path="/notifications" element={<Navigate to="/communications" replace />} />
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