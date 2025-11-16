import type { SearchPageLoaderResponse } from "../../../routes/search";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useRef, useState } from "react";
import { type Control, useController, useForm } from "react-hook-form";

import {
	Sheet,
	SheetBody,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/base-sheet";
import { Slider, SliderThumb } from "@/components/ui/base-slider";
import { ButtonGroup } from "@/components/ui/button-group";
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
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "~/components/ui/field.tsx";
import {
	airportSearchFiltersSchema,
	type FilterSchema,
	filterOptions,
	getFilterIcon,
	getFilterLabel,
} from "../filter-utils";

type FilterSelectProps =
	| {
			routes: SearchPageLoaderResponse;
			onFilterSubmit: (filter: FilterSchema) => void;
			defaultValues?: undefined;
	  }
	| {
			routes: SearchPageLoaderResponse;
			onFilterSubmit: (filter: FilterSchema) => void;
			onFilterRemove: (filter: FilterSchema) => void;
			defaultValues: FilterSchema;
	  };

export function FilterSelect(props: FilterSelectProps) {
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const { control, handleSubmit, formState, watch, setValue, reset } =
		useForm<FilterSchema>({
			resolver: zodResolver(airportSearchFiltersSchema),
			defaultValues: props.defaultValues ?? {
				id: crypto.randomUUID(),
				codes: props.routes[0].origin_airport_options.map(
					({ iata_code }) => iata_code,
				),
				value: [],
			},
		});

	const watchedFieldName = watch("field_name");
	const Icon = getFilterIcon(watchedFieldName);
	const filterLabel = getFilterLabel(watchedFieldName);

	const onSubmit = (data: FilterSchema) => {
		props.onFilterSubmit(data);
		setIsPopupOpen(false);
		if (!props.defaultValues) {
			reset({ id: crypto.randomUUID() });
		}
	};

	return (
		<>
			{props.defaultValues ? (
				<ButtonGroup aria-label="Edit or Delete Filter" className="overflow-x-auto min-w-0">
					<Button
						onClick={() => setIsPopupOpen(true)}
						variant="outline"
						className="text-sm"
					>
						<Icon size={14} />
						<span className="font-medium">{filterLabel}</span>
						<span className="text-gray-600">•</span>
						<span className="truncate max-w-full">
							{Array.isArray(props.defaultValues.value)
								? props.defaultValues.value.join(",")
								: `${props.defaultValues.value} hours`}
						</span>
						<span className="text-gray-600">•</span>
						<span className="font-medium">
							Applies to: {props.defaultValues.codes.join(" , ")}
						</span>
					</Button>
					<Button
						variant="destructive"
						onClick={() => {
							props.onFilterRemove(props.defaultValues);
						}}
					>
						<Trash2Icon size={14} />
					</Button>
				</ButtonGroup>
			) : (
				<FilterTypeSelect
					onFilterSelect={(filterValue) => {
						setValue("field_name", filterValue);
						setIsPopupOpen(true);
					}}
				/>
			)}
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
						<SheetTitle>
							{props.defaultValues ? "Edit Filter" : "Add New Filter"}
						</SheetTitle>
					</SheetHeader>
					<SheetBody className="py-0 grow">
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
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
					</SheetBody>
				</SheetContent>
			</Sheet>
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
			<MenuTrigger
				render={
					<Button variant="primary">
						Add New Filter <PlusIcon className="size-4" />
					</Button>
				}
			/>
			<MenuContent sideOffset={4} className="w-max">
				<MenuGroup>
					<MenuGroupLabel>Filter By: </MenuGroupLabel>
					<MenuSeparator />
					<MenuRadioGroup onValueChange={onFilterSelect}>
						{filterOptions.map((item) => {
							const Icon = getFilterIcon(item.value);
							return (
								<MenuRadioItem
									closeOnClick
									key={item.value}
									value={item.value}
									className="capitalize"
								>
									<Icon className="mr-3 size-4" />
									{item.label}
								</MenuRadioItem>
							);
						})}
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

	// const id = useId();
	const containerRef = useRef<HTMLDivElement | null>(null);

	// TODO: improve this UX
	if (!fieldName) return null;

	if (fieldName == "duration") {
		const routeDurationOptions = routes.flatMap(
			({ origin_airport_options }) => {
				return origin_airport_options.flatMap(({ duration_min }) =>
					typeof duration_min == "number" ? Math.ceil(duration_min / 60) : [],
				);
			},
		);

		const dedupedRouteDurationOptions = [...new Set(routeDurationOptions)];
		const maxDuration = Math.max(...dedupedRouteDurationOptions);
		const minDuration = Math.min(...dedupedRouteDurationOptions);

		return (
			<Field className="space-y-4">
				<div className="flex flex-col gap-2.5">
					<div className="flex flex-row justify-between gap-x-3">
						<FieldLabel htmlFor={field.name}>
							{getFilterLabel(fieldName)}
						</FieldLabel>
						<FieldDescription>{field.value} Hours</FieldDescription>
					</div>
					<Slider
						value={field.value as number}
						onValueChange={(value) => {
							field.onChange(Array.isArray(value) ? value[0] : value);
						}}
						aria-label="Duration Range Slider"
						max={maxDuration}
						min={minDuration}
					>
						<SliderThumb />
					</Slider>
				</div>
				{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
			</Field>
		);
	}

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
		return Array.isArray(field.value) && field.value?.includes(iataCode.value);
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
