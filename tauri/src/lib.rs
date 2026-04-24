// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod ui;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            ui::get_ui_layout,
            ui::handle_ui_action
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
