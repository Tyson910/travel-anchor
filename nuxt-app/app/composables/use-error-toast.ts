import { z } from "zod";

export function useErrorToast(error: unknown) {
	const messageSchema = z.union([
		z
			.string()
			.nonempty()
			.transform((val) => ({
				message: val,
				statusText: undefined,
			})),
		z.object({
			statusText: z.string().optional(),
			message: z.string().nonempty(),
		}),
	]);

	const messageParseResult = messageSchema.safeParse(error);

	const toast = useToast();

	toast.add({
		title: messageParseResult.data?.statusText
			? `Error: ${messageParseResult.data.statusText}`
			: "Error",
		description: messageParseResult.success
			? messageParseResult.data.message
			: "An unexpect error has occured",
		color: "error",
		duration: 4000,
	});
}
