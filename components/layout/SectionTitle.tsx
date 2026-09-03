import Reveal from '@/components/ui/Reveal';

/**
 * 서브페이지 섹션 제목 (원본 .sub-title-bx)
 *
 * 작은 분류 라벨(.title) + 큰 제목(.info--title) 조합이다.
 */
export default function SectionTitle({
  label,
  title,
  className = '',
}: {
  label: string;
  title: string;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <p className="text-[0.9375rem] font-semibold tracking-wide text-brand">{label}</p>
      <p className="t-info-title mt-3 font-display font-bold whitespace-pre-line text-ink">
        {title}
      </p>
    </Reveal>
  );
}
