import React, { useState, useEffect } from 'react'
import { Camera, AlertCircle, Wifi, WifiOff } from 'lucide-react'

interface CameraViewProps {
  facilityName: string
  cameraCount?: number
}

export default function CameraView({ facilityName, cameraCount = 4 }: CameraViewProps) {
  const [selectedCamera, setSelectedCamera] = useState(1)
  const [isConnected, setIsConnected] = useState(true)
  const [timestamp, setTimestamp] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date())
      // Simulate occasional connection issues
      if (Math.random() > 0.98) {
        setIsConnected(false)
        setTimeout(() => setIsConnected(true), 2000)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const cameras = Array.from({ length: cameraCount }, (_, i) => ({
    id: i + 1,
    name: `カメラ ${i + 1}`,
    location: ['入口', 'サーバールーム', '電源室', '通路'][i] || `エリア ${i + 1}`,
    status: i === 2 && !isConnected ? 'offline' : 'online'
  }))

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold flex items-center">
          <Camera className="h-5 w-5 mr-2" />
          監視カメラ
        </h3>
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-400">
            {timestamp.toLocaleString('ja-JP')}
          </span>
          {isConnected ? (
            <Wifi className="h-4 w-4 text-green-400" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-400" />
          )}
        </div>
      </div>

      {/* Main Camera View */}
      <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ paddingTop: '56.25%' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          {cameras[selectedCamera - 1].status === 'online' ? (
            <div className="relative w-full h-full">
              {/* Simulated camera feed */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="absolute top-4 left-4 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                  {cameras[selectedCamera - 1].location}
                </div>
                <div className="absolute bottom-4 left-4 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                  REC ● {timestamp.toLocaleTimeString('ja-JP')}
                </div>
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-3 grid-rows-3 h-full">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="border border-white"></div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Simulated movement */}
              <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-green-500 opacity-20 rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-blue-500 opacity-20 rounded-full animate-ping"></div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <AlertCircle className="h-12 w-12 mb-2" />
              <p className="text-sm">接続が切断されました</p>
            </div>
          )}
        </div>
      </div>

      {/* Camera Selector */}
      <div className="grid grid-cols-4 gap-2">
        {cameras.map((camera) => (
          <button
            key={camera.id}
            onClick={() => setSelectedCamera(camera.id)}
            className={`relative rounded overflow-hidden transition-all ${
              selectedCamera === camera.id ? 'ring-2 ring-blue-500' : ''
            }`}
            style={{ paddingTop: '56.25%' }}
          >
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              {camera.status === 'online' ? (
                <div className="text-center">
                  <Camera className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-400">{camera.location}</p>
                </div>
              ) : (
                <AlertCircle className="h-6 w-6 text-red-400" />
              )}
            </div>
            {selectedCamera === camera.id && (
              <div className="absolute bottom-0 left-0 right-0 bg-blue-500 h-1"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}