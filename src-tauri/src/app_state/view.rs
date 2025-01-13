#[derive(Default)]
pub struct Navigation {
    pub current_tab: String,
}

#[derive(Default)]
pub struct Tab {
    pub id: String,
    pub title: String,
}

#[derive(Default)]
pub struct ViewState {
    // TODO: Make sure it is not possible to generate an invalid view state
    // e.g. don't make props public and mutate only via methods
    navigation: Navigation,
    tabs: Vec<Tab>,
}
