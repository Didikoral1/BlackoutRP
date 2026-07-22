import { news } from "@/data/news";
import SiteClient from "@/components/SiteClient";

export const dynamic = "force-dynamic";

export default function Home() {
  return <SiteClient page="start" initialNews={news} />;
}
