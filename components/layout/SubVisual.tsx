import Reveal from '@/components/ui/Reveal';

/**
 * 서브페이지 상단 비주얼
 * 원본: kor/include/sub-visual.html ~ sub-visual04.html
 *
 * 원본은 제목 길이에 따라 클래스를 바꿔 4가지로 쓴다.
 *   sub-visual.html   : 기본            (10.625rem)
 *   sub-visual02.html : 기본            (10.625rem)  ※ 2뎁스 제목을 쓰는 것만 다름
 *   sub-visual03.html : .small-title    (8.125rem)
 *   sub-visual04.html : .small-title2   (6.25rem)
 */
export type SubVisualSize = 'default' | 'small' | 'small2';

const SIZE_CLASS: Record<SubVisualSize, string> = {
  default: '',
  small: ' small-title',
  small2: ' small-title2',
};

export default function SubVisual({
  titleEn,
  size = 'default',
}: {
  /** 원본 arr_data.php 의 $nav_N_en (영문 타이틀) */
  titleEn: string;
  size?: SubVisualSize;
}) {
  return (
    <div className="sub-visual">
      <div className="sub-container">
        <Reveal>
          <h1 className={`sub-visual__title${SIZE_CLASS[size]}`}>
            <span>{titleEn}</span>
          </h1>
        </Reveal>
      </div>
    </div>
  );
}
