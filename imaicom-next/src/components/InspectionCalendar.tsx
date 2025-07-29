'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { Inspection, statusConfig } from '@/data/inspections'

interface InspectionCalendarProps {
  inspections: Inspection[]
  onSelectInspection: (inspection: Inspection) => void
}

export default function InspectionCalendar({ inspections, onSelectInspection }: InspectionCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month')
  
  // カレンダー用の日付配列を生成
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const current = new Date(startDate)
    
    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }
  
  // 週表示用の日付配列を生成
  const generateWeekDays = () => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return date
    })
  }
  
  const days = viewMode === 'month' ? generateCalendarDays() : generateWeekDays()
  
  // 日付ごとの点検を整理
  const inspectionsByDate = inspections.reduce((acc, inspection) => {
    const dateKey = inspection.scheduledDate
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(inspection)
    return acc
  }, {} as { [key: string]: Inspection[] })
  
  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setDate(newDate.getDate() - 7)
    }
    setCurrentDate(newDate)
  }
  
  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }
  
  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0]
  }
  
  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }
  
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            点検予定カレンダー
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={navigatePrevious}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <span className="font-medium text-gray-900 min-w-[150px] text-center">
              {viewMode === 'month' 
                ? currentDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })
                : `${currentDate.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}の週`
              }
            </span>
            <button
              onClick={navigateNext}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            月表示
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            週表示
          </button>
        </div>
      </div>
      
      {/* カレンダー */}
      <div className="border rounded-lg overflow-hidden">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 bg-gray-50">
          {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-700 border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        {/* カレンダー本体 */}
        <div className={`grid grid-cols-7 ${viewMode === 'month' ? 'auto-rows-[120px]' : 'auto-rows-[200px]'}`}>
          {days.map((date, index) => {
            const dateKey = formatDateKey(date)
            const dayInspections = inspectionsByDate[dateKey] || []
            const isCurrentMonthDay = isCurrentMonth(date)
            
            return (
              <div
                key={index}
                className={`border-r border-b last:border-r-0 p-2 ${
                  !isCurrentMonthDay && viewMode === 'month' ? 'bg-gray-50' : ''
                } ${isToday(date) ? 'bg-blue-50' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm font-medium ${
                    !isCurrentMonthDay && viewMode === 'month' ? 'text-gray-400' : 'text-gray-900'
                  } ${isToday(date) ? 'text-blue-600' : ''}`}>
                    {date.getDate()}
                  </span>
                  {dayInspections.length > 0 && (
                    <span className="text-xs text-gray-500">{dayInspections.length}件</span>
                  )}
                </div>
                
                <div className="space-y-1 overflow-y-auto max-h-[80px]">
                  {dayInspections.slice(0, viewMode === 'month' ? 3 : 5).map((inspection) => {
                    const status = statusConfig[inspection.status]
                    return (
                      <button
                        key={inspection.id}
                        onClick={() => onSelectInspection(inspection)}
                        className={`w-full text-left px-2 py-1 rounded text-xs ${status.bg} ${status.color} hover:opacity-80 transition-opacity`}
                      >
                        <div className="flex items-center">
                          <span className="mr-1">{status.icon}</span>
                          <span className="truncate">{inspection.equipmentId}</span>
                        </div>
                      </button>
                    )
                  })}
                  {dayInspections.length > (viewMode === 'month' ? 3 : 5) && (
                    <div className="text-xs text-gray-500 text-center">
                      他{dayInspections.length - (viewMode === 'month' ? 3 : 5)}件
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* 凡例 */}
      <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
        {Object.entries(statusConfig).map(([key, config]) => (
          <div key={key} className="flex items-center">
            <span className="mr-2">{config.icon}</span>
            <span className="text-gray-600">{config.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}