import type { SearchPageLoaderResponse } from "../route";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	type Control,
	type FieldErrors,
	useController,
	useForm,
} from "react-hook-form";
import z from "zod";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#components/ui/base-select.tsx";
import { Button } from "#src/components/ui/button.tsx";
import { Label } from "#src/components/ui/label.tsx";

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
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		watch,
	} = useForm<FilterSchema>({
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
			<FilterTypeSelect control={control} errors={errors} />
			<IATAFilterSelect
				control={control}
				origin_airport_options={props.routes[0].origin_airport_options}
				errors={errors}
			/>
			<FilterValueSelect
				control={control}
				routes={props.routes}
				fieldName={watchedFieldName}
				errors={errors}
			/>

			<Button type="submit" disabled={isSubmitting} className="w-full">
				{isSubmitting ? "Applying Filter..." : "Apply Filter"}
			</Button>
		</form>
	);
}

function FilterTypeSelect({
	control,
	errors,
}: {
	control: Control<FilterSchema>;
	errors: FieldErrors<FilterSchema>;
}) {
	const {
		field,
		fieldState: { error },
	} = useController({
		name: "field_name",
		control,
		rules: { required: "Please select a filter type" },
	});

	return (
		<>
			<div className="flex flex-row items-center gap-x-4 mb-2">
				<Label>Select Filter</Label>
				{(error || errors.field_name) && (
					<div className="text-red-500 text-sm">
						{error?.message || errors.field_name?.message}
					</div>
				)}
			</div>
			<Select
				items={filters}
				value={field.value}
				onValueChange={field.onChange}
			>
				<SelectTrigger className="w-full" onBlur={field.onBlur}>
					<SelectValue placeholder="Select a filter type" />
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
		</>
	);
}

function IATAFilterSelect({
	control,
	origin_airport_options,
	errors,
}: {
	control: Control<FilterSchema>;
	origin_airport_options: SearchPageLoaderResponse[number]["origin_airport_options"];
	errors: FieldErrors<FilterSchema>;
}) {
	const iataCodeOptions = origin_airport_options.map(({ iata_code, name }) => ({
		value: iata_code,
		label: name,
	}));

	const {
		field,
		fieldState: { error },
	} = useController({
		name: "codes",
		control,
		rules: { required: "Please select at least one airport" },
	});

	return (
		<>
			<div className="flex flex-row items-center gap-x-4 mb-2">
				<Label>Which Airports to Apply This Filter?</Label>
				{(error || errors.codes) && (
					<div className="text-red-500 text-sm">
						{error?.message || errors.codes?.message}
					</div>
				)}
			</div>

			<Select
				multiple
				items={iataCodeOptions}
				value={field.value}
				onValueChange={field.onChange}
			>
				<SelectTrigger className="w-full" onBlur={field.onBlur}>
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
		</>
	);
}

function FilterValueSelect({
	control,
	routes,
	fieldName,
	errors,
}: {
	control: Control<FilterSchema>;
	routes: SearchPageLoaderResponse;
	fieldName: FilterSchema["field_name"];
	errors: FieldErrors<FilterSchema>;
}) {
	const {
		field,
		fieldState: { error },
	} = useController({
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
		<>
			<div className="flex flex-row items-center gap-x-4 mb-2">
				<Label className="capitalize">{fieldName} Options</Label>
				{(error || errors.value) && (
					<div className="text-red-500 text-sm">
						{error?.message || errors.value?.message}
					</div>
				)}
			</div>
			<Select
				multiple
				items={uniqueIataCodeOptions}
				value={field.value}
				onValueChange={field.onChange}
			>
				<SelectTrigger className="w-full" onBlur={field.onBlur}>
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
		</>
	);
}
