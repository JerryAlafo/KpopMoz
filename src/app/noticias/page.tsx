import { getDynamicNews } from "@/lib/news-feed";
import { NoticiasClient } from "./NoticiasClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NoticiasPage() {
  const items = await getDynamicNews(18);

  return <NoticiasClient initialNews={items} />;
}
