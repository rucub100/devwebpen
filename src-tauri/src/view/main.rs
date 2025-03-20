#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum MainView {
    None,
    Welcome,
    ApiRequest,
    ProxyTraffic,
}
