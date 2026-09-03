import Reveal from '@/components/ui/Reveal';

type SubVisualProps = {
  /** 영문 타이틀 (원본 .sub-visual__title) */
  titleEn: string;
  /** 국문 보조 문구 */
  titleKo?: string;
};

/**
 * 서브페이지 상단 비주얼 (Server Component)
 * 원본: kor/include/sub-visual.html
 */
export default function SubVisual({ titleEn, titleKo }: SubVisualProps) {
  return (
    <div className="bg-[#f5f5f5] pt-30 pb-12 lg:pt-45 lg:pb-20">
      <div className="site-container">
        <Reveal>
          <h1 className="t-title-lg font-display font-black text-ink">
            <span className="tri-deco">{titleEn}</span>
          </h1>
          {titleKo ? <p className="t-dec-03 mt-3 text-shell">{titleKo}</p> : null}
        </Reveal>
      </div>
    </div>
  );
}
