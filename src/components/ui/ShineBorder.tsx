"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Width of the border in pixels
   * @default 1
   */
  borderWidth?: number
  /**
   * Duration of the animation in seconds
   * @default 14
   */
  duration?: number
  /**
   * Color of the border, can be a single color or an array of colors
   * @default "#000000"
   */
  shineColor?: string | string[]
}

/**
 * Shine Border
 *
 * An animated background border effect component with configurable properties.
 */
export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = "#000000",
  className,
  style,
  children,
  ...props
}: ShineBorderProps) {
  const colors = Array.isArray(shineColor) ? shineColor : [shineColor]

  const gradient =
    colors.length === 1
      ? `linear-gradient(135deg, transparent 40%, ${colors[0]} 50%, transparent 60%)`
      : `linear-gradient(135deg, ${colors.join(", ")})`

  return (
    <div
      className={cn("relative", className)}
      style={{
        ...style,
        padding: borderWidth,
        background: gradient,
        backgroundSize: "300% 300%",
        animation: `shine ${duration}s infinite linear`,
      }}
      {...props}
    >
      <div
        className="relative z-10 h-full"
        style={{ borderRadius: "inherit" }}
      >
        {children}
      </div>
    </div>
  )
}
