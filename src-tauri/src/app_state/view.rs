use std::sync::atomic::{AtomicU64, Ordering};

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
    id: u64,
    kind: TabKind,
    label: Option<String>,
}

impl Tab {
    fn next_id() -> u64 {
        static COUNTER: AtomicU64 = AtomicU64::new(0);
        COUNTER.fetch_add(1, Ordering::SeqCst)
    }
}

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct ViewState {
    navigation: Option<Navigation>,
    tabs: Vec<Tab>,
    #[serde(rename = "activeTabId")]
    active_tab_id: Option<u64>,
    aside: Option<String>,
    bottom: Option<String>,
    status: Option<String>,
}

impl Default for ViewState {
    fn default() -> Self {
        let id = Tab::next_id();
        Self {
            navigation: Some(Navigation::Dashboard),
            tabs: vec![Tab {
                id,
                kind: TabKind::welcome(),
                label: None,
            }],
            active_tab_id: Some(id),
            aside: None,
            bottom: None,
            status: None,
        }
    }
}

impl ViewState {
    pub fn navigate_to(&mut self, nav: Navigation) {
        match self.navigation {
            None => {
                self.navigation = Some(nav);
            }
            Some(ref current) => {
                self.navigation = if current == &nav { None } else { Some(nav) };
            }
        }
    }

    pub fn close_tab(&mut self, id: u64) {
        let index = self.tabs.iter().position(|tab| tab.id == id);
        if let None = index {
            log::error!("Tab with id {} not found", id);
            return;
        }

        let index = index.unwrap();
        self.tabs.remove(index);
        if self.active_tab_id == Some(id) {
            if (index < self.tabs.len()) {
                self.active_tab_id = Some(self.tabs[index].id);
            } else if (self.tabs.len() > 0) {
                self.active_tab_id = Some(self.tabs.last().unwrap().id);
            } else {
                self.active_tab_id = None;
            }
        }
    }

    pub fn select_tab(&mut self, id: u64) -> bool {
        let tab = self.tabs.iter().find(|tab| tab.id == id);
        if let None = tab {
            log::error!("Tab with id {} not found", id);
            return false;
        }

        let tab = tab.unwrap();
        let prev_active_tab_id = self.active_tab_id;
        self.active_tab_id = Some(tab.id);
        prev_active_tab_id == None || self.active_tab_id != prev_active_tab_id
    }
}
