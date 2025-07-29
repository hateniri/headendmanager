import React, { useState, useEffect } from 'react'

const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [isUrgent, setIsUrgent] = useState(false)
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime) - new Date()
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
        setTimeLeft({ hours, minutes, seconds })
        setIsUrgent(hours < 6) // Last 6 hours marked as urgent
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      }
    }
    
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    
    return () => clearInterval(timer)
  }, [endTime])
  
  const formatNumber = (num) => String(num).padStart(2, '0')
  
  return (
    <div className={`bg-black/80 backdrop-blur-sm px-3 py-2 rounded-full border ${
      isUrgent ? 'border-red-500/50 animate-pulse' : 'border-white/20'
    }`}>
      <div className="flex items-center gap-1 text-sm font-mono">
        <span className={isUrgent ? 'text-red-400' : 'text-white'}>
          {formatNumber(timeLeft.hours)}
        </span>
        <span className={isUrgent ? 'text-red-400' : 'text-gray-400'}>:</span>
        <span className={isUrgent ? 'text-red-400' : 'text-white'}>
          {formatNumber(timeLeft.minutes)}
        </span>
        <span className={isUrgent ? 'text-red-400' : 'text-gray-400'}>:</span>
        <span className={isUrgent ? 'text-red-400' : 'text-white'}>
          {formatNumber(timeLeft.seconds)}
        </span>
      </div>
    </div>
  )
}

export default CountdownTimer