import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (simplified for PoC)
export interface Facility {
  id: number
  name: string
  region: string
  prefecture: string
  city: string
  address: string
  lat: number
  lng: number
  status: 'normal' | 'warning' | 'critical' | 'maintenance'
  manager_id?: string
  created_at?: string
  updated_at?: string
}

export interface Equipment {
  id: string
  facility_id: number
  rack_id: string
  category: string
  name: string
  manufacturer: string
  model: string
  purchase_date: string
  useful_life: number
  status: 'normal' | 'warning' | 'critical'
  created_at?: string
  updated_at?: string
}

export interface MaintenanceLog {
  id: string
  equipment_id: string
  facility_id: number
  date: string
  type: string
  inspector: string
  result: string
  notes?: string
  created_at?: string
}

export interface Manager {
  id: string
  name: string
  title: string
  email: string
  phone: string
  facility_ids: number[]
  created_at?: string
}