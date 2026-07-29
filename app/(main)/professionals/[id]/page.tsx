export default async function ProfessionalProfilePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <div>Professional: {id}</div>;
}
