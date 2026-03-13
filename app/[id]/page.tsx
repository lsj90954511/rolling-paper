import RollingPaperPageComponent from '@/components/RollingPaperPage';

export default async function RollingPaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return <RollingPaperPageComponent />;
}