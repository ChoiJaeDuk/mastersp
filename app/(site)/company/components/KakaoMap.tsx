'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * 카카오맵 (원본 kor/company/company.html 하단 스크립트)
 *
 * 원본은 dapi.kakao.com SDK 를 <script> 로 직접 싣고 .map 엘리먼트마다 지도를 그린다.
 * 여기서는 같은 좌표 · 같은 마커 이미지 · 같은 커스텀 오버레이로 재현하되,
 * 앱 키는 소스에 박지 않고 NEXT_PUBLIC_KAKAO_MAP_KEY 환경 변수에서 읽는다.
 *
 * ※ 카카오 앱 키는 도메인 등록이 필요하다. 등록되지 않은 도메인에서는 지도가 뜨지 않으므로
 *   이 컴포넌트는 실패 시 안내 문구를 남긴다.
 */

/** 원본 좌표 (본사) */
const CENTER = { lat: 35.0247136450029, lng: 126.78188135332 };
const MARKER_TEXT = '장인의 공간';

type KakaoMapsNamespace = {
  load: (callback: () => void) => void;
  LatLng: new (lat: number, lng: number) => unknown;
  Map: new (container: HTMLElement, options: Record<string, unknown>) => unknown;
  Marker: new (options: Record<string, unknown>) => { setMap: (map: unknown) => void };
  MarkerImage: new (src: string, size: unknown, options: unknown) => unknown;
  Size: new (width: number, height: number) => unknown;
  Point: new (x: number, y: number) => unknown;
  CustomOverlay: new (options: Record<string, unknown>) => { setMap: (map: unknown) => void };
};

declare global {
  interface Window {
    kakao?: { maps: KakaoMapsNamespace };
  }
}

export default function KakaoMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

    if (!appKey) {
      console.warn('[map] NEXT_PUBLIC_KAKAO_MAP_KEY 가 설정되지 않아 지도를 표시하지 않습니다.');
      setFailed(true);
      return;
    }

    /** SDK 로드 후 원본과 동일한 순서로 지도 · 마커 · 오버레이를 만든다. */
    const draw = () => {
      const kakao = window.kakao;

      if (!kakao || !containerRef.current) return;

      kakao.maps.load(() => {
        const maps = kakao.maps;
        const position = new maps.LatLng(CENTER.lat, CENTER.lng);

        const map = new maps.Map(containerRef.current!, { center: position, level: 5 });

        const markerImage = new maps.MarkerImage(
          '/images/icon/marker.png',
          new maps.Size(40, 53),
          { offset: new maps.Point(20, 21) },
        );

        const marker = new maps.Marker({ position, image: markerImage });
        marker.setMap(map);

        const overlay = new maps.CustomOverlay({
          content: `<div class="customOverlay">${MARKER_TEXT}</div>`,
          position,
          yAnchor: 1.9,
        });
        overlay.setMap(map);
      });
    };

    if (window.kakao?.maps) {
      draw();
      return;
    }

    // 이미 삽입된 스크립트가 있으면 재사용한다. (React StrictMode 이중 실행 대비)
    const existing = document.querySelector<HTMLScriptElement>('script[data-kakao-map]');

    if (existing) {
      existing.addEventListener('load', draw);
      return () => existing.removeEventListener('load', draw);
    }

    const script = document.createElement('script');
    // 원본은 프로토콜 상대경로(//dapi.kakao.com)를 쓰지만 https 로 고정한다.
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;
    script.async = true;
    script.dataset.kakaoMap = 'true';
    script.addEventListener('load', draw);
    script.addEventListener('error', () => setFailed(true));
    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', draw);
    };
  }, []);

  return (
    <div ref={containerRef} className="map mt-10 bg-[#eee]">
      {failed ? (
        <p className="dec--04 flex h-full items-center justify-center text-[#999]">
          지도를 불러오지 못했습니다. 카카오 지도 앱 키(NEXT_PUBLIC_KAKAO_MAP_KEY)와 도메인 등록을
          확인해 주세요.
        </p>
      ) : null}
    </div>
  );
}
