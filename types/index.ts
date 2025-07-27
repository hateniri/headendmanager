export interface Facility {
  id: string
  name: string
  address: string
  coordinates: [number, number] // [longitude, latitude]
  floors: number
  managerName: string
  prefecture: string
}

export interface Rack {
  id: string
  facilityId: string
  rackNumber: string
  floor: number
  equipment: Equipment[]
}

export interface Equipment {
  id: string
  name: string
  status: 'normal' | 'warning' | 'error'
  temperature: number
  installDate: string
  lifespan: number // years
  model: string
  manufacturer: string
}

export interface Inspection {
  id: string
  facilityId: string
  date: string
  inspector: string
  content: string
  result: 'passed' | 'failed' | 'pending'
  notes?: string
}

export interface RepairRequest {
  id?: string
  facilityId: string
  requesterName: string
  content: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  requestDate?: string
  status?: 'open' | 'in_progress' | 'completed'
}

export interface Organization {
  id: string
  name: string
  position: string
  email?: string
  phone?: string
  children?: Organization[]
}