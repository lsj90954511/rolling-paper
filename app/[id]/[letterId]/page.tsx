import LetterDetailPage from '@/components/LetterDetailPage';

export default async function Page({ params }: { params: Promise<{ id: string; letterId: string }> }) {
  const { id, letterId } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/rolling-paper?id=${id}`);
  const data = await res.json();

  return <LetterDetailPage data={data} targetLetterId={Number(letterId)} />;
}