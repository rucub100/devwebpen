use aside::AsideView;
use bottom::BottomView;
use main::MainView;
use navigation::Navigation;
use status::StatusView;
use tabs::{Tab, TabKind, TabName, TabsView};

mod aside;
mod bottom;
mod main;
pub mod navigation;
mod status;
mod tabs;

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct ViewState {
    navigation: Option<Navigation>,
    tabs: TabsView,
    main: Option<MainView>,
    aside: Option<AsideView>,
    bottom: Option<BottomView>,
    status: Option<StatusView>,
}

impl Default for ViewState {
    fn default() -> Self {
        let id = Tab::next_id();
        Self {
            navigation: Some(Navigation::Dashboard),
            tabs: TabsView {
                tabs: vec![Tab {
                    id,
                    kind: TabKind::welcome(),
                    label: None,
                }],
                active_tab_id: Some(id),
            },
            main: Some(MainView::Welcome),
            aside: None,
            bottom: None,
            status: None,
        }
    }
}

impl ViewState {
    fn update_main(&mut self) {
        match self.tabs.active_tab_id {
            Some(id) => {
                let tab = self.tabs.tabs.iter().find(|tab| tab.id == id);
                if let None = tab {
                    log::error!("Tab with id {} not found", id);
                    return;
                }

                let tab = tab.unwrap();
                self.main = match tab.kind.name {
                    TabName::Welcome => Some(MainView::Welcome),
                };
            }
            None => {
                self.main = None;
            }
        }
    }

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
        let index = self.tabs.tabs.iter().position(|tab| tab.id == id);
        if let None = index {
            log::error!("Tab with id {} not found", id);
            return;
        }

        let index = index.unwrap();
        self.tabs.tabs.remove(index);
        if self.tabs.active_tab_id == Some(id) {
            if (index < self.tabs.tabs.len()) {
                self.tabs.active_tab_id = Some(self.tabs.tabs[index].id);
            } else if (self.tabs.tabs.len() > 0) {
                self.tabs.active_tab_id = Some(self.tabs.tabs.last().unwrap().id);
            } else {
                self.tabs.active_tab_id = None;
            }
        }

        self.update_main();
    }

    pub fn select_tab(&mut self, id: u64) -> bool {
        let tab = self.tabs.tabs.iter().find(|tab| tab.id == id);
        if let None = tab {
            log::error!("Tab with id {} not found", id);
            return false;
        }

        let tab = tab.unwrap();
        let prev_active_tab_id = self.tabs.active_tab_id;
        self.tabs.active_tab_id = Some(tab.id);

        self.update_main();

        prev_active_tab_id == None || self.tabs.active_tab_id != prev_active_tab_id
    }

    pub fn open_welcome(&mut self) -> bool {
        let tab = self
            .tabs
            .tabs
            .iter()
            .find(|tab| tab.kind.name == TabName::Welcome);

        match tab {
            None => {
                let id = Tab::next_id();
                self.tabs.tabs.push(Tab {
                    id,
                    kind: TabKind::welcome(),
                    label: None,
                });
                self.tabs.active_tab_id = Some(id);
                self.update_main();
                return true;
            }
            _ => {
                return false;
            }
        }
    }
}
