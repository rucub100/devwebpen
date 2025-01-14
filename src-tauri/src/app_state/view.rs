#[derive(serde::Serialize, Clone)]
#[serde(rename_all = "lowercase")]
pub enum Navigation {
    Dashboard,
}

#[derive(serde::Serialize, Clone)]
#[serde(rename_all = "lowercase")]
pub enum Tab {
    Welcome,
}

#[derive(serde::Serialize, Clone)]
pub struct ViewState {
    navigation: Option<Navigation>,
    tabs: Vec<Tab>,
}

impl Default for ViewState {
    fn default() -> Self {
        Self {
            navigation: Some(Navigation::Dashboard),
            tabs: vec![Tab::Welcome],
        }
    }
}
