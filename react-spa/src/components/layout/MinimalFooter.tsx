export function MinimalFooter() {
	return (
		<footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
			<p>
				&copy; {new Date().getFullYear()} Flight Anchor. Flight data is
				approximate. Not affiliated with any airline
			</p>
		</footer>
	);
}
