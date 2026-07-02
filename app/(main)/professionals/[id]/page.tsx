export default function ProfessionalProfilePage({
	params,
}: {
	params: { id: string };
}) {
	return <div>Professional: {params.id}</div>;
}
