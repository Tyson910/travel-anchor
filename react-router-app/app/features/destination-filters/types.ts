import type { loader as SearchPageLoader } from "~/routes/search";

type LoaderResponse = Awaited<ReturnType<typeof SearchPageLoader>>;

export type Destination =
	LoaderResponse["routes"][number]["destination_airport"];
