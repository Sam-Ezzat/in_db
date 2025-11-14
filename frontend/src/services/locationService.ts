import { BaseService } from './base/BaseService'

// ================================
// INTERFACES
// ================================

export interface Location {
  id: string
  tenantId?: string
  name: string
  type: 'country' | 'governorate' | 'sector'
  parentId?: string
  parent?: Location
  children?: Location[]
  createdAt: Date
  updatedAt: Date
}

export interface LocationFilters {
  type?: 'country' | 'governorate' | 'sector'
  parentId?: string
  tenantId?: string
  searchTerm?: string
}

export interface LocationStatistics {
  totalCountries: number
  totalGovernorates: number
  totalSectors: number
  churchesByLocation: {
    locationId: string
    locationName: string
    churchCount: number
  }[]
}

// ================================
// SERVICE CLASS
// ================================

export class LocationService extends BaseService {
  private locations: Location[] = []

  constructor() {
    super()
    this.initializeMockData()
  }

  // ================================
  // CRUD OPERATIONS
  // ================================

  async getLocations(filters?: LocationFilters): Promise<Location[]> {
    let filtered = [...this.locations]

    if (filters) {
      if (filters.type) {
        filtered = filtered.filter(loc => loc.type === filters.type)
      }

      if (filters.parentId !== undefined) {
        filtered = filtered.filter(loc => loc.parentId === filters.parentId)
      }

      if (filters.tenantId) {
        filtered = filtered.filter(loc => loc.tenantId === filters.tenantId)
      }

      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase()
        filtered = filtered.filter(loc =>
          loc.name.toLowerCase().includes(term)
        )
      }
    }

