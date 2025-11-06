import type { SearchPageLoaderResponse } from "../../../routes/search";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { type Control, useController, useForm } from "react-hook-form";
import * as z from "zod";

import {
	Sheet,
	SheetBody,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/base-sheet";
import {
	Combobox,
	ComboboxChip,
	ComboboxChipRemove,
	ComboboxChips,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxItemIndicator,
	ComboboxList,
	ComboboxValue,
} from "~/components/ui/base-combobox.tsx";
import {
	Menu,
	MenuContent,
	MenuGroup,
	MenuGroupLabel,
	MenuRadioGroup,
	MenuRadioItem,
	MenuSeparator,
	MenuTrigger,
} from "~/components/ui/base-menu";
import { Button } from "~/components/ui/button.tsx";
import { Field, FieldError, FieldLabel } from "~/components/ui/field.tsx";
import { IATAValidator } from "~/lib/validators";

export const airportSearchFiltersSchema = z.discriminatedUnion("field_name", [
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
	defaultValues?: FilterSchema;
}) {
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const { control, handleSubmit, formState, watch, setValue, reset } =
		useForm<FilterSchema>({
			resolver: zodResolver(airportSearchFiltersSchema),
			defaultValues: props.defaultValues ?? {
				codes: props.routes[0].origin_airport_options.map(
					({ iata_code }) => iata_code,
				),
				value: [],
			},
		});

	const watchedFieldName = watch("field_name");

	const onSubmit = (data: FilterSchema) => {
		props.onValueChange(data);
	};

	return (
		<>
			<FilterTypeSelect
				onFilterSelect={(filterValue) => {
					setValue("field_name", filterValue);
					setIsPopupOpen(true);
				}}
			/>
			<form onSubmit={handleSubmit(onSubmit)} className="">
				<Sheet
					open={isPopupOpen}
					onOpenChange={(isOpening) => {
						setIsPopupOpen(isOpening);
						// reset form on close
						if (!isOpening) {
							reset();
						}
					}}
				>
					<SheetContent className="gap-2.5 p-0">
						<SheetHeader>
							<SheetTitle>Add New Filter</SheetTitle>
						</SheetHeader>
						<SheetBody className="py-0 grow space-y-10">
							<IATAFilterSelect
								control={control}
								origin_airport_options={props.routes[0].origin_airport_options}
							/>
							<FilterValueSelect
								control={control}
								routes={props.routes}
								fieldName={watchedFieldName}
							/>
						</SheetBody>
						<SheetFooter>
							<Button
								type="submit"
								disabled={formState.isSubmitting}
								className="w-full"
							>
								{formState.isSubmitting ? "Applying Filter..." : "Apply Filter"}
							</Button>
							<SheetClose>Cancel</SheetClose>
						</SheetFooter>
					</SheetContent>
				</Sheet>
			</form>
		</>
	);
}

function FilterTypeSelect({
	onFilterSelect,
}: {
	onFilterSelect: (selectedItem: FilterSchema["field_name"]) => void;
}) {
	return (
		<Menu>
			<MenuTrigger render={<Button variant="outline">Add New Filter</Button>} />
			<MenuContent sideOffset={4} className="w-40">
				<MenuGroup>
					<MenuGroupLabel>Filter By: </MenuGroupLabel>
					<MenuSeparator />
					<MenuRadioGroup onValueChange={onFilterSelect}>
						{filters.map((item) => (
							<MenuRadioItem
								closeOnClick
								key={item.value}
								value={item.value}
								className="capitalize"
							>
								{item.label}
							</MenuRadioItem>
						))}
					</MenuRadioGroup>
				</MenuGroup>
			</MenuContent>
		</Menu>
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

	const containerRef = useRef<HTMLDivElement | null>(null);

	return (
		<Field data-invalid={fieldState.invalid}>
			<FieldLabel htmlFor={field.name}>
				Which Airports to Apply This Filter?
			</FieldLabel>
			<Combobox
				items={iataCodeOptions}
				multiple
				value={field.value ?? []}
				onValueChange={field.onChange}
			>
				<div className="w-full flex flex-col gap-3">
					<ComboboxChips
						ref={containerRef}
						variant="md"
						id={field.name}
						aria-invalid={fieldState.invalid}
						data-invalid={fieldState.invalid}
					>
						<ComboboxValue>
							{(values: string[]) => (
								<>
									{values.map((airport) => {
										return (
											<ComboboxChip key={airport} aria-label={airport}>
												{airport}
												<ComboboxChipRemove aria-label="Remove" />
											</ComboboxChip>
										);
									})}
									<ComboboxInput id={field.name} onBlur={field.onBlur} />
								</>
							)}
						</ComboboxValue>
					</ComboboxChips>
				</div>

				<ComboboxContent anchor={containerRef}>
					<ComboboxEmpty>No airports found.</ComboboxEmpty>
					<ComboboxList>
						{(airport: { label: string; value: string }) => (
							<ComboboxItem key={airport.value} value={airport.value}>
								<ComboboxItemIndicator />
								{airport.label}
							</ComboboxItem>
						)}
					</ComboboxList>
				</ComboboxContent>
			</Combobox>
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

	const containerRef = useRef<HTMLDivElement | null>(null);

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

	const selectedValues = uniqueIataCodeOptions.filter((iataCode) => {
		return field.value?.includes(iataCode.value);
	});

	return (
		<Field data-invalid={fieldState.invalid}>
			<FieldLabel htmlFor={field.name} className="capitalize">
				{fieldName} Options
			</FieldLabel>
			<Combobox
				items={uniqueIataCodeOptions}
				multiple
				value={selectedValues}
				onValueChange={(val) => {
					const formattedValues = (val as { value: string }[]).map(
						({ value }) => value,
					);
					field.onChange(formattedValues);
				}}
			>
				<div className="w-full flex flex-col gap-3">
					<ComboboxChips
						ref={containerRef}
						variant="md"
						id={field.name}
						aria-invalid={fieldState.invalid}
						data-invalid={fieldState.invalid}
					>
						<ComboboxValue>
							{(value: { label: string; value: string }[]) => (
								<>
									{value.map((item) => (
										<ComboboxChip key={item.value} aria-label={item.label}>
											{item.label}
											<ComboboxChipRemove aria-label="Remove" />
										</ComboboxChip>
									))}
									<ComboboxInput
										placeholder={
											value.length > 0 ? "" : `Select ${fieldName} options`
										}
										onBlur={field.onBlur}
									/>
								</>
							)}
						</ComboboxValue>
					</ComboboxChips>
				</div>

				<ComboboxContent anchor={containerRef}>
					<ComboboxEmpty>No {fieldName} options found.</ComboboxEmpty>
					<ComboboxList>
						{(item: (typeof uniqueIataCodeOptions)[0]) => (
							<ComboboxItem key={item.value} value={item}>
								<ComboboxItemIndicator />
								{item.label}
							</ComboboxItem>
						)}
					</ComboboxList>
				</ComboboxContent>
			</Combobox>
			{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
		</Field>
	);
}
