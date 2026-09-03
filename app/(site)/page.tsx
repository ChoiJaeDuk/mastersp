/**
 * 메인 페이지 (Server Component)
 * 원본 구성: 메인비주얼 → 인트로 이미지 → Innovation → Together
 */
import HeroIntro from '@/components/main/HeroIntro';
import InnovationSection from '@/components/main/InnovationSection';
import TogetherSection from '@/components/main/TogetherSection';

export default function Home() {
  return (
    // overflow-hidden 은 하위 sticky 동작을 깨뜨리므로 clip 을 사용한다.
    <main id="contents" className="overflow-x-clip">
      <h1 className="sr-only">(주)장인의공간 - Energy is Our Life</h1>

      <HeroIntro />
      <InnovationSection />
      <TogetherSection />
    </main>
  );
}
