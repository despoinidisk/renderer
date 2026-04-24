/**
 * Hand-maintained mirror of `tauri/src/ui/mod.rs` wire JSON. Keep in sync when you add variants.
 */

export type UIAction =
  | { actionType: "SUBMIT_FORM"; targetId: string }
  | { actionType: "NAVIGATE"; path: string }
  | { actionType: "CLOSE_WINDOW" }

export type TextVariant = "title" | "body"

export type UIComponent =
  | {
      type: "button"
      id: string
      label: string
      primary: boolean
      action: UIAction | null
    }
  | { type: "textInput"; id: string; placeholder: string }
  | { type: "container"; id: string; children: UIComponent[] }
  | {
      type: "stack"
      id: string
      direction: "row" | "column"
      gap: number
      children: UIComponent[]
    }
  | {
      type: "text"
      id: string
      content: string
      textVariant?: TextVariant
    }
  | { type: "card"; id: string; children: UIComponent[] }
  | { type: "badge"; id: string; label: string; tone?: string }
  | { type: "separator"; id: string }

export function isUIComponent(x: unknown): x is UIComponent {
  if (typeof x !== "object" || x === null) return false
  return "type" in x && typeof (x as { type: string }).type === "string"
}
