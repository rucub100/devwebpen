#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum NavView {
    None,
    Dashboard,
    Proxy,
}
