import React from 'react'
import { Facility } from '@/lib/supabase'
import { MapPin, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FacilityListProps {
  facilities: Facility[]
}

export default function FacilityList({ facilities }: FacilityListProps) {
  const router = useRouter()

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">施設一覧</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {facilities.map((facility) => (
          <div
            key={facility.id}
            onClick={() => router.push(`/facility/${facility.id}`)}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {facility.name}
                </h3>
                
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <MapPin className="h-3 w-3 mr-1" />
                  {facility.address}
                </div>
                
                <div className="flex items-center mt-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">正常稼働中</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}