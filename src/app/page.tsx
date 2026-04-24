"use client"

import { useEffect, useState, useCallback } from "react"
import { invoke } from "@tauri-apps/api/core"
import { renderComponent } from "@/components/Renderer"
import { DesktopAppShell } from "@/components/desktop-app-shell"
import { UiRuntimeProvider, useUiRuntime } from "@/components/UiRuntimeProvider"
import { tabMeta, type AppTabId } from "@/types/app"
import type { UIComponent } from "@/types/ui"

function DynamicUi({ viewKey }: { viewKey: AppTabId }) {
  const [layout, setLayout] = useState<UIComponent[]>([])
  const { lastResult, clearLastResult } = useUiRuntime()
  const meta = tabMeta(viewKey)

  useEffect(() => {
    invoke<UIComponent[]>("get_ui_layout", { view: viewKey })
      .then((data) => setLayout(data))
      .catch(() => setLayout([]))
  }, [viewKey])

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-6 md:px-10 md:py-8">
      <div className="space-y-1.5">
        <p className="text-[11px] text-muted-foreground">
          Tab <span className="text-foreground/80">{meta.label}</span> — built from{" "}
          <code className="rounded border border-border/80 bg-muted/50 px-1">get_ui_layout(&quot;{viewKey}&quot;)</code>.
          Form fields and actions are scoped to this view (state resets when you change tabs).
        </p>
      </div>

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

      <div className="space-y-4 border-t border-border/60 pt-6">
        {layout.map((node) => renderComponent(node))}
      </div>
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTabId>("home")
  const meta = tabMeta(activeTab)

  const onTabChange = useCallback((id: AppTabId) => {
    setActiveTab(id)
  }, [])

  return (
    <UiRuntimeProvider key={activeTab} view={activeTab}>
      <DesktopAppShell
        activeTab={activeTab}
        onTabChange={onTabChange}
        viewTitle={meta.viewTitle}
      >
        <DynamicUi viewKey={activeTab} />
      </DesktopAppShell>
    </UiRuntimeProvider>
  )
}
