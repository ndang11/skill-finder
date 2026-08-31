// components/ui/Skeleton.tsx
"use client";

import { cn } from "@/utils/cn";

export function Skeleton({ className }: { className?: string }) {
	return (
		<div className={cn("animate-pulse rounded-lg bg-gray-200", className)} />
	);
}

export function PostCardSkeleton() {
	return (
		<div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
			{/* Header */}
			<div className="flex items-center gap-3">
				<Skeleton className="h-11 w-11 rounded-full" />
				<div className="space-y-2 flex-1">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-3 w-48" />
				</div>
				<Skeleton className="h-8 w-24 rounded-full" />
			</div>
			{/* Content */}
			<div className="space-y-2">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-3/4" />
			</div>
			{/* Image */}
			<Skeleton className="h-52 w-full rounded-xl" />
			{/* Actions */}
			<div className="flex items-center gap-4 pt-1">
				<Skeleton className="h-8 w-20 rounded-full" />
				<Skeleton className="h-8 w-24 rounded-full" />
				<div className="ml-auto">
					<Skeleton className="h-9 w-36 rounded-xl" />
				</div>
			</div>
		</div>
	);
}
