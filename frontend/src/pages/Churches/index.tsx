import { useTheme } from '../../contexts/ThemeContext'
import { Search, Plus, MapPin, Users, Calendar, Building } from 'lucide-react'

const Churches = () => {
  const { themeConfig } = useTheme()

  // Mock data - replace with real API call
  const churches = [
    { 
      id: 1, 
      name: 'Main Church', 
      address: '123 Main Street, City, State 12345',
      pastor: 'John Smith',
      members: 450,
      established: '1995',
      status: 'Active' 
    },
    { 
      id: 2, 
      name: 'Branch Church East', 
      address: '456 East Avenue, City, State 12346',
      pastor: 'Sarah Johnson',
      members: 180,
      established: '2008',
      status: 'Active' 
    },
    { 
      id: 3, 
      name: 'Community Chapel', 
      address: '789 Community Road, City, State 12347',
      pastor: 'Michael Brown',
      members: 95,
      established: '2015',
      status: 'Active' 
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
            Churches Management
          </h1>
          <p className="mt-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Manage all church locations and congregations
          </p>
        </div>
        <button
          className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: themeConfig.colors.primary }}
        >
          <Plus size={20} className="mr-2" />
          Add Church
        </button>
      </div>

      {/* Search Bar */}
      <div 
        className="p-4 rounded-lg border mb-6"
        style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider 
        }}
      >
        <div className="relative">
          <Search 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            style={{ color: themeConfig.colors.text, opacity: 0.5 }}
          />
          <input
            type="text"
            placeholder="Search churches..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            style={{ 
              backgroundColor: themeConfig.colors.background,
              borderColor: themeConfig.colors.divider,
              color: themeConfig.colors.text
            }}
          />
        </div>
      </div>

      {/* Churches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {churches.map((church) => (
          <div 
            key={church.id}
            className="p-6 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer"
            style={{ 
              backgroundColor: themeConfig.colors.secondary,
              borderColor: themeConfig.colors.divider 
            }}
          >
            {/* Church Header */}
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: themeConfig.colors.primary + '20' }}
              >
                <Building size={24} style={{ color: themeConfig.colors.primary }} />
              </div>
              <span 
                className="px-2 py-1 text-xs font-medium rounded-full text-green-800"
                style={{ backgroundColor: '#10B98120' }}
              >
                {church.status}
              </span>
            </div>

            {/* Church Info */}
            <h3 className="text-xl font-bold mb-2" style={{ color: themeConfig.colors.text }}>
              {church.name}
            </h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" style={{ color: themeConfig.colors.text, opacity: 0.6 }} />
                <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  {church.address}
                </p>
              </div>
              
              <div className="flex items-center">
                <Users size={16} className="mr-2" style={{ color: themeConfig.colors.text, opacity: 0.6 }} />
                <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                  Pastor: {church.pastor}
                </span>
              </div>
              
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" style={{ color: themeConfig.colors.text, opacity: 0.6 }} />
                <span className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Established: {church.established}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div 
              className="p-3 rounded-lg border-t"
              style={{ 
                backgroundColor: themeConfig.colors.background,
                borderColor: themeConfig.colors.divider 
              }}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                  Total Members
                </span>
                <span 
                  className="text-lg font-bold"
                  style={{ color: themeConfig.colors.primary }}
                >
                  {church.members}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 mt-4">
              <button 
                className="flex-1 py-2 px-3 rounded-lg border hover:opacity-80 transition-opacity text-sm font-medium"
                style={{ 
                  borderColor: themeConfig.colors.divider,
                  color: themeConfig.colors.text 
                }}
              >
                View Details
              </button>
              <button 
                className="flex-1 py-2 px-3 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: themeConfig.colors.primary }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Church Card */}
      <div 
        className="mt-6 p-8 rounded-lg border-2 border-dashed hover:border-solid transition-all cursor-pointer"
        style={{ borderColor: themeConfig.colors.divider }}
      >
        <div className="text-center">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: themeConfig.colors.primary + '20' }}
          >
            <Plus size={32} style={{ color: themeConfig.colors.primary }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: themeConfig.colors.text }}>
            Add New Church
          </h3>
          <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Click to create a new church location
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          className="p-4 rounded-lg border"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: themeConfig.colors.primary }}>
              {churches.length}
            </div>
            <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              Total Churches
            </div>
          </div>
        </div>
        
        <div 
          className="p-4 rounded-lg border"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: themeConfig.colors.accent }}>
              {churches.reduce((sum, church) => sum + church.members, 0)}
            </div>
            <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              Total Members
            </div>
          </div>
        </div>
        
        <div 
          className="p-4 rounded-lg border"
          style={{ 
            backgroundColor: themeConfig.colors.secondary,
            borderColor: themeConfig.colors.divider 
          }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: themeConfig.colors.primary }}>
              {Math.round(churches.reduce((sum, church) => sum + church.members, 0) / churches.length)}
            </div>
            <div className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
              Avg per Church
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Churches