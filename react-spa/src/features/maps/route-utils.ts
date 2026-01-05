type Coordinate = [number, number]; // [longitude, latitude]

interface Airport {
	latitude: number;
	longitude: number;
}

interface Bounds {
	minLat: number;
	maxLat: number;
	minLng: number;
	maxLng: number;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
	return (degrees * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians: number): number {
	return (radians * 180) / Math.PI;
}

/**
 * Calculate the distance between two points using the Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
	point1: Coordinate,
	point2: Coordinate,
): number {
	const [lon1, lat1] = point1;
	const [lon2, lat2] = point2;

	const R = 6371; // Earth's radius in km
	const dLat = toRadians(lat2 - lat1);
	const dLon = toRadians(lon2 - lon1);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRadians(lat1)) *
			Math.cos(toRadians(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

/**
 * Generate a great circle arc between two points
 * Returns an array of coordinates forming a curved line
 *
 * @param start - Starting coordinate [longitude, latitude]
 * @param end - Ending coordinate [longitude, latitude]
 * @param numPoints - Number of points to generate (more = smoother curve)
 */
export function generateGreatCircleArc(
	start: Coordinate,
	end: Coordinate,
	numPoints?: number,
): Coordinate[] {
	// Optimize number of points based on distance
	const distance = calculateDistance(start, end);
	let points: number;

	if (numPoints !== undefined) {
		points = numPoints;
	} else if (distance < 500) {
		points = 20; // Short routes need fewer points
	} else if (distance < 2000) {
		points = 50; // Medium routes
	} else {
		points = 100; // Long routes need more points for smooth curves
	}

	const [lon1, lat1] = start;
	const [lon2, lat2] = end;

	// Convert to radians
	const lat1Rad = toRadians(lat1);
	const lon1Rad = toRadians(lon1);
	const lat2Rad = toRadians(lat2);
	const lon2Rad = toRadians(lon2);

	// Calculate the angular distance
	const d =
		2 *
		Math.asin(
			Math.sqrt(
				Math.sin((lat1Rad - lat2Rad) / 2) ** 2 +
					Math.cos(lat1Rad) *
						Math.cos(lat2Rad) *
						Math.sin((lon1Rad - lon2Rad) / 2) ** 2,
			),
		);

	const coordinates: Coordinate[] = [];

	// Generate intermediate points
	for (let i = 0; i <= points; i++) {
		const f = i / points;

		const a = Math.sin((1 - f) * d) / Math.sin(d);
		const b = Math.sin(f * d) / Math.sin(d);

		const x =
			a * Math.cos(lat1Rad) * Math.cos(lon1Rad) +
			b * Math.cos(lat2Rad) * Math.cos(lon2Rad);
		const y =
			a * Math.cos(lat1Rad) * Math.sin(lon1Rad) +
			b * Math.cos(lat2Rad) * Math.sin(lon2Rad);
		const z = a * Math.sin(lat1Rad) + b * Math.sin(lat2Rad);

		const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
		const lon = Math.atan2(y, x);

		coordinates.push([toDegrees(lon), toDegrees(lat)]);
	}

	return coordinates;
}

/**
 * Calculate bounding box for a set of airports
 * Returns bounds with padding
 */
export function calculateBounds(airports: Airport[]): Bounds {
	if (airports.length === 0) {
		return { minLat: 0, maxLat: 0, minLng: 0, maxLng: 0 };
	}

	const maxLat = Math.max(...airports.map(({ latitude }) => latitude));
	const minLat = Math.min(...airports.map(({ latitude }) => latitude));

	const maxLng = Math.max(...airports.map(({ longitude }) => longitude));
	const minLng = Math.min(...airports.map(({ longitude }) => longitude));

	// Add padding (roughly 10% on each side)
	const latPadding = (maxLat - minLat) * 0.1 || 0.5;
	const lngPadding = (maxLng - minLng) * 0.1 || 0.5;

	return {
		minLat: minLat - latPadding,
		maxLat: maxLat + latPadding,
		minLng: minLng - lngPadding,
		maxLng: maxLng + lngPadding,
	};
}
