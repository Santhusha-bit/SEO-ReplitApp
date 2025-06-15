export interface TabItem {
  id: string;
  label: string;
  icon: string;
}

export const TABS: TabItem[] = [
  { id: 'google', label: 'Google Preview', icon: 'fas fa-search' },
  { id: 'facebook', label: 'Facebook', icon: 'fab fa-facebook' },
  { id: 'twitter', label: 'Twitter', icon: 'fab fa-twitter' },
  { id: 'details', label: 'Tag Details', icon: 'fas fa-code' },
  { id: 'recommendations', label: 'Recommendations', icon: 'fas fa-lightbulb' },
];

export const EXAMPLE_URLS = [
  'google.com',
  'github.com',
  'stripe.com',
];
