declare module '*.json' {
  const data: any;

  export default data;
}

interface RootObject {
  id: number;
  date: string;
  date_gmt: string;
  slug: string;
  status: string;
  title: Title;
  content: Title;
  categories: number[];
  _embedded: Embedded;
}

interface Embedded {
  'wp:featuredmedia': Wpfeaturedmedia[];
}

interface Wpfeaturedmedia {
  id: number;
  date: string;
  type: string;
  title: Title;
  media_details: Mediadetails;
}

interface Mediadetails {
  width: number;
  height: number;
  file: string;
  sizes: Sizes;
  source_url: string;
}

interface Sizes {
  medium: Size;
  full: Size;
}

interface Size {
  file: string;
  width: number;
  height: number;
  mime_type: string;
  source_url: string;
}

interface Title {
  rendered: string;
}
