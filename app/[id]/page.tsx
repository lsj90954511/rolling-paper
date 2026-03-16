import RollingPaperPageComponent from '@/components/RollingPaperPage';

export default async function RollingPaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/rolling-paper?id=${id}`);
  const data = await res.json();

  return <RollingPaperPageComponent data={data} />;
}