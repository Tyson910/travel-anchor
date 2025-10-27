import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function getContext() {
	const queryClient = new QueryClient();
	return {
		queryClient,
	};
}

export function Provider({
	children,
	queryClient,
}: React.PropsWithChildren<{
	queryClient: QueryClient;
}>) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
