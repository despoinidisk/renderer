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

/// **Layout** tab: profile card, two-column form, submit / navigate, status badge.
pub fn home_layout() -> Vec<UIComponent> {
    use TextVariant::Title;
    use TextVariant::Body;

    vec![card("root_home", vec![
        vstack("title_block", 2, vec![
            text("card_title", "Settings & profile", Title),
            text(
                "card_sub",
                "Edits are stored in the React form map and sent with the next action. Each tab has its own field ids.",
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
            text("settings_h", "Sub-panel: status", Title),
            hstack("badge_row", 2, vec![
                text("st_text", "Status", Body),
                badge("st_badge", "Draft", "secondary"),
            ]),
        ]),
    ])]
}

/// **Library** tab: search, catalog copy, “import” submit, different actions than home.
pub fn library_layout() -> Vec<UIComponent> {
    use TextVariant::Title;
    use TextVariant::Body;

    vec![card("root_lib", vec![
        vstack("lib_head", 2, vec![
            text("lib_title", "Content library", Title),
            text(
                "lib_desc",
                "Search the catalog. Import sends a different target_id to the same Rust handler as the Layout tab.",
                Body,
            ),
        ]),
        separator("lib_sep1"),
        vstack("lib_search_block", 2, vec![
            text("lib_lbl", "Filter", Body),
            text_input("lib_query", "Search by title, tag, or id…"),
        ]),
        hstack("lib_chips", 2, vec![
            badge("lib_b1", "Audio", "outline"),
            badge("lib_b2", "Sheets", "secondary"),
            badge("lib_b3", "3 items", "default"),
        ]),
        hstack("lib_actions", 2, vec![
            button("lib_clear", "Clear", false, None),
            button(
                "lib_import",
                "Queue import",
                true,
                Some(UIAction::SubmitForm {
                    target_id: "library_import".to_string(),
                }),
            ),
            button(
                "lib_open",
                "Open folder (stub)",
                false,
                Some(UIAction::Navigate {
                    path: "/import".to_string(),
                }),
            ),
        ]),
    ])]
}

/// **Settings** tab: “API” fields, save, and close-window action (no navigate).
pub fn settings_layout() -> Vec<UIComponent> {
    use TextVariant::Title;
    use TextVariant::Body;

    vec![card("root_set", vec![
        vstack("set_head", 2, vec![
            text("set_title", "Preferences", Title),
            text(
                "set_desc",
                "Values are still plain text fields. Save posts the form; Close window exercises a different action variant.",
                Body,
            ),
        ]),
        separator("set_sep1"),
        vstack("set_fields", 2, vec![
            text("set_api_lbl", "API base URL", Body),
            text_input("set_api_url", "https://api.example.com"),
            text("set_key_lbl", "Access token (local only)", Body),
            text_input("set_token", "••••••••"),
        ]),
        hstack("set_row", 2, vec![
            text("set_zone_lbl", "Region", Body),
            text_input("set_region", "e.g. us-east-1"),
        ]),
        hstack("set_actions", 2, vec![
            button(
                "set_save",
                "Save preferences",
                true,
                Some(UIAction::SubmitForm {
                    target_id: "settings_save".to_string(),
                }),
            ),
            button(
                "set_close",
                "Close window (stub)",
                false,
                Some(UIAction::CloseWindow),
            ),
        ]),
    ])]
}

pub fn layout_for_view(view: &str) -> Result<Vec<UIComponent>, String> {
    match view {
        "home" => Ok(home_layout()),
        "library" => Ok(library_layout()),
        "settings" => Ok(settings_layout()),
        other => Err(format!("unknown view: {other}")),
    }
}
