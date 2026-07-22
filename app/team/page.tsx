import { news } from "@/data/news";
import SiteClient from "@/components/SiteClient";

export default function TeamPage() {
  return <SiteClient page="team" initialNews={news} />;
}
