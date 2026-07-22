import { news } from "@/data/news";
import SiteClient from "@/components/SiteClient";

export default function NewsPage() {
  return <SiteClient page="news" initialNews={news} />;
}
