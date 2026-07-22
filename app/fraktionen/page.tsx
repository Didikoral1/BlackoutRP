import { news } from "@/data/news";
import SiteClient from "@/components/SiteClient";

export default function FactionsPage() {
  return <SiteClient page="fraktionen" initialNews={news} />;
}
