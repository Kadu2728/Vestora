"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"

type AnimatedCounterProps = {
  target: number
  duration?: number
  suffix?: string
  prefix?: string
  decimals?: number
}

export function AnimatedCounter({
  target,
  duration = 1500,
  suffix = "",
  prefix = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  useEffect(() => {
    if (!isInView) return
    const start = performance.now()

    const animate = (time: number) => {
      const elapsed = time - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(2, -10 * progress)
      setCount(eased * target)
      if (progress < 1) requestAnimationFrame(animate)
      else setCount(target)
    }

    requestAnimationFrame(animate)
  }, [isInView, target, duration])

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}
