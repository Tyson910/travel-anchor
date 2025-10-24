/**
 * Generates a dynamic SVG Open Graph (OG) image as a string.
 *
 * This function conditionally chooses a layout based on the number of airports:
 * - 4 or fewer airports: Shows specific IATA codes and connecting lines.
 * - 5 or more airports: Shows an abstracted "Airport Cloud" and a summary.
 *
 * @param {string[]} airportCodes - An array of IATA airport codes (e.g., ['PHX', 'TUS', 'LAX']).
 * @param {number} totalRoutes - The number of mutual destinations found (e.g., 4).
 * @returns {string} A complete SVG markup string.
 */
export function generateDynamicOGImage(
	airportCodes: string[] = [],
	totalRoutes = 0,
): string {
	const title = `${totalRoutes} Mutual Flight Destination${totalRoutes !== 1 ? "s" : ""}`;
	let svgString = "";

	if (airportCodes.length <= 4 && airportCodes.length > 0) {
		const layoutPositions = [
			{
				circle: { cx: "280", cy: "220" },
				text: { x: "280", y: "228" },
				path: "M310 220 C400 200, 500 280, 520 350",
			},
			{
				circle: { cx: "280", cy: "540" },
				text: { x: "280", y: "548" },
				path: "M310 540 C400 560, 500 480, 520 410",
			},
			{
				circle: { cx: "920", cy: "220" },
				text: { x: "920", y: "228" },
				path: "M890 220 C800 200, 700 280, 680 350",
			},
			{
				circle: { cx: "920", cy: "540" },
				text: { x: "920", y: "548" },
				path: "M890 540 C800 560, 700 480, 680 410",
			},
		];

		const airportListString = airportCodes.join(", ");
		let dynamicAirportElements = "";
		const airportsToDraw = Math.min(
			airportCodes.length,
			layoutPositions.length,
		);

		for (let i = 0; i < airportsToDraw; i++) {
			const code = airportCodes[i];
			const pos = layoutPositions[i];

			dynamicAirportElements += `
        <!-- Airport ${i + 1}: ${code} -->
        <path d="${pos.path}" stroke="#4A90E2" stroke-width="8" stroke-linecap="round" stroke-dasharray="20 15"/>
        <circle cx="${pos.circle.cx}" cy="${pos.circle.cy}" r="40" fill="#B0D8FF"/>
        <text x="${pos.text.x}" y="${pos.text.y}" font-family="Inter, sans-serif" font-weight="600" font-size="28" fill="#333333" text-anchor="middle" dominant-baseline="middle">${code}</text>
      `;
		}

		svgString = `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#F8F8F8"/>
    <text x="50" y="100" font-family="Inter, sans-serif" font-weight="800" font-size="60" fill="#333333">
        ${title}
    </text>
    <text x="50" y="160" font-family="Inter, sans-serif" font-weight="600" font-size="40" fill="#666666">
        For ${airportListString}
    </text>
    <circle cx="600" cy="380" r="80" fill="#4A90E2"/>
    <text x="600" y="390" font-family="Inter, sans-serif" font-weight="700" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle">✈️</text>
    ${dynamicAirportElements}
</svg>
    `;
	} else {
		const subtitle =
			airportCodes.length === 0
				? "Search for mutual destinations"
				: `From ${airportCodes.length} Airports`;

		svgString = `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#F8F8F8"/>
    <text x="50" y="100" font-family="Inter, sans-serif" font-weight="800" font-size="60" fill="#333333">
        ${title}
    </text>
    <text x="50" y="160" font-family="Inter, sans-serif" font-weight="600" font-size="40" fill="#666666">
        ${subtitle}
    </text>
    
    <circle cx="600" cy="380" r="80" fill="#4A90E2"/>
    <text x="600" y="390" font-family="Inter, sans-serif" font-weight="700" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle">✈️</text>

    <circle cx="300" cy="280" r="15" fill="#B0D8FF"/>
    <circle cx="250" cy="400" r="15" fill="#B0D8FF"/>
    <circle cx="350" cy="500" r="15" fill="#B0D8FF"/>
    <circle cx="500" cy="250" r="15" fill="#B0D8FF"/>
    <circle cx="700" cy="250" r="15" fill="#B0D8FF"/>
    <circle cx="850" cy="280" r="15" fill="#B0D8FF"/>
    <circle cx="900" cy="400" r="15" fill="#B0D8FF"/>
    <circle cx="800" cy="500" r="15" fill="#B0D8FF"/>

    <path d="M300 280 C400 300, 500 340, 520 370" stroke="#4A90E2" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 10"/>
    <path d="M250 400 C350 420, 450 400, 520 390" stroke="#4A90E2" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 10"/>
    <path d="M350 500 C450 480, 500 450, 520 400" stroke="#4A90E2" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 10"/>
    <path d="M500 250 C550 280, 570 300, 550 350" stroke="#4A90E2" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 10"/>
    <path d="M700 250 C650 280, 630 300, 650 350" stroke="#4A90E2" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 10"/>
    <path d="M850 280 C750 300, 650 340, 680 370" stroke="#4A90E2" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 10"/>
    <path d="M900 400 C800 420, 700 400, 680 390" stroke="#4A90E2" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 10"/>
    <path d="M800 500 C700 480, 650 450, 680 400" stroke="#4A90E2" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 10"/>
</svg>
    `;
	}

	return svgString.trim();
}
