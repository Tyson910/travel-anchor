import React from "react";

import { cn } from "~/lib/utils";

const Card = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		variant?: "default" | "technical" | "blueprint" | "module";
		size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
	}
>(({ className, variant = "default", size = "md", ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"border bg-card text-card-foreground transition-all duration-200",
			variant === "default" && "rounded-lg shadow-sm",
			variant === "technical" &&
				"rounded-xs border shadow-sm bg-background hover:border-border/80 hover:shadow-md",
			variant === "blueprint" &&
				"rounded-sm border shadow-md bg-background relative overflow-hidden hover:border-border/80 hover:shadow-lg",
			variant === "module" &&
				"rounded-md border shadow-md bg-background hover:border-border/80 hover:shadow-lg",
			size === "xs" && "p-3",
			size === "sm" && "p-4",
			size === "md" && "p-6",
			size === "lg" && "p-8",
			size === "xl" && "p-10",
			size === "2xl" && "p-12",
			className,
		)}
		data-variant={variant}
		data-size={size}
		{...props}
	/>
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex flex-col space-y-1.5 p-6", className)}
		{...props}
	/>
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement> & {
		technical?: boolean;
		size?: "sm" | "md" | "lg" | "xl";
	}
>(({ className, technical = false, size = "md", ...props }, ref) => (
	<h3
		ref={ref}
		className={cn(
			"font-semibold leading-none tracking-tight",
			technical && "font-sans tracking-tight text-foreground",
			size === "sm" && "text-lg",
			size === "md" && "text-xl",
			size === "lg" && "text-2xl",
			size === "xl" && "text-3xl",
			!size && "text-2xl",
			className,
		)}
		{...props}
	/>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement> & {
		technical?: boolean;
	}
>(({ className, technical = false, ...props }, ref) => (
	<p
		ref={ref}
		className={cn(
			"text-sm text-muted-foreground",
			technical &&
				"font-sans font-light text-xs tracking-tighter text-muted-foreground uppercase",
			className,
		)}
		{...props}
	/>
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex items-center p-6 pt-0", className)}
		{...props}
	/>
));
CardFooter.displayName = "CardFooter";

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardDescription,
	CardContent,
};
