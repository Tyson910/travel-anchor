import {
	createFileRoute,
	Link,
	stripSearchParams,
	useBlocker,
	useNavigate,
} from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { ArrowRight } from "lucide-react";
import { useId } from "react";
import * as z from "zod";

import { buttonVariants } from "~/components/ui/button.tsx";
import { AirportSearchCombobox } from "~/features/airport-search/components/SearchBar.tsx";
import { cn } from "~/lib/utils";
import { oneOrManyIATAValidator } from "~/lib/validators";

const searchSchema = z.object({
	codes: oneOrManyIATAValidator.optional().default([]),
});

export const Route = createFileRoute("/")({
	// Only reload the route when the user navigates to it or when deps change
	shouldReload: false,
	validateSearch: zodValidator(searchSchema),
	loaderDeps: ({ search }) => ({ iataCodes: search.codes }),
	component: HomePage,
	search: {
		// strip empty codes from URL
		middlewares: [stripSearchParams({ codes: [] })],
	},
});

function HomePage() {
	const navigate = useNavigate({ from: "/" });
	const id = useId();
	const { codes: iataCodes } = Route.useSearch();

	const blocker = useBlocker({
		shouldBlockFn: ({ next }) => {
			return (
				next.fullPath == "/search" &&
				"codes" in next.search &&
				next.search.codes.length < 2
			);
		},
		withResolver: true,
		enableBeforeUnload: false,
	});

	const handleSearch = (values: string[]) => {
		const dedupedIATACodes = [...new Set(values)];
		navigate({
			search: {
				codes: dedupedIATACodes,
			},
		});

		if (dedupedIATACodes.length > 1 && typeof blocker.reset == "function") {
			blocker.reset();
		}
	};

	return (
		<>
			<title>Flight Anchor - Smart Flight Connections</title>
			<meta
				name="description"
				content="Find direct-flight connections between multiple airports with intelligent route analysis."
			></meta>
			<main className="flex items-center justify-center px-4 py-20">
				<div className="w-full max-w-2xl space-y-8">
					<div className="text-center space-y-6">
						<h1 className="text-2xl font-light tracking-tight">
							Select at least 2 airports to find mutual destinations
						</h1>

						<div className="space-y-4">
							<label
								htmlFor={id}
								className="text-sm text-muted-foreground sr-only"
							>
								Select airports to search from:
							</label>
							<div className="mt-4">
								<AirportSearchCombobox
									iataCodes={iataCodes}
									id={id}
									onValueChange={handleSearch}
								/>
							</div>

							<p className="text-sm text-muted-foreground">
								{iataCodes.length >= 2
									? `Find destinations that all airports can reach directly`
									: null}
							</p>
						</div>
					</div>

					<div className="text-center">
						<Link
							to="/search"
							search={{
								codes: iataCodes,
							}}
							onClick={blocker.reset}
							className={buttonVariants({
								variant: "primary",
								size: "lg",
								class: cn(
									"w-full sm:w-auto",
									blocker.status == "blocked" && "shake-element",
								),
							})}
						>
							Find Routes
							<ArrowRight className="size-4 ml-2" />
						</Link>

						<p className="text-sm mt-4 text-destructive-foreground">
							{blocker.status == "blocked"
								? "Please select at least 2 airports"
								: null}
						</p>
					</div>
				</div>
			</main>
		</>
	);
}
