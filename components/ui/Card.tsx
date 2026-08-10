// components/ui/Card.tsx
import { cn } from "@/utils/cn";

export default function Card({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement> & {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div
			className={cn(
				"rounded-2xl border border-gray-200 bg-white p-6 shadow-sm",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
