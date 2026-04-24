use super::UIAction;
use super::UIComponent;
use super::StackDirection;
use super::TextVariant;

/// Vertical stack with `flex flex-col` semantics (no Card wrapper).
pub fn vstack(id: &str, gap: u8, children: Vec<UIComponent>) -> UIComponent {
    stack(id, StackDirection::Column, gap, children)
}

/// Horizontal row stack.
pub fn hstack(id: &str, gap: u8, children: Vec<UIComponent>) -> UIComponent {
    stack(id, StackDirection::Row, gap, children)
}

pub fn stack(id: &str, direction: StackDirection, gap: u8, children: Vec<UIComponent>) -> UIComponent {
    UIComponent::Stack {
        id: id.to_string(),
        direction,
        gap: gap.clamp(1, 12),
        children,
    }
}

pub fn text(id: &str, content: &str, variant: TextVariant) -> UIComponent {
    UIComponent::Text {
        id: id.to_string(),
        content: content.to_string(),
        text_variant: variant,
    }
}

pub fn text_input(id: &str, placeholder: &str) -> UIComponent {
    UIComponent::TextInput {
        id: id.to_string(),
        placeholder: placeholder.to_string(),
    }
}

pub fn button(
    id: &str,
    label: &str,
    primary: bool,
    action: Option<UIAction>,
) -> UIComponent {
    UIComponent::Button {
        id: id.to_string(),
        label: label.to_string(),
        primary,
        action,
    }
}

pub fn card(id: &str, children: Vec<UIComponent>) -> UIComponent {
    UIComponent::Card {
        id: id.to_string(),
        children,
    }
}

pub fn badge(id: &str, label: &str, tone: &str) -> UIComponent {
    UIComponent::Badge {
        id: id.to_string(),
        label: label.to_string(),
        tone: tone.to_string(),
    }
}

/// Padded flex column, legacy [`UIComponent::Container`].
#[allow(dead_code)]
pub fn container(id: &str, children: Vec<UIComponent>) -> UIComponent {
    UIComponent::Container {
        id: id.to_string(),
        children,
    }
}

pub fn separator(id: &str) -> UIComponent {
    UIComponent::Separator {
        id: id.to_string(),
    }
}

/// Rich nested layout: card with header copy, two-column form row, actions, nested settings vstack, badge, navigate stub.
pub fn demo_layout() -> Vec<UIComponent> {
    use TextVariant::Title;
    use TextVariant::Body;

    vec![card("root", vec![
        vstack("title_block", 2, vec![
            text("card_title", "Settings & profile", Title),
            text(
                "card_sub",
                "Edit your details. Values are read from the React form store and sent to Rust on submit.",
                Body,
            ),
        ]),
        separator("sep1"),
        hstack("form_row", 3, vec![
            vstack("name_col", 1, vec![
                text("lbl_name", "Display name", Body),
                text_input("name_input", "Enter your name"),
            ]),
            vstack("email_col", 1, vec![
                text("lbl_email", "Email", Body),
                text_input("email_input", "you@example.com"),
            ]),
        ]),
        hstack("actions", 2, vec![
            button("btn_draft", "Save draft", false, None),
            button(
                "btn_submit",
                "Submit to Rust",
                true,
                Some(UIAction::SubmitForm {
                    target_id: "form_profile".to_string(),
                }),
            ),
            button(
                "btn_docs",
                "Open docs (stub)",
                false,
                Some(UIAction::Navigate {
                    path: "/docs".to_string(),
                }),
            ),
        ]),
        separator("sep2"),
        vstack("settings_vstack", 2, vec![
            text("settings_h", "Sub-panel: preferences", Title),
            hstack("badge_row", 2, vec![
                text("st_text", "Status", Body),
                badge("st_badge", "Draft", "secondary"),
            ]),
        ]),
    ])]
}
