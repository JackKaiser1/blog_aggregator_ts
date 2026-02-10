import { fetchFeed } from "../fetch_feed";

export async function handlerAgg(cmd: string, ...args: string[]) {
    const data = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(data.channel);
}

