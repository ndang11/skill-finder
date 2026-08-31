// components/ui/Input.tsx
"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: string;
	label?: string;
	endAdornment?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, label, error, endAdornment, id, ...props }, ref) => {
		const inputId = id || props.name;
		return (
			<div className="w-full space-y-1.5">
				{label && (
					<label
						htmlFor={inputId}
						className="text-sm font-medium text-gray-700 tracking-wide block"
					>
						{label}
					</label>
				)}
				<div className="relative">
					<input
						id={inputId}
						type={type}
						className={cn(
							"flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50",
							endAdornment && "pr-10",
							error && "border-red-500 focus:border-red-500 focus:ring-red-100",
							className,
						)}
						ref={ref}
						{...props}
					/>
					{endAdornment && (
						<div className="absolute right-0 top-0 h-full flex items-center pr-3 text-gray-400">
							{endAdornment}
						</div>
					)}
				</div>
				{error && (
					<p className="text-xs font-medium text-red-500 transition-all animate-in fade-in-50">
						{error}
					</p>
				)}
			</div>
		);
	},
);
Input.displayName = "Input";
