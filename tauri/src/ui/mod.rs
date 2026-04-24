use serde::{Deserialize, Serialize};

/// Ergonomic constructors for layout trees. Use these from your own layout commands.
pub mod build;

/// `view`: `home` (main layout & forms), `library` (search / catalog), `settings` (preferences & window actions).
#[tauri::command]
pub fn get_ui_layout(view: String) -> Result<Vec<UIComponent>, String> {
    build::layout_for_view(&view)
}

/// JSON: `actionType` key; values `SUBMIT_FORM`, `NAVIGATE`, `CLOSE_WINDOW`; data fields are camelCase.
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(tag = "actionType", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum UIAction {
    #[serde(rename_all = "camelCase")]
    SubmitForm { target_id: String },
    #[serde(rename_all = "camelCase")]
    Navigate { path: String },
    CloseWindow,
}

/// Tag for wire JSON: `type` (camelCase variant) + content fields in camelCase.
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum UIComponent {
    Button {
        id: String,
        label: String,
        primary: bool,
        action: Option<UIAction>,
    },
    TextInput { id: String, placeholder: String },
    /// Legacy flex column with padding; prefer [`UIComponent::Stack`].
    Container { id: String, children: Vec<UIComponent> },
    Stack {
        id: String,
        direction: StackDirection,
        /// Tailwind space scale 1–12 (e.g. `3` => `gap-3`).
        gap: u8,
        children: Vec<UIComponent>,
    },
    Text {
        id: String,
        content: String,
        #[serde(default)]
        text_variant: TextVariant,
    },
    Card { id: String, children: Vec<UIComponent> },
    Badge {
        id: String,
        label: String,
        /// Matches the React `Badge` `variant` names.
        #[serde(default = "default_badge_tone")]
        tone: String,
    },
    /// Horizontal rule.
    Separator { id: String },
}

#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq, Default)]
#[serde(rename_all = "lowercase")]
pub enum TextVariant {
    #[default]
    Body,
    Title,
}

fn default_badge_tone() -> String {
    "default".to_string()
}

#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum StackDirection {
    Row,
    Column,
}

/// Invoked from the client when a user triggers a `UIAction` (e.g. button click).
#[tauri::command]
pub fn handle_ui_action(
    action: UIAction,
    payload: serde_json::Value,
) -> Result<serde_json::Value, String> {
    match action {
        UIAction::SubmitForm { ref target_id } => {
            let message = match target_id.as_str() {
                "library_import" => "Import queued",
                "settings_save" => "Preferences saved",
                "form_profile" => "Profile form received",
                _ => "Form submitted",
            };
            Ok(serde_json::json!({
                "ok": true,
                "message": message,
                "targetId": target_id,
                "payload": payload,
            }))
        }
        UIAction::Navigate { path } => Ok(serde_json::json!({
            "ok": true,
            "message": "Navigation requested (stub)",
            "path": path,
        })),
        UIAction::CloseWindow => Ok(serde_json::json!({
            "ok": true,
            "message": "Close window requested (stub)",
        })),
    }
}
