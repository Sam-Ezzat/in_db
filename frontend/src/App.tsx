import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { Suspense, lazy } from 'react'
import MainLayout from './components/Layout/MainLayout'
import AuthLayout from './components/Layout/AuthLayout'
import { 
  Login, Register, ForgotPassword, 
  ResetPassword
} from './components/PlaceholderComponents'

// Lazy load main pages
const Dashboard = lazy(() => import('./pages/Dashboard'))
const People = lazy(() => import('./pages/People'))
const Churches = lazy(() => import('./pages/Churches'))
const Committees = lazy(() => import('./pages/Committees'))
const Teams = lazy(() => import('./pages/Teams'))
const Groups = lazy(() => import('./pages/Groups'))
const Events = lazy(() => import('./pages/Events'))
const Reports = lazy(() => import('./pages/Reports'))
const Evaluations = lazy(() => import('./pages/Evaluations'))
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
      <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
            <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
            <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
            <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />

            {/* Main application routes */}
            <Route path="/*" element={
              <MainLayout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/people" element={<People />} />
                  <Route path="/churches" element={<Churches />} />
                  <Route path="/committees" element={<Committees />} />
                  <Route path="/teams" element={<Teams />} />
                  <Route path="/groups" element={<Groups />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/evaluations" element={<Evaluations />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </MainLayout>
            } />
          </Routes>
        </Suspense>
      </div>
    </ThemeProvider>
  )
}

export default App