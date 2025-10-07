"use client"

interface DonutChartProps {
  percentage: number
  itemsLeft?: number
  isComplete?: boolean
  size?: number
  strokeWidth?: number
}

export function DonutChart({
  percentage,
  itemsLeft = 0,
  isComplete = false,
  size = 120,
  strokeWidth = 8,
}: DonutChartProps) {
  const validPercentage = isNaN(percentage) || percentage < 0 ? 0 : percentage > 100 ? 100 : percentage
  const validSize = isNaN(size) || size <= 0 ? 120 : size
  const validStrokeWidth = isNaN(strokeWidth) || strokeWidth <= 0 ? 8 : strokeWidth

  const radius = (validSize - validStrokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (validPercentage / 100) * circumference

  const getColor = () => {
    if (isComplete) return "#3b82f6" // blue-500
    if (validPercentage >= 75) return "#3b82f6" // blue-500
    if (validPercentage >= 50) return "#f59e0b" // amber-500
    return "#ef4444" // red-500
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: validSize, height: validSize }}>
        <svg width={validSize} height={validSize} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={validSize / 2}
            cy={validSize / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={validStrokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={validSize / 2}
            cy={validSize / 2}
            r={radius}
            stroke={getColor()}
            strokeWidth={validStrokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{validPercentage}%</span>
          {itemsLeft > 0 && <span className="text-xs text-gray-500">{itemsLeft} left</span>}
        </div>
      </div>
      <div className="text-center">
        
      </div>
    </div>
  )
}
