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

  return (
    <div
      className={cn("relative", className)}
      style={style}
      {...props}
    >
      <div
        className="pointer-events-none absolute -z-10"
        style={{
          inset: -borderWidth,
          background: `conic-gradient(from 0deg, transparent, ${colors.join(", ")}, transparent 30%)`,
          animation: `shine-rotate ${duration}s linear infinite`,
          borderRadius: "inherit",
        }}
      />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  )
}
