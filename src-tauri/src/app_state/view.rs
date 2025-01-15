#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum Navigation {
    Dashboard,
}

#[derive(serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub enum TabName {
    Welcome,
}

#[derive(serde::Serialize, serde::Deserialize, Clone)]
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

#[derive(serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub struct Tab {
    kind: TabKind,
    label: Option<String>,
}

#[derive(serde::Serialize, serde::Deserialize, Clone)]
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
                label: None,
            }],
            aside: None,
            bottom: None,
            status: None,
        }
    }
}

impl ViewState {
    pub fn navigate(&mut self, nav: Navigation) {
        match self.navigation {
            None => {
                self.navigation = Some(nav);
            }
            Some(ref current) => {
                self.navigation = if current == &nav { None } else { Some(nav) };
            }
        }
    }
}
