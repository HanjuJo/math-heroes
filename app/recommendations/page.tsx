export const dynamic = 'force-static';

export async function generateStaticParams() {
  return [];
}

export default function RecommendationsPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0;url=/recommendations/1/textbook" />
      <link rel="canonical" href="/recommendations/1/textbook" />
    </>
  );
} 