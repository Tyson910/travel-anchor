import * as z from "zod";

export const IATAValidator = z.string().length(3).toUpperCase();

export const oneOrManyIATAValidator = z
	.union([IATAValidator, z.array(IATAValidator)])
	.transform((val) => (Array.isArray(val) ? val : [val]))
	// remove dupes!
	.transform((val) => [...new Set(val)]);
