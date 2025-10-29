"use client";

import type * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "#src/lib/utils.ts";

const dialogContentVariants = cva(
	"flex flex-col fixed outline-0 z-50 border bg-background p-6 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
	{
		variants: {
			variant: {
				default:
					"left-[50%] top-[50%] max-w-lg translate-x-[-50%] translate-y-[-50%] w-full border-border shadow-lg shadow-black/5 sm:rounded-lg",
				technical:
					"left-[50%] top-[50%] max-w-2xl translate-x-[-50%] translate-y-[-50%] w-full border bg-background shadow-container rounded-module",
				terminal:
					"left-[50%] top-[50%] max-w-4xl translate-x-[-50%] translate-y-[-50%] w-full border bg-foreground text-background shadow-container rounded-technical",
				module:
					"left-[50%] top-[50%] max-w-6xl translate-x-[-50%] translate-y-[-50%] w-full border bg-background shadow-container rounded-container",
				fullscreen:
					"inset-5 border-border shadow-lg shadow-black/5 sm:rounded-lg",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Dialog({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
	className,
	variant = "default",
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay> & {
	variant?: "default" | "technical" | "terminal" | "module" | "fullscreen";
}) {
	return (
		<DialogPrimitive.Overlay
			data-slot="dialog-overlay"
			className={cn(
				"fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
				variant === "default" && "bg-black/30 [backdrop-filter:blur(4px)]",
				variant === "technical" &&
					"bg-foreground/40 [backdrop-filter:blur(8px)]",
				variant === "terminal" &&
					"bg-foreground/60 [backdrop-filter:blur(2px)]",
				variant === "module" && "bg-foreground/20 [backdrop-filter:blur(12px)]",
				variant === "fullscreen" && "bg-black/30 [backdrop-filter:blur(4px)]",
				className,
			)}
			{...props}
		/>
	);
}

function DialogContent({
	className,
	children,
	showCloseButton = true,
	overlay = true,
	variant = "default",
	...props
}: React.ComponentProps<typeof DialogPrimitive.Content> &
	VariantProps<typeof dialogContentVariants> & {
		showCloseButton?: boolean;
		overlay?: boolean;
	}) {
	return (
		<DialogPortal>
			{overlay && <DialogOverlay variant={variant ?? "default"} />}
			<DialogPrimitive.Content
				data-slot="dialog-content"
				className={cn(dialogContentVariants({ variant }), className)}
				{...props}
			>
				{children}
				{showCloseButton && (
					<DialogClose
						className={cn(
							"cursor-pointer outline-0 absolute end-5 top-5 transition-opacity hover:opacity-100 focus:outline-hidden disabled:pointer-events-none",
							variant === "default" &&
								"rounded-sm opacity-60 ring-offset-background data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
							variant === "technical" &&
								"rounded-technical opacity-70 bg-muted/20 hover:bg-muted/40 text-muted-foreground hover:text-foreground",
							variant === "terminal" &&
								"rounded-technical opacity-70 bg-muted/20 hover:bg-muted/40 text-background",
							variant === "module" &&
								"rounded-module opacity-70 bg-muted/20 hover:bg-muted/40 text-muted-foreground hover:text-foreground",
						)}
					>
						<X className="size-4" />
						<span className="sr-only">Close</span>
					</DialogClose>
				)}
			</DialogPrimitive.Content>
		</DialogPortal>
	);
}

export default DialogContent;

const DialogHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		data-slot="dialog-header"
		className={cn(
			"flex flex-col space-y-1 text-center sm:text-start mb-5",
			className,
		)}
		{...props}
	/>
);

const DialogFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		data-slot="dialog-footer"
		className={cn(
			"flex flex-col-reverse sm:flex-row sm:justify-end pt-5 sm:space-x-2.5",
			className,
		)}
		{...props}
	/>
);

function DialogTitle({
	className,
	variant,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Title> & {
	variant?: "default" | "technical" | "terminal" | "module";
}) {
	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			className={cn(
				"text-lg font-semibold font-sans leading-none tracking-tight",
				variant === "technical" && "font-medium tracking-tight text-foreground",
				variant === "terminal" &&
					"font-light tracking-tighter text-background uppercase",
				variant === "module" && "font-semibold tracking-tight text-foreground",
				className,
			)}
			{...props}
		/>
	);
}

const DialogBody = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div data-slot="dialog-body" className={cn("grow", className)} {...props} />
);

function DialogDescription({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogBody,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
