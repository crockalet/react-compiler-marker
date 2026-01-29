use zed::LanguageServerId;
use zed_extension_api::{self as zed, serde_json::json, settings::LspSettings, Result};

struct ReactCompilerMarkerExtension;

impl zed::Extension for ReactCompilerMarkerExtension {
    fn new() -> Self {
        Self
    }

    fn language_server_command(
        &mut self,
        _language_server_id: &LanguageServerId,
        worktree: &zed::Worktree,
    ) -> Result<zed::Command> {
        // Try to find npx in the worktree's PATH
        let npx_path = worktree
            .which("npx")
            .ok_or_else(|| "npx not found. Please install Node.js".to_string())?;

        Ok(zed::Command {
            command: npx_path,
            args: vec![
                "react-compiler-marker-lsp".into(),
                "--stdio".into(),
            ],
            env: vec![],
        })
    }

    fn language_server_initialization_options(
        &mut self,
        server_id: &LanguageServerId,
        worktree: &zed::Worktree,
    ) -> Result<Option<zed::serde_json::Value>> {
        let settings = LspSettings::for_worktree(server_id.as_ref(), worktree)
            .ok()
            .and_then(|lsp_settings| lsp_settings.initialization_options.clone())
            .unwrap_or_else(|| json!({}));

        // Pass tooltip format preference to server
        Ok(Some(json!({
            "tooltipFormat": "markdown"
        })))
    }

    fn language_server_workspace_configuration(
        &mut self,
        server_id: &LanguageServerId,
        worktree: &zed::Worktree,
    ) -> Result<Option<zed::serde_json::Value>> {
        let settings = LspSettings::for_worktree(server_id.as_ref(), worktree)
            .ok()
            .and_then(|lsp_settings| lsp_settings.settings.clone())
            .unwrap_or_else(|| json!({}));

        Ok(Some(settings))
    }
}

zed::register_extension!(ReactCompilerMarkerExtension);
