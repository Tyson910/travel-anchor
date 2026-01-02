import {
	Await,
	CatchBoundary,
	createFileRoute,
	type ErrorComponentProps,
	notFound,
	PathParamError,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { Home, RefreshCw } from "lucide-react";

import {
	Alert,
	AlertContent,
	AlertDescription,
	AlertTitle,
} from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import {
	getErrorDescription,
	getErrorMessage,
	getErrorTitle,
	getErrorType,
} from "~/lib/error-utils";
import { rpcClient } from "~/lib/rpc-client";
import { IATAValidator } from "~/lib/validators";

export type AirportDetailPageLoaderResponse = Awaited<
	(typeof Route)["types"]["loaderData"]["airport"]
>;

export const Route = createFileRoute("/airport/$iata")({
	staleTime: 5000,
	// Do not cache this route's data after it's unloaded
	// gcTime: 0,
	component: AirportHubPage,
	loader: (ctx) => {
		const { iata } = ctx.params;

		const validatedIATAResult = IATAValidator.safeParse(iata);

		if (!validatedIATAResult.success) {
			throw new PathParamError("Invalid IATA code");
		}

		const airport = rpcClient("/airport/:IATA", {
			params: {
				IATA: validatedIATAResult.data,
			},
		}).then(({ data, error }) => {
			if (error) {
				console.log(error);
				throw error;
			}
			return data.airport;
		});

		return {
			airport,
		};
	},
	pendingComponent: Skeleton,
	errorComponent: ErrorElement,
});

function AirportHubPage() {
	const { airport } = Route.useLoaderData();

	return (
		<>
			<CatchBoundary getResetKey={() => "airport"} errorComponent={() => null}>
				<Await
					promise={airport}
					fallback={<Skeleton className="mt-5 h-40 w-full rounded-lg" />}
				>
					{(airport) => (
						<>
							<h1 className="text-3xl font-bold font-sans tracking-tight text-foreground mb-2">
								{airport.name}
							</h1>
							<div className="mt-5">{airport.city_name}</div>
						</>
					)}
				</Await>
			</CatchBoundary>
			<div></div>
		</>
	);
}

function ErrorElement({ error, info, reset }: ErrorComponentProps) {
	const navigate = useNavigate();
	const isDevelopment = import.meta.env.DEV;

	const errorMessage = getErrorMessage(error);
	const errorType = getErrorType(error);

	return (
		<div className="container mx-auto px-4 py-8">
			<Alert variant="destructive" appearance="light" size="lg">
				<AlertContent className="w-full text-center">
					<AlertTitle>{getErrorTitle(errorType)}</AlertTitle>
					<AlertDescription>
						{getErrorDescription(errorType, errorMessage)}
					</AlertDescription>

					<div className="w-max mx-auto flex flex-wrap gap-3 mt-4">
						<Button
							variant="outline"
							size="sm"
							onClick={reset}
							className="flex items-center gap-2"
						>
							<RefreshCw className="size-4" />
							Try Again
						</Button>

						<Button
							variant="ghost"
							size="sm"
							onClick={() => navigate({ to: "/" })}
							className="flex items-center gap-2"
						>
							<Home className="size-4" />
							Back to Home
						</Button>
					</div>

					{isDevelopment && (
						<div className="mt-4 p-3 bg-muted rounded-md">
							<details className="text-xs">
								<summary className="cursor-pointer font-mono font-semibold mb-2">
									Debug Information
								</summary>
								<div className="space-y-2 font-mono">
									<div>
										<strong>Error Type:</strong> {errorType}
									</div>
									<div>
										<strong>Error Message:</strong> {errorMessage}
									</div>
									{error instanceof Error && (
										<div>
											<strong>Stack Trace:</strong>
											<pre className="whitespace-pre-wrap mt-1 text-xs opacity-70">
												{error.stack}
											</pre>
										</div>
									)}
									{info && (
										<div>
											<strong>Component Info:</strong>
											<pre className="whitespace-pre-wrap mt-1 text-xs opacity-70">
												{JSON.stringify(info, null, 2)}
											</pre>
										</div>
									)}
								</div>
							</details>
						</div>
					)}
				</AlertContent>
			</Alert>
		</div>
	);
}
