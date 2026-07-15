// components/ui/Button.tsx
"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

export interface BaseButtonProps {
	variant?: "primary" | "secondary" | "outline";
	className?: string;
	children?: React.ReactNode;
}

export type ButtonProps =
	| (BaseButtonProps & {
			href: string;
	  } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
	| (BaseButtonProps & {
			href?: never;
	  } & React.ButtonHTMLAttributes<HTMLButtonElement>);

export const Button = React.forwardRef<
	HTMLAnchorElement | HTMLButtonElement,
	ButtonProps
>((props, ref) => {
	const { className, variant = "primary", ...rest } = props;
	const sharedClasses = cn(
		"inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all outline-none focus:ring-4 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99] h-12 px-6 py-3 w-full",
		variant === "primary" &&
			"bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-100",
		variant === "secondary" &&
			"bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-200",
		variant === "outline" &&
			"border border-gray-200 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-100",
		className,
	);

	if ("href" in rest && rest.href) {
		const { href, ...anchorProps } =
			rest as React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
		return (
			<a
				href={href}
				ref={ref as React.Ref<HTMLAnchorElement>}
				className={sharedClasses}
				{...anchorProps}
			/>
		);
	}

	const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
	return (
		<button
			className={sharedClasses}
			ref={ref as React.Ref<HTMLButtonElement>}
			{...buttonProps}
		/>
	);
});
Button.displayName = "Button";
