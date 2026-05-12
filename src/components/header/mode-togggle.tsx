"use client"

import * as React from "react"
import { flushSync } from "react-dom"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function applyThemeToDom(theme: "dark" | "light") {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.setAttribute("data-theme", theme);
  try { localStorage.setItem("theme", theme); } catch { /* ignore */ }
}

export function ModeToggle() {
  const { setTheme } = useTheme()
  const btnRef = React.useRef<HTMLButtonElement>(null)

  function handleTheme(next: "light" | "dark" | "system") {
    // System — no ripple, just apply
    if (next === "system") {
      setTheme("system")
      return
    }

    // No View Transitions support or mobile — apply directly
    if (
      typeof document === "undefined" ||
      !("startViewTransition" in document) ||
      /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    ) {
      setTheme(next)
      return
    }

    // Ripple origin from the trigger button centre
    const rect = btnRef.current?.getBoundingClientRect()
    const x = rect ? rect.left + rect.width  / 2 : window.innerWidth  / 2
    const y = rect ? rect.top  + rect.height / 2 : window.innerHeight / 2
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth  - x),
      Math.max(y, window.innerHeight - y),
    )
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]

    try {
      (document as Document & {
        startViewTransition: (cb: () => void) => { ready: Promise<void> }
      }).startViewTransition(() => {
        flushSync(() => {
          applyThemeToDom(next)
          setTheme(next)
        })
      }).ready.then(() => {
        document.documentElement.animate(
          { clipPath },
          { duration: 400, easing: "ease-in", pseudoElement: "::view-transition-new(root)" },
        )
      }).catch(() => {})
    } catch {
      setTheme(next)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button ref={btnRef} variant="outline" className="h-[clamp(0.5rem,6vw,2.3rem)]! w-[clamp(0.5rem,6vw,2.3rem)]!" size="icon-lg">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