    // Add parent and children references
    return filtered.map(loc => ({
      ...loc,
      parent: loc.parentId ? this.locations.find(p => p.id === loc.parentId) : undefined,
      children: this.locations.filter(c => c.parentId === loc.id)
    })).sort((a, b) => a.name.localeCompare(b.name))
  }

  async getLocationById(id: string): Promise<Location | null> {
    const location = this.locations.find(loc => loc.id === id)
    if (!location) return null

    return {
      ...location,
      parent: location.parentId ? this.locations.find(p => p.id === location.parentId) : undefined,
      children: this.locations.filter(c => c.parentId === location.id)
    }
  }

  async createLocation(data: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): Promise<Location> {
    // Validate hierarchy
    if (data.parentId) {
      const parent = await this.getLocationById(data.parentId)
      if (!parent) {
        throw new Error('Parent location not found')
      }

      // Validate type hierarchy
      if (data.type === 'country' && parent.type !== 'country') {
        throw new Error('Country cannot have a parent')
      }
      if (data.type === 'governorate' && parent.type !== 'country') {
        throw new Error('Governorate must be under a Country')
      }
      if (data.type === 'sector' && parent.type !== 'governorate') {
        throw new Error('Sector must be under a Governorate')
      }
    }

    const newLocation: Location = {
      ...data,
      id: `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.locations.push(newLocation)
    return newLocation
  }

  async updateLocation(id: string, updates: Partial<Location>): Promise<Location | null> {
    const index = this.locations.findIndex(loc => loc.id === id)
    if (index === -1) return null

    // Validate hierarchy if parentId is being changed
    if (updates.parentId !== undefined && updates.parentId !== this.locations[index].parentId) {
      const parent = updates.parentId ? await this.getLocationById(updates.parentId) : null
      const currentType = updates.type || this.locations[index].type

      if (parent) {
        // Prevent circular references
        if (await this.isDescendant(id, updates.parentId)) {
          throw new Error('Cannot set a descendant as parent (circular reference)')
        }

        // Validate type hierarchy
        if (currentType === 'governorate' && parent.type !== 'country') {
          throw new Error('Governorate must be under a Country')
        }
        if (currentType === 'sector' && parent.type !== 'governorate') {
          throw new Error('Sector must be under a Governorate')
        }
      }
    }

    this.locations[index] = {
      ...this.locations[index],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date()
    }

    return this.getLocationById(id)
  }

  async deleteLocation(id: string): Promise<boolean> {
    const location = await this.getLocationById(id)
    if (!location) return false

    // Check if location has children
    if (location.children && location.children.length > 0) {
      throw new Error('Cannot delete location with children. Delete or reassign children first.')
    }

    // Check if location has churches
    const churchCount = await this.getChurchCount(id)
    if (churchCount > 0) {
      throw new Error(`Cannot delete location with ${churchCount} associated churches.`)
    }

    const index = this.locations.findIndex(loc => loc.id === id)
    if (index === -1) return false

    this.locations.splice(index, 1)
    return true
  }

  // ================================
  // HIERARCHY OPERATIONS
  // ================================

  async getLocationHierarchy(locationId?: string): Promise<Location[]> {
    if (!locationId) {
      // Return all root locations (countries)
      return this.getLocations({ type: 'country' })
    }

    const location = await this.getLocationById(locationId)
    if (!location) return []

    // Return location with full hierarchy
    return this.buildHierarchy(location)
  }

  async getLocationPath(locationId: string): Promise<Location[]> {
    const path: Location[] = []
    let current = await this.getLocationById(locationId)

    while (current) {
      path.unshift(current)
      current = current.parentId ? await this.getLocationById(current.parentId) : null
    }

    return path
  }

  async getLocationChildren(locationId: string, type?: Location['type']): Promise<Location[]> {
    const children = await this.getLocations({ parentId: locationId })
    
    if (type) {
      return children.filter(child => child.type === type)
    }

    return children
  }

  private async isDescendant(ancestorId: string, descendantId: string): Promise<boolean> {
    let current = await this.getLocationById(descendantId)
    
    while (current) {
      if (current.id === ancestorId) return true
      current = current.parentId ? await this.getLocationById(current.parentId) : null
    }

    return false
  }

  private buildHierarchy(location: Location): Location[] {
    const hierarchy: Location[] = [location]
    
    if (location.children) {
      location.children.forEach(child => {
        hierarchy.push(...this.buildHierarchy(child))
      })
    }

    return hierarchy
  }

  // ================================
  // STATISTICS
  // ================================

  async getLocationStatistics(): Promise<LocationStatistics> {
    const countries = await this.getLocations({ type: 'country' })
    const governorates = await this.getLocations({ type: 'governorate' })
    const sectors = await this.getLocations({ type: 'sector' })

    // Mock church counts
    const churchesByLocation = this.locations.map(loc => ({
      locationId: loc.id,
      locationName: loc.name,
      churchCount: Math.floor(Math.random() * 10)
    }))

    return {
      totalCountries: countries.length,
      totalGovernorates: governorates.length,
      totalSectors: sectors.length,
      churchesByLocation
    }
  }

  private async getChurchCount(locationId: string): Promise<number> {
    // Mock implementation - replace with actual church service call
    return Math.floor(Math.random() * 5)
  }

  // ================================
  // UTILITY METHODS
  // ================================

  async getCountries(): Promise<Location[]> {
    return this.getLocations({ type: 'country' })
  }

  async getGovernorates(countryId?: string): Promise<Location[]> {
    return this.getLocations({ type: 'governorate', parentId: countryId })
  }

  async getSectors(governorateId?: string): Promise<Location[]> {
    return this.getLocations({ type: 'sector', parentId: governorateId })
  }

  // ================================
  // MOCK DATA INITIALIZATION
  // ================================

  private initializeMockData() {
    // Sample data
    this.locations = [
      // Countries
      {
        id: 'loc_country_1',
        name: 'Egypt',
        type: 'country',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'loc_country_2',
        name: 'United States',
        type: 'country',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },

      // Governorates in Egypt
      {
        id: 'loc_gov_1',
        name: 'Cairo',
        type: 'governorate',
        parentId: 'loc_country_1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'loc_gov_2',
        name: 'Alexandria',
        type: 'governorate',
        parentId: 'loc_country_1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'loc_gov_3',
        name: 'Giza',
        type: 'governorate',
        parentId: 'loc_country_1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },

      // States in USA
      {
        id: 'loc_gov_4',
        name: 'California',
        type: 'governorate',
        parentId: 'loc_country_2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'loc_gov_5',
        name: 'Texas',
        type: 'governorate',
        parentId: 'loc_country_2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },

      // Sectors in Cairo
      {
        id: 'loc_sector_1',
        name: 'Nasr City',
        type: 'sector',
        parentId: 'loc_gov_1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'loc_sector_2',
        name: 'Heliopolis',
        type: 'sector',
        parentId: 'loc_gov_1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'loc_sector_3',
        name: 'Maadi',
        type: 'sector',
        parentId: 'loc_gov_1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },

      // Sectors in Alexandria
      {
        id: 'loc_sector_4',
        name: 'Smouha',
        type: 'sector',
        parentId: 'loc_gov_2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'loc_sector_5',
        name: 'Stanley',
        type: 'sector',
        parentId: 'loc_gov_2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },

      // Sectors in California
      {
        id: 'loc_sector_6',
        name: 'Los Angeles',
        type: 'sector',
        parentId: 'loc_gov_4',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'loc_sector_7',
        name: 'San Francisco',
        type: 'sector',
        parentId: 'loc_gov_4',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ]
  }
}

// Export singleton instance
export const locationService = new LocationService()
