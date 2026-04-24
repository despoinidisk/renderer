/**
 * Top toolbar view ids. Must match `get_ui_layout` in Rust and tab buttons in the shell.
 */
export const APP_TABS = [
  {
    id: "home" as const,
    label: "Layout",
    /** Title strip (next to “Renderer”) */
    viewTitle: "Profile & forms",
  },
  {
    id: "library" as const,
    label: "Library",
    viewTitle: "Content library",
  },
  {
    id: "settings" as const,
    label: "Settings",
    viewTitle: "Preferences",
  },
] as const

export type AppTabId = (typeof APP_TABS)[number]["id"]

export function tabMeta(id: AppTabId) {
  return APP_TABS.find((t) => t.id === id) ?? APP_TABS[0]
}
