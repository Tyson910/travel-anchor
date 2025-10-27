import type { SearchPageLoaderResponse } from "~/routes/search";

export type Destination =
	SearchPageLoaderResponse[number]["destination_airport"];
