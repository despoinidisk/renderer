"use client"

import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/core"
import { renderComponent } from "@/components/Renderer"
import { UiRuntimeProvider, useUiRuntime } from "@/components/UiRuntimeProvider"
import type { UIComponent } from "@/types/ui"

function Shell() {
  const [layout, setLayout] = useState<UIComponent[]>([])
  const { lastResult, clearLastResult } = useUiRuntime()

  useEffect(() => {
    invoke<UIComponent[]>("get_ui_layout")
      .then((data) => setLayout(data))
      .catch(() => setLayout([]))
  }, [])

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-10">
      <header className="space-y-1">
        <h1 className="font-heading text-lg font-medium">Declarative UI</h1>
        <p className="text-xs text-muted-foreground">
          Layout is loaded from Rust; form values and action results are handled in the React layer.
        </p>
      </header>

      {lastResult && (
        <div className="rounded-none border border-border bg-muted/30 p-3 text-xs">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="font-medium">Last action</span>
            <button
              type="button"
              onClick={clearLastResult}
              className="text-muted-foreground underline decoration-dotted underline-offset-2 hover:text-foreground"
            >
              Dismiss
            </button>
          </div>
          {lastResult.ok ? (
            <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-words text-[11px] leading-relaxed text-foreground">
              {JSON.stringify(lastResult.data, null, 2)}
            </pre>
          ) : (
            <p className="text-destructive">{lastResult.error}</p>
          )}
        </div>
      )}

      <div className="space-y-4">{layout.map((node) => renderComponent(node))}</div>
    </main>
  )
}

export default function App() {
  return (
    <UiRuntimeProvider>
      <Shell />
    </UiRuntimeProvider>
  )
}
