// Placeholder pages - will be developed in next iterations

export const Churches = () => <div>Churches Page</div>
export const Committees = () => <div>Committees Page</div>
export const Teams = () => <div>Teams Page</div>
export const DiscipleshipGroups = () => <div>Discipleship Groups Page</div>
export const Events = () => <div>Events Page</div>
export const Reports = () => <div>Reports Page</div>
export const Evaluations = () => <div>Evaluations Page</div>
export const Settings = () => <div>Settings Page</div>
export const Profile = () => <div>Profile Page</div>

// Auth pages
export const Login = () => <div>Login Page</div>
export const Register = () => <div>Register Page</div>
export const ForgotPassword = () => <div>Forgot Password Page</div>
export const ResetPassword = () => <div>Reset Password Page</div>

// Layouts
export const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="flex">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-bold">Church Management</h2>
        </div>
        <nav className="mt-4">
          <a href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Dashboard</a>
          <a href="/people" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">People</a>
          <a href="/churches" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Churches</a>
          <a href="/committees" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Committees</a>
          <a href="/teams" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Teams</a>
          <a href="/groups" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Groups</a>
          <a href="/events" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Events</a>
          <a href="/reports" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Reports</a>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  </div>
)

export const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full">{children}</div>
  </div>
)