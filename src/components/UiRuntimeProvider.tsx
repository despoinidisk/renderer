"use client"

import * as React from "react"
import { invoke } from "@tauri-apps/api/core"
import type { UIAction } from "@/types/ui"

type ActionResult =
  | { ok: true; data: unknown }
  | { ok: false; error: string }

type UiRuntimeValue = {
  view: string
  formValues: Record<string, string>
  setField: (id: string, value: string) => void
  lastResult: ActionResult | null
  clearLastResult: () => void
  runAction: (action: UIAction) => Promise<void>
}

const UiRuntimeContext = React.createContext<UiRuntimeValue | null>(null)

export function UiRuntimeProvider({
  children,
  view,
}: {
  children: React.ReactNode
  /** Active toolbar tab; included in every `handle_ui_action` payload. */
  view: string
}) {
  const [formValues, setFormValues] = React.useState<Record<string, string>>({})
  const [lastResult, setLastResult] = React.useState<ActionResult | null>(null)

  const setField = React.useCallback((id: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [id]: value }))
  }, [])

  const clearLastResult = React.useCallback(() => setLastResult(null), [])

  const runAction = React.useCallback(
    async (action: UIAction) => {
      const payload = { fields: formValues, view }
      try {
        const data = await invoke<unknown>("handle_ui_action", { action, payload })
        setLastResult({ ok: true, data })
      } catch (e) {
        setLastResult({ ok: false, error: e instanceof Error ? e.message : String(e) })
      }
    },
    [formValues, view]
  )

  const value = React.useMemo<UiRuntimeValue>(
    () => ({
      view,
      formValues,
      setField,
      lastResult,
      clearLastResult,
      runAction,
    }),
    [view, formValues, setField, lastResult, clearLastResult, runAction]
  )

  return <UiRuntimeContext.Provider value={value}>{children}</UiRuntimeContext.Provider>
}

export function useUiRuntime() {
  const ctx = React.useContext(UiRuntimeContext)
  if (!ctx) {
    throw new Error("useUiRuntime must be used within UiRuntimeProvider")
  }
  return ctx
}

/**
 * For components that can render outside the tree (e.g. tests). Returns null if no provider.
 */
export function useUiRuntimeOptional() {
  return React.useContext(UiRuntimeContext)
}

/** Shorthand: action runner + result surface, without full form state. */
export function useUiActions() {
  const { runAction, lastResult, clearLastResult, formValues, view } = useUiRuntime()
  return { runAction, lastResult, clearLastResult, formValues, view }
}
