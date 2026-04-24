"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { APP_TABS, type AppTabId } from "@/types/app"

type DesktopAppShellProps = {
  children: React.ReactNode
  activeTab: AppTabId
  onTabChange: (id: AppTabId) => void
  /** Shown in the title strip (usually derived from the active tab). */
  viewTitle: string
  className?: string
}

/**
 * Full-viewport desktop-style chrome: titlebar (Tauri drag) + top toolbar, then scrollable main.
 */
export function DesktopAppShell({
  children,
  activeTab,
  onTabChange,
  viewTitle,
  className,
}: DesktopAppShellProps) {
  return (
    <div
      className={cn(
        "flex h-svh w-full min-h-0 flex-col overflow-hidden bg-background text-foreground",
        className
      )}
    >
      <div
        className="flex h-8 shrink-0 select-none items-stretch border-b border-border/80 bg-muted/30"
        data-tauri-drag-region
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
          <span className="shrink-0 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Renderer
          </span>
          <span className="h-3 w-px bg-border" aria-hidden />
          <span className="truncate text-xs text-foreground/90">{viewTitle}</span>
        </div>
        <div
          className="flex items-center gap-1.5 border-l border-border/60 px-2.5"
          data-tauri-drag-region="false"
          aria-hidden
        >
          <span className="h-2 w-2 rounded-full border border-border/80 bg-background" />
          <span className="h-2 w-2 rounded-full border border-border/80 bg-background" />
          <span className="h-2 w-2 rounded-full border border-border/80 bg-background" />
        </div>
      </div>

      <header
        className="flex h-9 shrink-0 items-center gap-1 border-b border-border bg-card px-1.5"
        data-tauri-drag-region="false"
      >
        <nav className="flex min-w-0 flex-1 items-center gap-0.5" aria-label="Views">
          {APP_TABS.map((item) => {
            const isActive = item.id === activeTab
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "rounded-none px-2.5 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </button>
            )
          })}
        </nav>
        <div className="h-4 w-px shrink-0 bg-border" aria-hidden />
        <span
          className="shrink-0 px-2 text-[10px] text-muted-foreground"
          title="Layout tree is loaded per tab from Rust"
        >
          Source: Rust
        </span>
      </header>

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">
        {children}
      </div>
    </div>
  )
}
