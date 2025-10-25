import { isBrowser } from "~/lib/utils";

export function ClientOnly(props: React.PropsWithChildren) {
	if (isBrowser) return props.children;
	return null;
}
