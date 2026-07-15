import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardTopBar from "@/components/layout/DashboardTopBar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen bg-gray-50/50">
			<DashboardSidebar />
			<main className="flex-1 md:ml-64 flex flex-col">
				<DashboardTopBar />
				<div className="mx-auto max-w-7xl p-6 lg:p-10 w-full flex-1">
					{children}
				</div>
			</main>
		</div>
	);
}
