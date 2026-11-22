export interface SearchResult {
  type: 'course' | 'topic';
  id: string;
  title: string;
  subtitle: string;
  href: string;
}
