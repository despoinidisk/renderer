import * as React from "react"
import { Button, Input, Box, Card, CardContent, Badge } from "./ui"
import { cn } from "@/lib/utils"
import type { TextVariant, UIComponent } from "@/types/ui"
import { useUiRuntime } from "./UiRuntimeProvider"

const GAP: Record<number, string> = {
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  7: "gap-7",
  8: "gap-8",
  9: "gap-9",
  10: "gap-10",
  11: "gap-11",
  12: "gap-12",
}

const BADGE_TONES = new Set([
  "default",
  "secondary",
  "destructive",
  "outline",
  "ghost",
  "link",
])

function badgeVariant(tone: string | undefined) {
  if (tone && BADGE_TONES.has(tone)) {
    return tone as React.ComponentProps<typeof Badge>["variant"]
  }
  return "default" as const
}

function textClasses(variant: TextVariant | undefined) {
  if (variant === "title") {
    return "font-heading text-sm font-medium text-foreground"
  }
  return "text-xs/relaxed text-foreground"
}

function renderChildren(nodes: UIComponent[] | undefined) {
  if (!nodes?.length) return null
  return nodes.map((ch) => <React.Fragment key={ch.id}>{renderComponent(ch)}</React.Fragment>)
}

export function renderComponent(config: UIComponent): React.ReactNode {
  const key = config.id
  switch (config.type) {
    case "button":
      return <ButtonView key={key} id={config.id} label={config.label} primary={config.primary} action={config.action} />
    case "textInput":
      return <TextInputView key={key} id={config.id} placeholder={config.placeholder} />
    case "container":
      return <ContainerView key={key}>{renderChildren(config.children)}</ContainerView>
    case "stack":
      return (
        <StackView key={key} direction={config.direction} gap={config.gap}>
          {renderChildren(config.children)}
        </StackView>
      )
    case "text":
      return (
        <p key={key} className={cn(textClasses(config.textVariant), "m-0")} data-ui-id={config.id}>
          {config.content}
        </p>
      )
    case "card":
      return (
        <Card key={key} className="w-full max-w-2xl" data-ui-id={config.id}>
          <CardContent className="space-y-4 pt-0">{renderChildren(config.children)}</CardContent>
        </Card>
      )
    case "badge":
      return (
        <Badge key={key} variant={badgeVariant(config.tone)} data-ui-id={config.id}>
          {config.label}
        </Badge>
      )
    case "separator":
      return <hr key={key} className="border-0 border-t border-border" data-ui-id={config.id} />
    default: {
      const _exhaustive: never = config
      return _exhaustive
    }
  }
}

function ButtonView({
  id,
  label,
  primary,
  action,
}: {
  id: string
  label: string
  primary: boolean
  action: import("@/types/ui").UIAction | null
}) {
  const { runAction } = useUiRuntime()
  return (
    <Button
      type="button"
      variant={primary ? "default" : "outline"}
      data-ui-id={id}
      onClick={() => {
        if (action) void runAction(action)
      }}
    >
      {label}
    </Button>
  )
}

function TextInputView({ id, placeholder }: { id: string; placeholder: string }) {
  const { formValues, setField } = useUiRuntime()
  return (
    <Input
      id={id}
      name={id}
      value={formValues[id] ?? ""}
      onChange={(e) => setField(id, e.target.value)}
      placeholder={placeholder}
      data-ui-id={id}
    />
  )
}

function ContainerView({ children }: { children: React.ReactNode }) {
  return <Box className="flex flex-col space-y-4 p-4">{children}</Box>
}

function StackView({
  direction,
  gap,
  children,
}: {
  direction: "row" | "column"
  gap: number
  children: React.ReactNode
}) {
  const g = GAP[gap] ?? "gap-4"
  return (
    <div
      className={cn(
        "flex",
        direction === "row" ? "flex-row flex-wrap items-end" : "flex-col",
        g
      )}
    >
      {children}
    </div>
  )
}
