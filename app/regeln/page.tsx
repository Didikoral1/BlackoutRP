import { news } from "@/data/news";
import SiteClient from "@/components/SiteClient";

export default function RulesPage() {
  return <SiteClient page="regeln" initialNews={news} />;
}
