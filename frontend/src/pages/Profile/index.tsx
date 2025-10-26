import { useTheme } from '../../contexts/ThemeContext'
import { User, Mail, Phone, MapPin, Calendar, Edit, Camera } from 'lucide-react'

const Profile = () => {
  const { themeConfig } = useTheme()

  // Mock user data - replace with real user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@church.com',
    phone: '+1 (555) 123-4567',
    address: '123 Church Street, City, State 12345',
    role: 'Administrator',
    church: 'Main Church',
    joinDate: '2020-01-15',
    lastLogin: '2024-01-20T10:30:00Z',
    avatar: 'JD'
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
            My Profile
          </h1>
          <p className="mt-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Manage your personal information and preferences
          </p>
        </div>
        <button
          className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: themeConfig.colors.primary }}
        >
          <Edit size={20} className="mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div 
          className="lg:col-span-1"
        >
          <div 
            className="p-6 rounded-lg border text-center"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto"
                style={{ backgroundColor: themeConfig.colors.primary }}
              >
                {user.avatar}
              </div>
              <button 
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                style={{ backgroundColor: themeConfig.colors.accent }}
              >
                <Camera size={16} />
              </button>
            </div>

            {/* User Info */}
            <h2 className="text-xl font-bold mb-1" style={{ color: themeConfig.colors.text }}>
              {user.name}
            </h2>
            <p className="text-sm mb-4" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              {user.role}
            </p>
            
            {/* Status */}
            <div 
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-green-800"
              style={{ backgroundColor: '#10B98120' }}
            >
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              Active
            </div>
          </div>

          {/* Quick Stats */}
          <div 
            className="mt-6 p-4 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <h3 className="font-medium mb-3" style={{ color: themeConfig.colors.text }}>
              Quick Stats
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Member Since
                </span>
                <span style={{ color: themeConfig.colors.text }}>
                  {new Date(user.joinDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Last Login
                </span>
                <span style={{ color: themeConfig.colors.text }}>
                  {new Date(user.lastLogin).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            <h3 className="text-lg font-bold mb-6" style={{ color: themeConfig.colors.text }}>
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                    Full Name
                  </label>
                  <div className="flex items-center p-3 rounded-lg border" style={{ 
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.divider 
                  }}>
                    <User size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.5 }} />
                    <span style={{ color: themeConfig.colors.text }}>{user.name}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                    Email Address
                  </label>
                  <div className="flex items-center p-3 rounded-lg border" style={{ 
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.divider 
                  }}>
                    <Mail size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.5 }} />
                    <span style={{ color: themeConfig.colors.text }}>{user.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                    Phone Number
                  </label>
                  <div className="flex items-center p-3 rounded-lg border" style={{ 
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.divider 
                  }}>
                    <Phone size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.5 }} />
                    <span style={{ color: themeConfig.colors.text }}>{user.phone}</span>
                  </div>
                </div>
              </div>

              {/* Church Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                    Role
                  </label>
                  <div className="flex items-center p-3 rounded-lg border" style={{ 
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.divider 
                  }}>
                    <User size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.5 }} />
                    <span style={{ color: themeConfig.colors.text }}>{user.role}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                    Church
                  </label>
                  <div className="flex items-center p-3 rounded-lg border" style={{ 
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.divider 
                  }}>
                    <MapPin size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.5 }} />
                    <span style={{ color: themeConfig.colors.text }}>{user.church}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                    Join Date
                  </label>
                  <div className="flex items-center p-3 rounded-lg border" style={{ 
                    backgroundColor: themeConfig.colors.background,
                    borderColor: themeConfig.colors.divider 
                  }}>
                    <Calendar size={16} className="mr-3" style={{ color: themeConfig.colors.text, opacity: 0.5 }} />
                    <span style={{ color: themeConfig.colors.text }}>
                      {new Date(user.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2" style={{ color: themeConfig.colors.text }}>
                Address
              </label>
              <div className="flex items-start p-3 rounded-lg border" style={{ 
                backgroundColor: themeConfig.colors.background,
                borderColor: themeConfig.colors.divider 
              }}>
                <MapPin size={16} className="mr-3 mt-1" style={{ color: themeConfig.colors.text, opacity: 0.5 }} />
                <span style={{ color: themeConfig.colors.text }}>{user.address}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-6">
              <button
                className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: themeConfig.colors.primary }}
              >
                <Edit size={16} className="mr-2" />
                Edit Information
              </button>
              <button
                className="flex items-center px-4 py-2 rounded-lg border font-medium hover:opacity-80 transition-opacity"
                style={{ 
                  borderColor: themeConfig.colors.divider,
                  color: themeConfig.colors.text 
                }}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile