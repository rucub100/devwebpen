use std::{ops::Deref, sync::Mutex};

use aside::AsideView;
use bottom::BottomView;
use main::MainView;
use nav::NavView;
use status::StatusView;
use tabs::{Tab, TabKind, TabName, TabsView};

mod aside;
mod bottom;
mod main;
pub mod nav;
mod status;
mod tabs;

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct ViewStateInner {
    pub nav: NavView,
    pub tabs: TabsView,
    pub main: MainView,
    pub aside: AsideView,
    pub bottom: BottomView,
    pub status: StatusView,
}

#[derive(serde::Serialize, serde::Deserialize, Clone, Default)]
pub struct PartialViewState {
    pub nav: Option<NavView>,
    pub tabs: Option<TabsView>,
    pub main: Option<MainView>,
    pub aside: Option<AsideView>,
    pub bottom: Option<BottomView>,
    pub status: Option<StatusView>,
}

impl From<ViewStateInner> for PartialViewState {
    fn from(view_state: ViewStateInner) -> Self {
        PartialViewState {
            nav: Some(view_state.nav),
            tabs: Some(view_state.tabs),
            main: Some(view_state.main),
            aside: Some(view_state.aside),
            bottom: Some(view_state.bottom),
            status: Some(view_state.status),
        }
    }
}

impl Default for ViewStateInner {
    fn default() -> Self {
        let id = Tab::next_id();
        Self {
            nav: NavView::Dashboard,
            tabs: TabsView {
                tabs: vec![Tab {
                    id,
                    kind: TabKind::welcome(),
                    label: None,
                }],
                active_tab_id: Some(id),
            },
            main: MainView::Welcome,
            aside: AsideView::None,
            bottom: BottomView::None,
            status: StatusView::Show,
        }
    }
}

impl ViewStateInner {
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
                    TabName::Welcome => MainView::Welcome,
                };
            }
            None => {
                self.main = MainView::None;
            }
        }
    }

    pub fn navigate_to(&mut self, nav: NavView) -> PartialViewState {
        match self.nav {
            NavView::None => {
                self.nav = nav;
            }
            ref current => {
                self.nav = if current == &nav { NavView::None } else { nav };
            }
        }

        return PartialViewState {
            nav: Some(self.nav.clone()),
            ..Default::default()
        };
    }

    pub fn close_tab(&mut self, id: u64) -> PartialViewState {
        let index = self.tabs.tabs.iter().position(|tab| tab.id == id);
        if let None = index {
            log::error!("Tab with id {} not found", id);
            return PartialViewState::default();
        }

        let index = index.unwrap();
        self.tabs.tabs.remove(index);
        if self.tabs.active_tab_id == Some(id) {
            if index < self.tabs.tabs.len() {
                self.tabs.active_tab_id = Some(self.tabs.tabs[index].id);
            } else if self.tabs.tabs.len() > 0 {
                self.tabs.active_tab_id = Some(self.tabs.tabs.last().unwrap().id);
            } else {
                self.tabs.active_tab_id = None;
            }
        }

        self.update_main();

        return PartialViewState {
            tabs: Some(self.tabs.clone()),
            main: Some(self.main.clone()),
            ..Default::default()
        };
    }

    pub fn select_tab(&mut self, id: u64) -> PartialViewState {
        let tab = self.tabs.tabs.iter().find(|tab| tab.id == id);
        if let None = tab {
            log::error!("Tab with id {} not found", id);
            return PartialViewState::default();
        }

        let tab = tab.unwrap();
        let prev_active_tab_id = self.tabs.active_tab_id;
        self.tabs.active_tab_id = Some(tab.id);

        self.update_main();

        if prev_active_tab_id == self.tabs.active_tab_id {
            return PartialViewState::default();
        }

        return PartialViewState {
            tabs: Some(self.tabs.clone()),
            main: Some(self.main.clone()),
            ..Default::default()
        };
    }

    pub fn open_welcome(&mut self) -> PartialViewState {
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

                return PartialViewState {
                    tabs: Some(self.tabs.clone()),
                    main: Some(self.main.clone()),
                    ..Default::default()
                };
            }
            Some(tab) => {
                let prev_active_tab_id = self.tabs.active_tab_id;
                self.tabs.active_tab_id = Some(tab.id);

                self.update_main();

                if prev_active_tab_id == self.tabs.active_tab_id {
                    return PartialViewState::default();
                }

                return PartialViewState {
                    tabs: Some(self.tabs.clone()),
                    main: Some(self.main.clone()),
                    ..Default::default()
                };
            }
        }
    }

    pub fn reset(&mut self) -> PartialViewState {
        *self = ViewStateInner::default();
        self.clone().into()
    }
}

pub type ViewState = Mutex<ViewStateInner>;
