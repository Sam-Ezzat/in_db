import { useTheme } from '../../contexts/ThemeContext'
import { Search, Plus, Filter, Download, User } from 'lucide-react'

const People = () => {
  const { themeConfig } = useTheme()

  // Mock data - replace with real API call
  const people = [
    { id: 1, name: 'John Smith', email: 'john@example.com', role: 'Pastor', status: 'Active', church: 'Main Church' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Team Lead', status: 'Active', church: 'Main Church' },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', role: 'Member', status: 'Active', church: 'Branch Church' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'Committee Lead', status: 'Inactive', church: 'Main Church' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: themeConfig.colors.text }}>
            People Management
          </h1>
          <p className="mt-2" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
            Manage all people in your church community
          </p>
        </div>
        <button
          className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: themeConfig.colors.primary }}
        >
          <Plus size={20} className="mr-2" />
          Add Person
        </button>
      </div>

      {/* Search and Filters */}
      <div 
        className="p-4 rounded-lg border mb-6"
        style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider 
        }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: themeConfig.colors.text, opacity: 0.5 }}
            />
            <input
              type="text"
              placeholder="Search people..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              style={{ 
                backgroundColor: themeConfig.colors.background,
                borderColor: themeConfig.colors.divider,
                color: themeConfig.colors.text
              }}
            />
          </div>
          <button
            className="flex items-center px-4 py-2 border rounded-lg hover:opacity-80 transition-opacity"
            style={{ 
              borderColor: themeConfig.colors.divider,
              color: themeConfig.colors.text 
            }}
          >
            <Filter size={20} className="mr-2" />
            Filters
          </button>
          <button
            className="flex items-center px-4 py-2 border rounded-lg hover:opacity-80 transition-opacity"
            style={{ 
              borderColor: themeConfig.colors.divider,
              color: themeConfig.colors.text 
            }}
          >
            <Download size={20} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* People Table */}
      <div 
        className="rounded-lg border overflow-hidden"
        style={{ 
          backgroundColor: themeConfig.colors.secondary,
          borderColor: themeConfig.colors.divider 
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: themeConfig.colors.background }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                    style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                    style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                    style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                    style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Church
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                    style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                    style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: themeConfig.colors.divider }}>
              {people.map((person) => (
                <tr key={person.id} className="hover:opacity-80 transition-opacity">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                        style={{ backgroundColor: themeConfig.colors.primary + '20' }}
                      >
                        <User size={20} style={{ color: themeConfig.colors.primary }} />
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                          {person.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    {person.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: themeConfig.colors.text }}>
                    {person.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
                    {person.church}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        person.status === 'Active' ? 'text-green-800' : 'text-red-800'
                      }`}
                      style={{ 
                        backgroundColor: person.status === 'Active' ? '#10B98120' : '#EF444420'
                      }}
                    >
                      {person.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      className="hover:opacity-80 transition-opacity mr-3"
                      style={{ color: themeConfig.colors.primary }}
                    >
                      View
                    </button>
                    <button 
                      className="hover:opacity-80 transition-opacity"
                      style={{ color: themeConfig.colors.accent }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm" style={{ color: themeConfig.colors.text, opacity: 0.7 }}>
          Showing 1 to 4 of 4 results
        </p>
        <div className="flex space-x-2">
          <button 
            className="px-3 py-1 rounded border disabled:opacity-50"
            style={{ 
              borderColor: themeConfig.colors.divider,
              color: themeConfig.colors.text 
            }}
            disabled
          >
            Previous
          </button>
          <button 
            className="px-3 py-1 rounded text-white"
            style={{ backgroundColor: themeConfig.colors.primary }}
          >
            1
          </button>
          <button 
            className="px-3 py-1 rounded border disabled:opacity-50"
            style={{ 
              borderColor: themeConfig.colors.divider,
              color: themeConfig.colors.text 
            }}
            disabled
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default People