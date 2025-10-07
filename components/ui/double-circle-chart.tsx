"use client"
import { cn } from "@/lib/utils"

interface DoubleCircleChartProps {
  heightPercentile: number
  weightPercentile: number
  size?: number
  className?: string
}

export function DoubleCircleChart({
  heightPercentile,
  weightPercentile,
  size = 120,
  className,
}: DoubleCircleChartProps) {
  const radius = size / 2
  const strokeWidth = 8
  const innerRadius = radius - strokeWidth - 4
  const outerRadius = radius - strokeWidth / 2

  // Calculate circumferences
  const outerCircumference = 2 * Math.PI * (outerRadius - strokeWidth / 2)
  const innerCircumference = 2 * Math.PI * (innerRadius - strokeWidth / 2)

  // Calculate stroke dash arrays for progress
  const heightProgress = (heightPercentile / 100) * outerCircumference
  const weightProgress = (weightPercentile / 100) * innerCircumference

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circles */}
        <circle
          cx={radius}
          cy={radius}
          r={outerRadius - strokeWidth / 2}
          fill="none"
          stroke="rgb(219 234 254)" // blue-100
          strokeWidth={strokeWidth}
        />
        <circle
          cx={radius}
          cy={radius}
          r={innerRadius - strokeWidth / 2}
          fill="none"
          stroke="rgb(220 252 231)" // green-100
          strokeWidth={strokeWidth}
        />

        {/* Progress circles */}
        <circle
          cx={radius}
          cy={radius}
          r={outerRadius - strokeWidth / 2}
          fill="none"
          stroke="rgb(59 130 246)" // blue-500
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${heightProgress} ${outerCircumference}`}
          className="transition-all duration-1000 ease-out"
          style={{
            animation: "drawCircle 2s ease-out forwards",
          }}
        />
        <circle
          cx={radius}
          cy={radius}
          r={innerRadius - strokeWidth / 2}
          fill="none"
          stroke="rgb(34 197 94)" // green-500
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${weightProgress} ${innerCircumference}`}
          className="transition-all duration-1000 ease-out"
          style={{
            animation: "drawCircle 2s ease-out forwards",
            animationDelay: "0.5s",
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-xs text-gray-600 font-medium">Growth</div>
        <div className="text-xs text-gray-500">Percentiles</div>
      </div>

      {/* Legend */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-gray-600">Height {heightPercentile}th</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-gray-600">Weight {weightPercentile}th</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes drawCircle {
          from {
            stroke-dasharray: 0 1000;
          }
        }
      `}</style>
    </div>
  )
}
