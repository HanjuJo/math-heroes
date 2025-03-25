export const dynamic = 'force-static';

export async function generateStaticParams() {
  return [];
}

export default function RecommendationsPage() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="refresh" content="0;url=/math-heroes/recommendations/1/textbook" />
        <title>리디렉션 중...</title>
      </head>
      <body>
        <p>
          <a href="/math-heroes/recommendations/1/textbook">
            리디렉션 중입니다. 자동으로 이동하지 않는 경우 여기를 클릭하세요.
          </a>
        </p>
      </body>
    </html>
  );
} 