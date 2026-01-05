function capitalizeFirstLetter(str: string) {
	if (str.length == 0) return "";
	if (str.length == 1) return str[0].toUpperCase();
	return str[0].toUpperCase() + str.substring(1);
}

export function deSlugifyStr(str: string) {
	// if string doesn't contain a '-' or '_' just return back the capitalized word
	if (!str.includes("-") && !str.includes("_"))
		return capitalizeFirstLetter(str);

	// replaces '-' or '_ with ' '
	const StrWithDashesAndHypensReplacedWithSpaces = str
		.replace(/-/g, "  ")
		.replace(/_/g, "  ");

	let deSlugifiedStr = "";
	StrWithDashesAndHypensReplacedWithSpaces.split(" ").forEach((char) => {
		deSlugifiedStr += char ? capitalizeFirstLetter(char) : " ";
	});
	return deSlugifiedStr;
}
