import type { Route } from "./+types/search";

import { Welcome } from "../welcome/welcome";

export function meta({ ...rest }: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	return <Welcome />;
}
