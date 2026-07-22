import { news } from "@/data/news";
import SiteClient from "@/components/SiteClient";

export default function ServerPage() {
  return <SiteClient page="server" initialNews={news} />;
}
