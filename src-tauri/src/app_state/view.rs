#[derive(serde::Serialize, Clone)]
#[serde(rename_all = "lowercase")]
pub enum Navigation {
    Dashboard,
}

#[derive(serde::Serialize, Clone)]
#[serde(rename_all = "lowercase")]
pub enum TabName {
    Welcome,
}

#[derive(serde::Serialize, Clone)]
#[serde(rename_all = "lowercase")]
pub struct TabKind {
    nav: Navigation,
    name: TabName,
}

impl TabKind {
    pub fn welcome() -> Self {
        Self {
            nav: Navigation::Dashboard,
            name: TabName::Welcome,
        }
    }
}

#[derive(serde::Serialize, Clone)]
#[serde(rename_all = "lowercase")]
pub struct Tab {
    kind: TabKind,
}

#[derive(serde::Serialize, Clone)]
pub struct ViewState {
    navigation: Option<Navigation>,
    tabs: Vec<Tab>,
    aside: Option<String>,
    bottom: Option<String>,
    status: Option<String>,
}

impl Default for ViewState {
    fn default() -> Self {
        Self {
            navigation: Some(Navigation::Dashboard),
            tabs: vec![Tab {
                kind: TabKind::welcome(),
            }],
            aside: None,
            bottom: None,
            status: None,
        }
    }
}
