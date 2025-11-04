import type { SearchPageLoaderResponse } from "../route";

import { zodResolver } from "@hookform/resolvers/zod";
import { type Control, useController, useForm } from "react-hook-form";
import z from "zod";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#components/ui/base-select.tsx";
import { Button } from "#src/components/ui/button.tsx";
import { Field, FieldError, FieldLabel } from "#src/components/ui/field.tsx";

const IATAValidator = z.string().length(3).toUpperCase();

const airportSearchFiltersSchema = z.discriminatedUnion("field_name", [
	z.object({
		field_name: z.literal("airline").describe("Airline"),
		value: z.array(z.string().nonempty()).min(1),
		codes: z.array(IATAValidator).min(1),
	}),
	// z.object({
	// 	field_name: z.literal("duration"),
	// 	value: z.number().nonnegative(),
	// 	codes: z.array(IATAValidator).min(1),
	// }),
	// z.object({
	// 	field_name: z.literal("travelTimeDelta"),
	// 	value: z.number().nonnegative(),
	// 	codes: z.array(IATAValidator).min(1),
	// }),
]);

type FilterSchema = z.infer<typeof airportSearchFiltersSchema>;

const filters = airportSearchFiltersSchema.options.map((option) => ({
	label: option.shape.field_name.description || option.shape.field_name.value,
	value: option.shape.field_name.value,
}));

export function FilterSelect(props: {
	routes: SearchPageLoaderResponse;
	onValueChange: (filterName: FilterSchema) => void;
}) {
	const { control, handleSubmit, formState, watch } = useForm<FilterSchema>({
		resolver: zodResolver(airportSearchFiltersSchema),
		defaultValues: {
			codes: props.routes[0].origin_airport_options.map(
				({ iata_code }) => iata_code,
			),
		},
	});

	const watchedFieldName = watch("field_name");

	const onSubmit = (data: FilterSchema) => {
		props.onValueChange(data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
			<FilterTypeSelect control={control} />
			<IATAFilterSelect
				control={control}
				origin_airport_options={props.routes[0].origin_airport_options}
			/>
			<FilterValueSelect
				control={control}
				routes={props.routes}
				fieldName={watchedFieldName}
			/>

			<Button
				type="submit"
				disabled={formState.isSubmitting}
				className="w-full"
			>
				{formState.isSubmitting ? "Applying Filter..." : "Apply Filter"}
			</Button>
		</form>
	);
}

function FilterTypeSelect({ control }: { control: Control<FilterSchema> }) {
	const { field, fieldState } = useController({
		name: "field_name",
		control,
		rules: { required: "Please select a filter type" },
	});

	return (
		<Field data-invalid={fieldState.invalid}>
			<FieldLabel htmlFor={field.name}>Select Filter</FieldLabel>
			<Select
				items={filters}
				value={field.value ?? ""}
				onValueChange={field.onChange}
			>
				<SelectTrigger
					className="w-full"
					onBlur={field.onBlur}
					id={field.name}
					aria-invalid={fieldState.invalid}
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{filters.map((item) => (
						<SelectItem
							key={item.value}
							value={item.value}
							className="capitalize"
						>
							{item.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
		</Field>
	);
}

function IATAFilterSelect({
	control,
	origin_airport_options,
}: {
	control: Control<FilterSchema>;
	origin_airport_options: SearchPageLoaderResponse[number]["origin_airport_options"];
}) {
	const iataCodeOptions = origin_airport_options.map(({ iata_code, name }) => ({
		value: iata_code,
		label: name,
	}));

	const { field, fieldState } = useController({
		name: "codes",
		control,
		rules: { required: "Please select at least one airport" },
	});

	return (
		<Field data-invalid={fieldState.invalid}>
			<FieldLabel htmlFor={field.name}>
				Which Airports to Apply This Filter?
			</FieldLabel>
			<Select
				multiple
				items={iataCodeOptions}
				value={field.value ?? []}
				onValueChange={field.onChange}
			>
				<SelectTrigger
					className="w-full"
					onBlur={field.onBlur}
					id={field.name}
					aria-invalid={fieldState.invalid}
				>
					<SelectValue placeholder="Select airports" />
				</SelectTrigger>
				<SelectContent>
					{iataCodeOptions.map((item) => (
						<SelectItem
							key={item.value}
							value={item.value}
							className="capitalize"
						>
							{item.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
		</Field>
	);
}

function FilterValueSelect({
	control,
	routes,
	fieldName,
}: {
	control: Control<FilterSchema>;
	routes: SearchPageLoaderResponse;
	fieldName: FilterSchema["field_name"];
}) {
	const { field, fieldState } = useController({
		name: "value",
		control,
		rules: { required: `Please select at least one ${fieldName}` },
	});

	// TODO: improve this UX
	if (!fieldName) return null;

	const iataCodeOptions = routes.flatMap(({ origin_airport_options }) => {
		return origin_airport_options.flatMap(({ airline_options }) =>
			airline_options.map(({ iata_code, name }) => ({
				value: iata_code,
				label: name,
			})),
		);
	});

	const uniqueIataCodeOptions = iataCodeOptions.reduce(
		(accumulator, currentValue) => {
			const includesAirlines = accumulator.some(
				({ value }) => value == currentValue.value,
			);
			if (!includesAirlines) {
				accumulator.push(currentValue);
			}
			return accumulator;
		},
		[] as typeof iataCodeOptions,
	);

	return (
		<Field data-invalid={fieldState.invalid}>
			<FieldLabel htmlFor={field.name} className="capitalize">
				{fieldName} Options
			</FieldLabel>
			<Select
				multiple
				items={uniqueIataCodeOptions}
				value={field.value ?? []}
				onValueChange={field.onChange}
			>
				<SelectTrigger
					className="w-full"
					onBlur={field.onBlur}
					id={field.name}
					aria-invalid={fieldState.invalid}
				>
					<SelectValue placeholder={`Select ${fieldName} options`} />
				</SelectTrigger>
				<SelectContent>
					{uniqueIataCodeOptions.map((item) => (
						<SelectItem
							key={item.value}
							value={item.value}
							className="capitalize"
						>
							{item.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
		</Field>
	);
}
