"use client";

import type * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { Check, Minus } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";

import { cn } from "~/lib/utils";

// Define the variants for the Checkbox using cva.
const checkboxVariants = cva(
	`
    group peer bg-background shrink-0 border ring-offset-background focus-visible:outline-none 
    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 
    aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20
    [[data-invalid=true]_&]:border-destructive/60 [[data-invalid=true]_&]:ring-destructive/10  dark:[[data-invalid=true]_&]:border-destructive dark:[[data-invalid=true]_&]:ring-destructive/20,
    data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-primary-foreground
    `,
	{
		variants: {
			variant: {
				default: "rounded-md border border-input",
				technical:
					"rounded-technical border bg-background data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground focus-visible:ring-primary/30",
				terminal:
					"rounded-technical border bg-foreground data-[state=checked]:bg-accent data-[state=checked]:border-accent data-[state=checked]:text-accent-foreground focus-visible:ring-accent/30",
			},
			size: {
				sm: "size-4.5 [&_svg]:size-3",
				md: "size-5 [&_svg]:size-3.5",
				lg: "size-5.5 [&_svg]:size-4",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
);

function Checkbox({
	className,
	size,
	variant,
	...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> &
	VariantProps<typeof checkboxVariants>) {
	return (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			className={cn(checkboxVariants({ size, variant }), className)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				className={cn("flex items-center justify-center text-current")}
			>
				<Check className="group-data-[state=indeterminate]:hidden" />
				<Minus className="hidden group-data-[state=indeterminate]:block" />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };
