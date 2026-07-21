import { news } from "@/data/news";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default function Home() {
  return <HomeClient news={news} />;
}
