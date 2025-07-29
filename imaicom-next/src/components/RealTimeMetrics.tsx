import React, { useState, useEffect } from 'react'
import { Thermometer, Droplets, Wind, Zap } from 'lucide-react'

interface RealTimeMetricsProps {
  baseTemp: number
  baseHumidity: number
  baseAirflow: number
  basePower: number
}

export default function RealTimeMetrics({ 
  baseTemp, 
  baseHumidity, 
  baseAirflow, 
  basePower 
}: RealTimeMetricsProps) {
  const [temperature, setTemperature] = useState(baseTemp)
  const [humidity, setHumidity] = useState(baseHumidity)
  const [airflow, setAirflow] = useState(baseAirflow)
  const [power, setPower] = useState(basePower)

  useEffect(() => {
    const interval = setInterval(() => {
      // Temperature: ±0.5 degree variation
      setTemperature(prev => {
        const change = (Math.random() - 0.5) * 1
        const newTemp = prev + change
        return Math.max(20, Math.min(28, newTemp))
      })

      // Humidity: ±2% variation
      setHumidity(prev => {
        const change = (Math.random() - 0.5) * 4
        const newHumidity = prev + change
        return Math.max(30, Math.min(70, newHumidity))
      })

      // Airflow: ±0.2 m/s variation
      setAirflow(prev => {
        const change = (Math.random() - 0.5) * 0.4
        const newAirflow = prev + change
        return Math.max(1, Math.min(5, newAirflow))
      })

      // Power: ±5kW variation
      setPower(prev => {
        const change = (Math.random() - 0.5) * 10
        const newPower = prev + change
        return Math.max(15, Math.min(60, newPower))
      })
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [])

  const getTemperatureColor = (temp: number) => {
    if (temp > 26) return 'text-red-600'
    if (temp > 24) return 'text-orange-600'
    return 'text-green-600'
  }

  const getPowerColor = (power: number) => {
    if (power > 45) return 'text-red-600'
    if (power > 35) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="bg-orange-50 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <Thermometer className="h-5 w-5 text-orange-600" />
          <span className={`text-lg font-bold transition-colors ${getTemperatureColor(temperature)}`}>
            {temperature.toFixed(1)}°C
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1">温度</p>
        <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-500 transition-all duration-1000"
            style={{ width: `${((temperature - 20) / 8) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <Droplets className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-bold">
            {humidity.toFixed(0)}%
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1">湿度</p>
        <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-1000"
            style={{ width: `${humidity}%` }}
          />
        </div>
      </div>
      
      <div className="bg-green-50 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <Wind className="h-5 w-5 text-green-600" />
          <span className="text-lg font-bold">
            {airflow.toFixed(1)}m/s
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1">エアフロー</p>
        <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-1000"
            style={{ width: `${(airflow / 5) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="bg-yellow-50 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <Zap className="h-5 w-5 text-yellow-600" />
          <span className={`text-lg font-bold transition-colors ${getPowerColor(power)}`}>
            {power.toFixed(1)}kW
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1">電力</p>
        <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-yellow-500 transition-all duration-1000"
            style={{ width: `${(power / 60) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}