"use client"

import { useEffect, useRef } from "react"

interface WeeklyChartProps {
  data: any[]
  dataKey: string
  label: string
  isPercentage?: boolean
  isRatio?: boolean
}

export default function WeeklyChart({ data, dataKey, label, isPercentage = false, isRatio = false }: WeeklyChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Find max value for scaling
    let maxValue = 0
    data.forEach((item) => {
      const value = item[dataKey]
      if (value > maxValue) maxValue = value
    })

    // Add 10% padding to max value
    maxValue = maxValue * 1.1

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.strokeStyle = "#ccc"
    ctx.stroke()

    // Draw bars
    const barWidth = (chartWidth / data.length) * 0.8
    const barSpacing = (chartWidth / data.length) * 0.2

    data.forEach((item, index) => {
      const value = item[dataKey]
      const barHeight = (value / maxValue) * chartHeight
      const x = padding + index * (barWidth + barSpacing)
      const y = height - padding - barHeight

      // Draw bar
      ctx.fillStyle = "#7c3aed"
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw value
      ctx.fillStyle = "#000"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      let displayValue = value
      if (isPercentage) {
        displayValue = (value * 100).toFixed(1) + "%"
      } else if (isRatio) {
        displayValue = value.toFixed(2)
      } else {
        displayValue = Math.round(value)
      }
      ctx.fillText(displayValue.toString(), x + barWidth / 2, y - 5)

      // Draw week label
      ctx.fillText(item.weekLabel, x + barWidth / 2, height - padding + 15)
    })

    // Draw y-axis label
    ctx.save()
    ctx.translate(15, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textAlign = "center"
    ctx.fillText(label, 0, 0)
    ctx.restore()
  }, [data, dataKey, label, isPercentage, isRatio])

  return (
    <div className="w-full h-[400px] relative">
      <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
    </div>
  )
}
