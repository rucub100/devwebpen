use std::sync::Mutex;

use aside::AsideView;
use bottom::BottomView;
use main::MainView;
use nav::NavView;
use status::StatusView;
use tabs::{ProxyTrafficTabData, Tab, TabData, TabKind, TabName, TabsView};
use uuid::Uuid;

use crate::api_client::HttpRequest;

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

impl PartialViewState {
    pub fn merge(&mut self, other: PartialViewState) {
        if let Some(nav) = other.nav {
            self.nav = Some(nav);
        }
        if let Some(tabs) = other.tabs {
            self.tabs = Some(tabs);
        }
        if let Some(main) = other.main {
            self.main = Some(main);
        }
        if let Some(aside) = other.aside {
            self.aside = Some(aside);
        }
        if let Some(bottom) = other.bottom {
            self.bottom = Some(bottom);
        }
        if let Some(status) = other.status {
            self.status = Some(status);
        }
    }
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
                    label: Some("Welcome".to_string()),
                    data: None,
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
    fn _update_main(&mut self) {
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
                    TabName::ApiRequest => MainView::ApiRequest,
                    TabName::ProxyTraffic => MainView::ProxyTraffic,
                };
            }
            None => {
                self.main = MainView::None;
            }
        }
    }

    fn _partial_tabs_main(&self) -> PartialViewState {
        PartialViewState {
            tabs: Some(self.tabs.clone()),
            main: Some(self.main.clone()),
            ..Default::default()
        }
    }

    fn _select_tab(&mut self, id: u64) -> PartialViewState {
        let prev_active_tab_id = self.tabs.active_tab_id;
        self.tabs.active_tab_id = Some(id);

        self._update_main();

        if prev_active_tab_id == self.tabs.active_tab_id {
            return PartialViewState::default();
        }

        return self._partial_tabs_main();
    }

    fn _new_tab(&mut self, tab: Tab) -> PartialViewState {
        let id = tab.id;
        self.tabs.tabs.push(tab);
        self.tabs.active_tab_id = Some(id);
        self._update_main();

        return self._partial_tabs_main();
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

        self._update_main();

        return self._partial_tabs_main();
    }

    pub fn select_tab(&mut self, id: u64) -> PartialViewState {
        let tab = self.tabs.tabs.iter().find(|tab| tab.id == id);
        if let None = tab {
            log::error!("Tab with id {} not found", id);
            return PartialViewState::default();
        }

        let tab = tab.unwrap();
        return self._select_tab(tab.id);
    }

    pub fn open_welcome(&mut self) -> PartialViewState {
        let tab = self
            .tabs
            .tabs
            .iter()
            .find(|tab| tab.kind.name == TabName::Welcome);

        match tab {
            None => self._new_tab(Tab::new_welcome()),
            Some(tab) => self._select_tab(tab.id),
        }
    }

    pub fn close_bottom(&mut self) -> PartialViewState {
        if self.bottom == BottomView::None {
            log::error!("Bottom view already closed");
            return PartialViewState::default();
        }

        self.bottom = BottomView::None;

        return PartialViewState {
            bottom: Some(self.bottom.clone()),
            ..Default::default()
        };
    }

    pub fn close_aside(&mut self) -> PartialViewState {
        if self.aside == AsideView::None {
            log::error!("Aside view already closed");
            return PartialViewState::default();
        }

        self.aside = AsideView::None;

        return PartialViewState {
            aside: Some(self.aside.clone()),
            ..Default::default()
        };
    }

    pub fn open_proxy_traffic(&mut self) -> PartialViewState {
        if self.bottom == BottomView::ProxyTraffic {
            return PartialViewState::default();
        }

        self.bottom = BottomView::ProxyTraffic;

        return PartialViewState {
            bottom: Some(self.bottom.clone()),
            ..Default::default()
        };
    }

    pub fn get_proxy_suspended_id(&self) -> Option<Uuid> {
        let tab = self
            .tabs
            .tabs
            .iter()
            .find(|tab| tab.kind.name == TabName::ProxyTraffic);

        match tab {
            None => None,
            Some(tab) => match tab.data.as_ref() {
                Some(TabData::ProxyTraffic(data)) => Some(data.id),
                _ => None,
            },
        }
    }

    pub fn open_proxy_suspended(&mut self, id: Uuid) -> PartialViewState {
        let tab = self
            .tabs
            .tabs
            .iter_mut()
            .find(|tab| tab.kind.name == TabName::ProxyTraffic);

        match tab {
            None => self._new_tab(Tab::new_proxy_suspend(id)),
            Some(tab) => {
                let tab_id = tab.id;

                match tab.data.as_mut() {
                    Some(TabData::ProxyTraffic(data)) => {
                        if data.id == id {
                            return self._select_tab(tab_id);
                        }

                        data.id = id;
                    }
                    None => {
                        log::error!("Tab data is not ProxyTraffic");
                        tab.data = Some(TabData::ProxyTraffic(ProxyTrafficTabData { id }));
                    }
                    Some(_) => {
                        log::error!("Tab data is not ProxyTraffic");
                        return PartialViewState::default();
                    }
                }

                return PartialViewState {
                    tabs: Some(self.tabs.clone()),
                    ..self._select_tab(tab_id)
                };
            }
        }
    }

    pub fn close_proxy_suspended(&mut self) -> PartialViewState {
        let tab_id = self.tabs.tabs.iter().find_map(|tab| {
            if tab.kind.name == TabName::ProxyTraffic {
                Some(tab.id)
            } else {
                None
            }
        });

        match tab_id {
            None => PartialViewState::default(),
            Some(tab_id) => self.close_tab(tab_id),
        }
    }

    pub fn open_api_client_request(&mut self, req: HttpRequest) -> PartialViewState {
        let tab = self.tabs.tabs.iter().find(|tab| {
            tab.kind.name == TabName::ApiRequest
                && tab.data.as_ref().is_some_and(|data| match data {
                    TabData::ApiRequest(data) => data.request_id == req.id,
                    _ => false,
                })
        });

        match tab {
            None => self._new_tab(Tab::new_api_request(req)),
            Some(tab) => self._select_tab(tab.id),
        }
    }

    pub fn reset(&mut self) -> PartialViewState {
        *self = ViewStateInner::default();
        self.clone().into()
    }
}

pub type ViewState = Mutex<ViewStateInner>;
