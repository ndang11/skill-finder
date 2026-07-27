// components/ui/Textarea.tsx
"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	error?: string;
	label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, label, error, id, ...props }, ref) => {
		const textareaId = id || props.name;
		return (
			<div className="w-full space-y-1.5">
				{label && (
					<label
						htmlFor={textareaId}
						className="text-sm font-medium text-gray-700 tracking-wide block"
					>
						{label}
					</label>
				)}
				<textarea
					id={textareaId}
					ref={ref}
					className={cn(
						"flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
						error && "border-red-500 focus:border-red-500 focus:ring-red-100",
						className,
					)}
					{...props}
				/>
				{error && (
					<p className="text-xs font-medium text-red-500 transition-all animate-in fade-in-50">
						{error}
					</p>
				)}
			</div>
		);
	},
);
Textarea.displayName = "Textarea";
