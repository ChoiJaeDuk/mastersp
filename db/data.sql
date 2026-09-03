-- =====================================================================
-- 레거시 MySQL(masterspace_co_kr) 에서 옮긴 실데이터  (대상: MySQL)
-- 생성 : 2026-09-03T07:13:29.732Z  (scripts/migrate-legacy.mjs)
-- 국문(lantype=1) 데이터만 옮긴다. 다시 실행하려면 아래 DELETE 부터 수행된다.
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;

-- 재실행 대비 초기화 (참조 순서대로)
DELETE FROM TBL_HP_PROJECT;
DELETE FROM TBL_HP_PROJECT_CTG;
DELETE FROM TBL_HP_HISTORY;
DELETE FROM TBL_HP_INQUIRY;
DELETE FROM TBL_HP_TERM;

-- 연혁 (tb_history)
INSERT INTO TBL_HP_HISTORY (HIST_YR, HIST_MM, HIST_CTT, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2025', '08', '본사 이전 (나주)', 999, 'Y', 'migration');
INSERT INTO TBL_HP_HISTORY (HIST_YR, HIST_MM, HIST_CTT, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2025', '08', '광명지사 설립', 999, 'Y', 'migration');
INSERT INTO TBL_HP_HISTORY (HIST_YR, HIST_MM, HIST_CTT, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2024', '10', '대전 지사 설립', 999, 'Y', 'migration');
INSERT INTO TBL_HP_HISTORY (HIST_YR, HIST_MM, HIST_CTT, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2018', '01', '본사 이전 (광명)', 999, 'Y', 'migration');
INSERT INTO TBL_HP_HISTORY (HIST_YR, HIST_MM, HIST_CTT, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2017', '09', '나주 지사 설립', 999, 'Y', 'migration');
INSERT INTO TBL_HP_HISTORY (HIST_YR, HIST_MM, HIST_CTT, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2011', '07', '기업 부설연구소 설립', 999, 'Y', 'migration');
INSERT INTO TBL_HP_HISTORY (HIST_YR, HIST_MM, HIST_CTT, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2010', '01', '㈜장인의공간 법인 설립', 999, 'Y', 'migration');
INSERT INTO TBL_HP_HISTORY (HIST_YR, HIST_MM, HIST_CTT, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2007', '11', '장인의공간 창립', 999, 'Y', 'migration');

-- 수행과제 분류 (tb_category) — 레거시 cateno 를 CTG_SQNO 로 그대로 쓴다
INSERT INTO TBL_HP_PROJECT_CTG (CTG_SQNO, CTG_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES (4, '2023', 14, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT_CTG (CTG_SQNO, CTG_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES (3, '2022', 13, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT_CTG (CTG_SQNO, CTG_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES (2, '2021', 12, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT_CTG (CTG_SQNO, CTG_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES (1, '2020', 11, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT_CTG (CTG_SQNO, CTG_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES (11, '2019', 10, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT_CTG (CTG_SQNO, CTG_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES (12, '2018', 9, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT_CTG (CTG_SQNO, CTG_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES (13, '2017', 8, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT_CTG (CTG_SQNO, CTG_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES (14, '2016', 7, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT_CTG (CTG_SQNO, CTG_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES (15, '2015', 6, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT_CTG (CTG_SQNO, CTG_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES (16, '2014', 5, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT_CTG (CTG_SQNO, CTG_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES (17, '2013', 4, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT_CTG (CTG_SQNO, CTG_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES (18, '2012', 3, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT_CTG (CTG_SQNO, CTG_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES (19, '2011', 2, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT_CTG (CTG_SQNO, CTG_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES (27, '2010', 1, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT_CTG (CTG_SQNO, CTG_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES (28, '2009', 999, 'Y', 'migration');
-- (AUTO_INCREMENT 재설정은 아래 COMMIT 뒤에서 수행한다)

-- 수행과제 (tb_project)
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 4, '제주 실시간 가격결정시스템 구축 용역', '재생에너지 발전설비 비중이 증가함에 따라 재생에너지 실시간 발전예측량을 반영한 발전계획 수립하여 전력계통의 안정성 확보
시장원리에 따라 제주 발전자원의 적정 가치를 보상받을 수 있는 제주 실시간 및 예비력시장의 필요 시스템으로써 역할 수행', '2022-09-07', '2023-12-31', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 3, '전력시장 개편 관련 전력거래지원시스템(ETS) 개선 용역', '통합 운영발전계획(UC)시스템 유지관리', '2022-07-11', '2022-12-12', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 3, '통합 운영발전계획(UC)시스템 유지관리 위탁용역', '통합 운영발전계획(UC)시스템 유지관리', '2022-06-03', '2023-11-30', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 3, '발전계획입출력프로그램(RSCT) 유지관리', '발전계획 입출력프로그램(RSCT) 유지관리', '2022-05-26', '2023-05-25', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 2, '신규 전산모형 연계 시장분석 프로그램 개발', 'PLEXOS 및 PROMOD 데이터 분석 프로그램 개발
발전기별 기술적 특성, 비용자료, 발전계획 결과 입력 기능 구현
발전단 기반 발전기별·발전원별 emission량 산정 기능 구현', '2021-12-06', '2022-06-07', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 2, '2021년 전력시장종합분석시스템(MTAS) 유지보수 용역', '한국전력공사 전력시장분석시스템(MTAS) 유지보수(2021)', '2021-08-09', '2021-12-31', '한전KDN㈜', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 2, '발전계획입출력프로그램(RSCT) 개선 용역', '실계통기반 하루전시장 도입을 위한 RSCT 프로그램 개선
정보공개 편의성 향상을 위한 제약조건 통합관리 UI 개선
호기별 발전계획 수립을 위한 모델 변경 및 호기별 자료 연계', '2021-07-26', '2022-05-25', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 2, '입찰시스템 변경 관련 전력거래지원시스템(ETS) 개선 용역', '전력시장운영규칙 개정에 따른 전력거래지원시스템(ETS) 추가 개발
신규 입찰 항목 및 기술특성자료 입찰서 추가 기능 구현', '2021-07-01', '2021-10-01', '한국지역난방공사', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 2, '전력거래 통합 예측 시스템', '전력시장 통합 예측 시스템 구축 및 커스터마이징
장/단기 전력시장 예측 솔루션', '2021-06-09', '2021-10-07', '한국서부발전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 1, '통합 운영발전계획(UC)시스템 유지관리 위탁용역', '통합 운영발전계획(UC)시스템 유지관리', '2020-12-21', '2021-12-20', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 1, '新 전력시장 전망 시스템', '新 전력시장 전망 시스템 구축 및 커스터마이징
장/단기 전력시장 예측 솔루션', '2020-12-19', '2021-05-28', '한국동서발전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 1, '다종에너지 운영 최적화 모듈 개발', 'P2G 기반 다중 MG 전력거래 최적 운영 및 군집제어 시스템 개발
데이터 관리 및 분석 기능 통합 웹 어플리케이션 시스템 구현', '2020-10-15', '2022-02-15', '한국전력공사 전력연구원', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 1, '전력시장 모니터링 및 분석시스템 개발', '전력시장분석시스템(MTAS) 웹 시스템 재개발 및 통합 연계
전력시장 데이터 관리 시스템 및 모니터링 시스템 구축
예측오차 분석 시스템/제약비용분석 시스템 개발', '2020-08-31', '2021-11-30', '한국전력공사 전력연구원', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 1, '전력계통 안정도 검토 지원 프로그램 개발 사업', '계통해석 프로그램(PSS/E)과 연동되는 검토지원 프로그램 개발(Python)
조류계산 및 고장전류/상정고장 분석과 과도모의 자동화 기능 구현', '2020-08-31', '2021-08-30', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 1, '가격발전계획(RSC) 시뮬레이터 개발 용역', '시뮬레이션 수행을 위한 RSC 입력 파일 관리
최적화 및 참조계획 수립 자동화
시뮬레이션 결과 표본 비교 및 주요지표 레포트 생성', '2020-06-24', '2020-12-24', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 1, '차세대 전력시장예측시스템 유지관리 용역', '한국중부발전 차세대 전력시장예측시스템 유지관리', '2020-06-01', '2022-05-31', '한전KDN(주)', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 1, '전력거래 전망 프로그램(단기, 자동화) 구매 용역', '전력시장 단기 예측 솔루션
커스터마이징 설계(전력시장 종합 분석 시스템)
모의 결과 전력거래시스템 연동 기능 구현', '2020-05-22', '2020-11-23', '한국지역난방공사', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 1, '전력시장분석시스템(MTAS) 유지보수 용역', '한국전력공사 전력시장분석시스템(MTAS) 유지보수(2020)', '2020-05-18', '2020-12-31', '한전KDN(주)', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 11, '발전계획입출력프로그램(RSCT) 유지관리 위탁용역', '한국전력거래소 발전계획입출력프로그램(RSCT) 유지관리', '2019-11-25', '2020-11-24', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 11, '구역전기 용량요금 추가 전력거래시스템 개선 용역', '구역전기발전기 입찰 시행에 따른 입찰 및 정산 시스템 개발
중앙급전발전기 ERP 회계처리 고도화 및 전력거래시스템 연계 기능 개발
기타 전력거래시스템 디자인 개선 등 추가 기능 구현', '2019-11-27', '2020-05-26', '한국지역난방공사', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 11, '전력거래 시장가격 예측프로그램 개발 용역', '전력시장 장,단기 예측 솔루션
커스터마이징 설계(전력시장 종합 분석 시스템)', '2019-06-24', '2019-10-23', '한국수력원자력', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 11, '전력시장분석시스템(MTAS) 유지보수 용역', '한국전력공사 전력시장분석시스템(MTAS) 유지보수(2019)', '2019-05-10', '2019-12-31', '한전KDN(주)', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 11, '통합 운영발전계획시스템 구축 용역', '실시간 운영여건 변화에 따른 발전계획 계층화 및 순차적 수립을 위한 시스템 개발
주간발전계획(WAUC), 하루전발전계획(DAUC), 당일발전계획(OPUC), 실시간발전계획(RTUC), 예외처리발전계획(EXUC) 최적화 엔진 개발', '2018-09-14', '2020-09-13', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 12, '중앙급전발전기 비교계량데이터 취득용 통신장비 구매 설치 용역', '중앙급전발전기 비교계량데이터 취득용 통신 장비 구축
중앙급전발전기 비교계량데이터 Real-Time 취득 모듈 개발', '2018-10-10', '2018-11-23', '한국지역난방공사', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 12, 'EMS 동서해안 발전기 제약량 실시간 산정기능 구축 용역', '전력거래소에서 2017년 수행한『EMS 계통해석 기능을 활용한 동서해안 발전기 제약량 실시간 산정 자동화 방안 연구』연구과제의 전력계통운영시스템(EMS) 실제 적용
PSS/E 분석 엔진과 EMS 시스템을 실시간 연계하여 발전기 제약량 검토 및 활용 기능 구축
구축 시스템의 이중화 솔루션 도입 및 적용', '2018-06-19', '2018-12-18', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 12, '차세대 발전계획 및 전력시장예측시스템', '전력시장 장,단기 예측 솔루션
커스터마이징 설계(전력시장 종합 분석 시스템)', '2018-04-06', '2018-10-05', '한국남부발전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 12, '발전계획용 입출력 프로그램(RSCT) 성능 개선', '가격결정, 운영, 주간발전계획 입출력 프로그램 기능 통합 및 성능 개선
시장변화 대응을 위한 GT/ST, 수력/양수 분리 기능 추가', '2018-01-29', '2018-10-28', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 12, '통합발전계획 및 전력시장 분석용 시뮬레이터', 'M-Core 단기 GT/ST, 수력/양수 분리 모의 기능 개발
MSYS를 이용한 개별 GT/ST, 수력/양수 입찰데이터 생성 기능 개발
MSYS를 이용한 GT/ST, 수력/양수 분리 모의용 M-Core DB 생성 기능 개발', '2018-01-10', NULL, '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 13, '구역전기 회계처리 프로세스 추가를 위한 전력거래시스템 개선 용역', '전력거래시스템과 회계처리 시스템(ERP SAP) 연계 기능 개발
보안 정책에 따른 웹 서비스(REST) 서버 및 클라이언트 구축
전력거래시스템 기능 추가 및 개선', '2017-11-27', '2018-06-26', '한국지역난방공사', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 13, '차세대 발전운영 및 전력시장예측시스템', '전력시장 장,단기 예측 솔루션
커스터마이징 설계(전력시장 종합 분석 시스템)', '2017-02-22', '2017-06-23', '한국중부발전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 14, '도시 에너지공급 최적 설계 및 거래 모의 시뮬레이터 개발', '스마트 에너지 시티 구현을 위한 도시에너지 ''에너지공급계획 모의시스템'' 개발
스마트 에너지 시티의 에너지자원 거래를 위한 ''전력거래 모의 시스템'' 개발', '2016-10-26', '2019-04-25', '한국전력공사', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 14, '다채널 전력량계 사용자 및 관리자 인터페이스 개발', '실증단지에 구축된 다채널 전력량계 실효선 증대를 위한 UI개발
다채널 전력량계의 동작상태감시 및 계량데이터 취득을 위한 실시간 모니터링 프로그램 개발', '2016-05-09', '2016-07-15', '한국산업기술시험원', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 14, '수요반응 시장 참여 모델링 분석 연구', '국내 수요자원시장 분석
철도 전력부하의 경제성 분석
철도 전력부하 최적전략 도출
에너지저장장치 및 분산전원과의 효율적인 연계방안', '2016-05-01', '2016-09-30', '한국철도기술연구원', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 14, 'EMS 발전기 기동정지계획 시작품', 'EMS용 Advanced NA 개발', '2016-04-25', '2016-10-25', '한국전기연구원', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 14, 'KERI 공동연구 과제 모델링 및 감시 기능 개발', '발전계획 프로그램 성능 평가용 전력계통 모델링
전력계통 발전력/부하 배분기능
전력계통 운영 데이터 생성 기능
AGC/ED Application 평가 기능
AGC/ED Application 코드 인스펙션', '2016-04-20', '2016-12-20', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 14, '저압 배전계통의 선로정수 측정 및 재 산정', '시험 저압선로에 대한 선로정수 Lab test 수행
저압계통 운영실태 전산데이터 통계분석 Tool 개발', '2016-03-01', '2018-01-31', '한국산업기술시험원', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 14, '신뢰도 기반 송전철탑 열화평가 기술 개발', '철탑 가중치 부여를 위한 영향인자 분류 (열화도, 전력시스템 중요도, 환경요소)
철탑 유지보수 가중치 부여 알고리즘 개발
철탑 유지보수 가중치 부여 알고리즘 현장 적용 및 검증
제안된 유지보수 가중치 부여 알고리즘이 탑재된 Pseudo 프로그램 개발', '2016-02-22', '2017-01-21', '한전케이피에스㈜', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 15, '해외향 DMS 배전 시뮬레이터 MMI 위탁개발', '배전 계통 모의에 관련 된 (Man-Machine Interface) 개발', '2015-10-13', '2015-12-31', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 15, '장기운전이력 분석기능', 'ESS 제어 기능 보완
장기이력분석 기능 개발
장기이력분석을 위한 현장 사이트 지원', '2015-09-22', '2015-12-11', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 15, '전력거래지원시스템 권한별 기능 분리 개발', '전력거래지원시스템의 주요 기능을 사용자의 권한에 따라 별도록 사용할 수 있도록 기능 분리', '2015-08-04', '2015-10-02', '㈜평택에너지서비스', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 15, '상수관망 최적화 기능구현 및 테스트베드 검증', 'SCADA_PAS 상수관망 최적운영 Client화면과 MILP (Mixed Integer Linear Programming) 엔진 입출력과의 I/F 기능 구현
Oracle 이력DB, EPANET DB와 MILP엔진과의 I/F 기능 구현
EPANET과 MILP엔진과의 입출력 I/F 기능 구현
최적 펌프 ON-OFF 설계를 위한 MILP엔진 개발', '2015-07-16', '2015-12-15', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 15, '대규모 전력 시스템 어플리케이션의 안전성 확보를 위한 소프트웨어 테스팅 툴 개발', '전력 IT용 SW 개발과정에서 활용될 SW 신뢰성 및 알고리즘의 정확성을 테스팅 하는 SW를 개발', '2015-07-01', '2016-06-30', '중소기업청 구매조건부', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 15, 'SCADA-PAS플랫폼 통합 시스템 환경관리 도구개발', 'SCADA-PAS 플랫폼으로 시스템을 구성, 설치, 기동을 위한 다양한 설정 파일을 통합하고 관리하기 위한 기능을 제공
SCADA-PAS 플랫폼에서 시스템 설정항목의 추가/삭제/편집을 제공하고 필요한 시스템 설정값을 변경하는 기능을 제공', '2015-04-08', '2015-07-31', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 15, '주파수 조정용 EES 운영전략 수립', 'AGC/GF 기능 개발
배터리 출력 배분 기능 개발
배터리 모델링
PID 제어기 개발
배터리 열화를 반영한 배터리 운영 기능의 필요성', '2015-03-09', '2015-05-29', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 15, '역사 에너지 사용 경제성 평가 및 수요반응 대응 기능 개발', '부하 차단/복구 프로그램
철도부하의 ‘수요반응자원’으로의 경제성 및 가능성 분석', '2015-02-27', '2015-08-31', '한국철도기술연구원', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 15, '전력시장 종합분석시스템 MTAS 고도화용 패키지 SW 4종', '장/단기 DC-OPF
전력계통정보(PSS/E form)와 전력 시장정보 연계 및 통합', '2015-01-08', '2015-10-05', '한국전력공사', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 16, '상수관망 테스트베드 적용을 위한 최적화 모형개발', 'Target 계통에 제안한 알고리즘을 이용한 Prototype 프로그램 개발 및 검증
상수 관망 펌프 및 밸브 최적운영 프로그램 개발', '2014-11-07', '2015-03-30', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 16, '전력품질시스템 Migration', '전력품질 미터에서 수신된 데이터 변환 처리
전력품질 HMI S/W Active/X로 변환 개발', '2014-10-28', '2014-12-30', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 16, '전력거래지원시스템 구축 용역', '전력거래소 차세대시스템 구축과 연계하여 계량, 입찰, 정산에 최신기술이 적용된 최적의 시스템 구현
사용 편의성, 활용성 개선을 통한 사용자 친화적인 시스템 구축
정보보안 및 안정성이 확보된 시스템 구축', '2014-09-03', '2015-05-15', '한국지역난방공사', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 16, '시장연동 운영기능 개발', '주파수 조정 시장에 참여하는 대규모 ESS 의 주파수조정서비스에 대한 입찰/정산 결과 비교 및 리포트 기능 개발
병렬 연결된 다수의 ESS를 AGC 지령에 따라 최적 제어하는 알고리즘 개발', '2014-03-24', '2014-11-28', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 16, '운영시스템보완(ESS주파수 조정용 4MW 시스템개발)', 'LS의 변경된 플랫폼에 적합한 기동정지계획(UC), 경제급전(ED), 자동발전제어(AGC), 수요반응(DR)의 개발
설계문서 작성 및 기능시험 수행', '2014-02-26', '2014-05-09', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 16, '수용가용 PMS 기본운영기능 개발', '빌딩내 ESS 의 PMS 구축 (Load leveling ,Peak shaving,demand response 기능)', '2014-02-01', '2014-09-30', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 16, '이라크 DCC FAT 대응을 위한 OTS 기능개발', '이라크 OTS(Operation Training System) 개발 및 영문화', '2014-01-20', '2014-08-15', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 16, '차세대 EMS 과제에서 SAT 대응을 위한 시뮬레이터 기능 개발', '발전기 동적 모델의 증감발율 고려
주파수 취득 장치 time error 구축', '2014-01-20', '2014-08-15', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 17, 'SKE&amp;S IDSS M-Core 속도개선 프로젝트', '웹 기반의 발전계획 프로그램의 다중모의 기능 개발 및 모의속도 개선', '2013-09-01', '2013-12-31', 'SK E&amp;S', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 17, '풍력단지 풍황시뮬레이터 개발', '대규모 풍력단지를 구성하는 개별 풍력 발전기에 인입되는 시간별 유효풍속산출 시뮬레이터', '2013-09-01', '2014-08-31', '전북대', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 17, 'SK E&amp;S 전력거래지원시스템', '효율적인 전력거래업무를 위한 웹기반의 전력 운영 시스템 개발
전력거래소 시스템과 연계한 입찰 및 정산 업무 지원', '2013-07-01', '2013-11-30', 'SK E&amp;S', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 17, '이라크DCC 부하차단 및 모의용 부하생성 시나리오 기능 개발', '부하 차단 시스템 개발 (Peak shaving/Frequency tracking/Manual mode)
외부계통 모델링', '2013-06-18', '2014-02-18', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 17, '차세대 EMS UC 개발', '차세대 EMS에 포함될 발전계획 프로그램을 개발하고 관련 UI를 구현', '2013-05-06', '2013-08-05', '한국전기연구원', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 18, '전력시장 종합분석시스템툴', 'RSC 실행엔진 연동 모듈
KPX/PTS 실시간 데이터 연계 및 데이터 검증 기능
통합데이터 DB 및 UI 통합 관리', '2012-12-18', '2013-05-16', '한국전력공사', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 18, '차세대 EMS DTS용 특수발전기 및 특수설비 기능 개발', '태양광/풍력/디젤/양수 발전기 동적 모델링 및 구현
수력 발전기 모델 수정
SPS 시스템', '2012-10-01', '2013-05-31', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 18, '발전자원 가정산 및 전력시장 통합입찰 기능개발', '마이크로그리드의 발전자원의 가정산 기능 개발
일일전 시장의 발전자원 입찰 기능 개발', '2012-07-01', '2012-09-30', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 18, '실시간 에너지 저장장치 최적운영기능 개발', '마이크로그리드 내에서 배터리와 축열조를 고려한 실시간 운영계획(ED 및 AGC) 수립', '2012-06-01', '2012-10-31', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 18, '전력거래시스템 시나리오 기획 및 UI 디자인', '실시간 전력수요자원 운영시스템의 시나리오 기획
관련 UI 설계 및 디자인', '2011-03-14', '2011-07-13', '벽산파워', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 18, '전력수요자원 거래시스템의 사용자 및 관리자를 위한 DR-UI 프로그램 개발', '웹기반의 일일전 시장 최적화를 위한 입출력 관리 프로그램 개발', '2012-02-01', '2012-03-31', '벽산파워', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 19, 'Smart renewable 저장장치 최적운영 모델', '제주 실증단지에서 운용되는 renewable 설비의 최적 운영을 위한 엔진 개발', '2010-11-01', '2011-04-30', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 19, '최적 의사결정 지원 시스템 구축 (IDSS)', '최적 의사결정 지원 시스템 중 SMP 예측 시스템 개발
SK E&amp;S의 요구사항을 반영한 Web 기반의 발전계획 프로그램 구축', '2011-10-01', '2012-05-31', 'SK E&amp;S', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 19, '보급형 에너지 저장장치 최적운영 계획 개발', '마이크로그리드 내에서 배터리와 축열조를 고려한 최적운영계획 수립
상용최적화 솔버 및 공개최적화 솔버를 이용한 최적운용계획 개발', '2011-08-22', '2011-11-30', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 19, 'ADR 컴포넌트 모듈을 포함한 LA클라이언트 개발', 'LA사업자용 DR프로그램 연동 시스템 시나리오 기획 및 관련 UI 디자인
LA 클라이언트 개발', '2011-05-16', '2011-08-31', '벽산파워', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 19, 'CBL 데이터 수집 및 분석 시스템 개발', '실시간 전력수요자원 운영시스템과 연계된 CBL 계산 및 분석 시스템 기획
다양한 CBL 계산 방법 적용 및 CBL 계산 방법 차이에 따른 DR 효과 분석', '2011-05-16', '2011-08-31', '벽산파워', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 19, 'Smart Grid 실증단지 사업추진을 위한 가상전력 시장설계', '제주 실증단지의 일일전 시장 설계
일일전 시장 운영을 위한 최적화 엔진 개발', '2010-04-01', '2012-03-31', '한국전기연구원', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 27, 'TAG DB 관리 프로그램', 'TAG DB관리 프로그램 개발', '2010-10-01', '2010-12-31', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 27, '열병합 최적 발전계획 솔루션 개발', '마이크로그리드 내에서 발전설비와 열생산설비를 고려한 최적의 UC 수립
비용최소화와 네트웍 연계를 고려한 이익극대화 모듈 제공
관련 UI 설계', '2010-08-01', '2011-01-31', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 27, '한국지역난방공사 통합운영시스템 구축', '전력시장의 발전량과 SMP 예측을 위한 최적화 엔진 개발
사용자의 편의를 고려한 web 기반의 UI 개발', '2010-04-15', '2010-08-30', '한국지역난방공사', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 27, 'TOC연계 전력시장 최적화 기능장치 개발', '제주 실증단지 시장을 고려한 최적화 엔진 개발', '2010-02-01', '2011-05-15', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 28, '한국지역난방공사 통합운영시스템 경제운전/정보제공시스템 개발', '시나리오 동시 수행 기능 등 사용자의 요구조건을 반영한 customizing 제공', '2009-11-10', '2010-08-25', '한국지역난방공사', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 28, '한국 전력시장형 발전계획/거래분석 통합 전산모형 개발', '수요예측과 연계된 발전계획 프로그램 개발
SUDP 기반의 장기모형과 MIP 기반의 단기모형 제공', '2009-10-01', '2010-09-30', '한국남부발전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 28, '전력수급 종합시스템 개선', 'HITES 개발
월 ~ 연간발전계획을 수립하여 연료사용량과 발전비용 예측
예비력을 고려하여 예방정비계획을 수정할 수 있는 기원 지능', '2009-03-26', '2009-09-25', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 28, '마이크로그리드 경제급전 및 자동제어 운영 알고리즘 개발', '마이크로그리드 내에서 전기수요와 열수요를 고려한 최적의 자원 배분
기간을 설정하여 자동으로 ED가 수행됨
발전비용 최소화와 네트웍 연계를 고려한 이익극대화 모듈이 옵션으로 반영', '2009-02-17', '2009-08-15', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('1', 28, '마이크로그리드 경제급전 운영화면 제작', '마이크로그리드 운영시스템에서 경제급전 부분의 화면 개발', '2009-02-16', '2009-08-15', 'LS산전', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 2, '(남부발전) LNG 인수기지 건설사업 타당성조사 용역', 'LNG 인수기지 건설 타당성 조사 - 전력시장 시뮬레이션', '2021-09-01', '2022-02-28', '안진회계법인', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 3, '액화천연가스 저장설비 건설사업 타당성조사 용역 중 전력시장 분석', '액화천연가스 저장설비 건설사업 타당성 조사 - 전력시장 시뮬레이션', '2022-06-15', '2023-03-04', '벽산엔지니어링㈜', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 3, '국내 전력시장 분석방안 자문', '국내 전력시장 분석방안 자문', '2022-04-25', '2022-05-20', '한국남부발전㈜', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 3, '석탄대체 LNG복합 건설사업 타당성조사 용역을 위한 전력시장분석 기술자문', 'LNG복합 건설사업 타당성 조사 - 전력시장 시뮬레이션', '2022-04-06', '2022-12-31', '한국전력기술㈜', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 2, '신규전원 지점조사 및 예비타당성조사 용역을 위한 전력시장 분석', '신규전원 지점조사 및 예비 타당성 조사 - 전력시장 시뮬레이션', '2021-06-01', '2021-12-28', '한국전력기술㈜', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 2, '장기운전 복합발전 가스터빈 Upgrade 타당성조사 용역을 위한 전력시장 분석 및 시뮬레이션', '발전기 건설 타당성 조사 - 전력시장 시뮬레이션', NULL, '2021-03-12', '한국전력기술㈜', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 1, '보령 5,6호기 LNG 대체건설 타당성 조사를 위한 전력시장 분석', '발전기 건설 타당성 조사 - 전력시장 시뮬레이션', '2020-06-29', '2021-10-31', '한국전력기술㈜', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 1, 'LNG 인수기지 건설사업 타당성조사 전력시장 분석 용역', 'LNG 인수기지 건설사업 타당성조사 및 연구', '2020-02-01', '2020-05-31', '벽산엔지니어링(주)', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 11, '신재생 전원확대와 전력계통 안정화를 위한 RMS 기술개발', '전력계통 안정화를 위한 신재생 전원 출력예측, 계통 평가 및 해석, 제어시스템 등 통합제어관리시스템(RMS) 기술 개발', '2019-12-01', '2024-11-30', '에너지기술평가원', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 11, '재생에너지 증가에 따른 신시장제도 도입 방안 연구용역', '재생에너지 증가에 관련한 신시장제도 도입 방안 연구 및 분석', '2019-10-04', '2020-06-03', '한국전력공사', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 11, '신규 발전소 개발 지점조사 및 예비타당성조사 용역-경제성검토 3건', '신규 발전소 개발 지점조사 및 예비타당성조사 용역-전력시장 시뮬레이션', '2019-05-02', '2019-06-30', '(주)도화엔지니어링', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 11, '보령화력 발전사업 사업타당성조사 용역-전력시장시뮬레이션', '발전사업 사업타당성조사 - 전력시장시뮬레이션', '2019-04-12', '2019-09-30', '(주)도화엔지니어링', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 11, '울산기력 바이오증유 에너지전환 사업성분석평가 용역-전력수요공급량산정', '바이오증유 에너지전환 사업성분석평가 - 전력수요공급량산정', '2019-04-12', '2019-06-30', '(주)도화엔지니어링', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 11, '복합발전기의 조합별 특성을 전력시장에 적용하는 방안 및 영향분석에 관한 연구', '해외복합발전기 비용 모델링 방법 검토
국내에 적합한 복합발전기기의 비용 모델링 방법 검토
복합 발전기의 성능 시험방법 검토
가격결정계획과 운영발전계획에 복합 발전기 모델링 방법 제시
입찰방법 및 가격결정방법 제시', '2019-04-01', '2020-03-31', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 12, '국가간 전력망 연계시 전력계통시장 영향 및 대응방안 연구', '국가간 전력망 연계시 전력계통시장 영향 및 대응방안 연구', '2018-10-15', '2019-10-14', '고려대학교 산학협력단', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 12, '환경급전 방안 연구', '환경급전 방안 연구', '2018-07-01', '2019-06-30', '삼일회계', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 12, '수급계획의 신뢰성 제고를 위한 해외 전산모형 활용사례 조사 및 도입 타당성 연구', '해외 주요국 전력시장의 공급신뢰도 기준산정방법, 활용 프로그램, 수급계획 전산모형의 기능 및 적용사례 분석
국내 전력산업 환경 하에서의 적용 가능한 적정 모형 제시', '2017-07-05', '2018-10-04', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 13, '전력계통의 분산화를 감안한 전력시장의 가격기능 개선에 관한 연구', '해외 전력시장의 전일, 당일 및 실시간 전력시장 제도 조사
해외 사례 조사 결과와 국내 현황의 비교를 통해 전력계통의 분산화를 고려한 시사점을 도출
국내 실정에 적합한 실시간 및 전일시장의 연계 구조를 제안하고 시장 설계상의 고려요소를 제시', '2017-03-01', '2018-09-30', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 14, '온라인 운영발전계획시스템 개발전략 수립 연구', '운영발전계획프로그램 참조모델 및 운영현황분석
실시간 계통운영을 위한 운영발전계획 개선 방안 연구
차기 운영발전계획 업무절차 수립
차기 운영발전계획 시스템 구축방향 제안', '2016-06-17', '2016-12-16', '한국전력거래소(㈜LG CNS)', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 14, '양수발전 중장기 전원개발 방향 및 실행전략 연구', '국내외 전력수급 상황 및 전망분석
신재생에너지 발전패턴 분석
양수발전의 역할 및 가치분석
양수발전 경제성 분석방법 개발 및 모의
신재생에너지 발전패턴 분석', '2016-02-17', '2017-10-16', '한국수력원자력', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 14, '전력계통 영향 분석을 통한 집단에너지 열병합발전의 분산전원 역할', '계통 운영을 위해 필요한 최소한의 분산형 전원의 규모 검토
계통의 제약을 고려한 전원 mix 검토
계통의 기술적인 특성을 고려한 열병합 설비 용량의 검토
분산형 전원을 고려한 제도 개선 방향 검토', '2016-02-15', '2018-02-14', '한국집단에너지협회', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 15, '용인복합발전 사업타당성조사용역', '미래 전력시장 변수를 고려한 시나리오 생성 및 비용 및 정산금 분석을 통한 경제성 평가', '2015-03-19', '2015-04-30', '(주)도화엔지니어링', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 15, 'CBP체제에서의 계통운영보조서비스시장 도입에 관한 연구', '보조서비스시장 도입 타당성 검토
보조서비스시장 도입 방안 검토', '2015-03-17', '2016-03-16', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 15, '자원적정성 달성을 위한 용량보상 제도변경이 전력산업에 미치는 영향분석', '한국형 용량시장 기초설계(안) 제안
용량보상 제도변경(용량요금-&gt;용량시장)이 전력산업에 미치는 영향 분석
용량보상 제도변경(용량요금-&gt;용량시장)시 예상되는 문제점 파악, 해소대책 및 전환계획 제안', '2015-01-19', '2016-07-18', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 15, '분당복합 제1,2블럭 대체 건설타당성 조사-신규복합분', '전력시장 시뮬레이션 및 이용율 예측
신규 복합화력 이용율 예측 및 전력판매 수입 예측', '2015-01-05', '2015-06-30', '(주)도화엔지니어링', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 16, '전력시장규칙 개정에 따른 한국지역난방공사 발전사업 영향 분석', '전력시장규칙 개정에 따른 한국지역난방공사 발전사업 영향 분석', '2014-10-02', '2014-10-30', '숭실대학교 산학협력단', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 16, '분당복합 제1,2블럭 대체 건설타당성 조사', '전력시장 시뮬레이션 및 이용율 예측', '2014-06-01', '2014-09-30', '(주)도화엔지니어링', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 16, '전력시장 운영효율 향상을 위한 제약비용 감축방안 연구', '과거 정산금 실적을 이용한 제약비용의 발생원인 분석
제약비용 유발 요소들 간의 상관관계 분석
제약비용에 대한 지속적인 모니터링을 위한 시스템 구축 및 활용방안 제시', '2014-05-23', '2014-12-22', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 16, 'LG CNS 마이크로그리드 최적운전알고리즘 개발', 'LG CNS 마이크로그리드 최적운전알고리즘 개발', '2014-05-01', '2014-11-30', '서울대학교 산업시스템혁신연구소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 16, '불확실성을 고려한 한국형 발송전 건설계획 통합 최적 알고리즘 개발', '해외의 발·송전 통합계획 전산모형의 개요 및 특징 분석
국내에 적합한 발·송전 통합계획 전산모형 알고리즘 개발 및 실계통 적용 연구', '2014-03-27', '2015-03-26', '부산대학교', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 16, '수도권 미활용 열에너지 활용방안 연구(전력시장 분석)', '전력시장 시뮬레이션을 통해 인천 지역의 발전설비가 열병합 설비로 대체되는 경우 전력시장의 가격과 발전비용의 변화를 분석', '2014-03-26', '2014-04-30', '㈜한국지역난방기술', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 16, '효율적인 전력시장 운영을 위한 수요반응자원 적정용량 산정 및 제도개선 방안 연구', '국외 수요반응자원 잠재용량 산정 및 활용 방안 분석
국내 환경을 고려한 수요반응 잠재용량 산정지군 및 산정방법 수립
국내 전력시장 적용을 위한 수요반응자원의 잠재용량 및 적정용량 산정
수요반응 활성화를 위한 전력시장 제도개선 및 수급계획 연계 방안 도출', '2014-02-17', '2015-05-16', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 17, '최적 열연계용 경제운용 프로그램 연구개발(SMP 예측)', '회귀분석 및 시뮬레이션 기법을 통한 중기 SMP 예측
SMP 예측 기법 별 정확도 비교 분석', '2013-12-27', '2015-06-26', '한국지역난방공사((주)알엘케이)', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 17, '전력계통 주파수 조정용 ESS 운영시스템 및 전력시장제도 개발', 'ESS 보조서비스 거래를 위한 전력시장운영제도 및 보상방안 개발', '2013-06-01', '2016-05-31', '한국산업기술대학교 산학협력단', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 17, '탄소저감도시 EMS 엔진', '통합관제 어플리케이션 최적화엔진 알고리즘 시작품', '2013-03-06', '2013-05-31', '기초전력연구원', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 17, 'CBP 전력시장에서 수요자원 반영 방안에 관한 연구', '경제성 수요자원과 발전자원을 통한 CBP 시장 운영 방안 제안
현 신뢰도 수요자원과 경제성 수요자원의 통합 운영 방법 제안
수요자원의 감축량 및 보상에 대한 평가 방법 제안', '2013-03-04', '2013-05-31', '한국전력거래소', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 18, '영동 발전소 설비 투자에 관한 모의', '영동 발전소 6개 대안에 대해 전력시장 모의를 통해 수익성 분석', '2012-05-01', '2012-05-30', '에너지경제연구원', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 19, '양수 발전의 운영과 정산의 개선 방향 연구', '현행 양수 정산 방식의 타당성 검토
실제 CASE를 이용하여 양수 운영 실적과 최적화를 통한 양수 운영을 비교 검토
양수 발전의 입찰 및 정산 방법의 대안 제시', '2011-07-19', '2011-09-18', '민간발전협회', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 19, '해수담수화 최적 솔루션 개발', '해수 담수화 최적화 모델 개발
모의 운영을 위한 적절한 예제 개발', '2011-03-01', '2011-05-31', 'CompanyW', 999, 'Y', 'migration');
INSERT INTO TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, PRJ_NM, PRJ_CTT, BGNG_DE, END_DE, ORDR_NM, MENU_SEQO, USE_YN, LST_CHGR_EMPNO) VALUES ('2', 28, '전력시장에서 제한적 가격입찰 제도의 합리적 구현 방안 연구', '현 입찰제도의 특징 및 제한적 가격입찰제도의 도입 의의 분석
제한적 가격입찰제의 구체적 방법론 개발', '2009-04-01', '2010-01-31', '한국산업기술대학교 산학협력단', 999, 'Y', 'migration');

-- 고객문의 (tb_inquiry)
INSERT INTO TBL_HP_INQUIRY (INQ_FLD_NM, CO_NM, PSTN_NM, WRTR_NM, WRTR_TELNO, WRTR_EML, INQ_CTT, PRVC_AGRE_DT, PRCS_STS_CD, RPLY_CTT, RPLY_DT, FRST_REG_DT, LST_CHGR_EMPNO) VALUES ('제휴/협업 문의', 'Aquila/Constellation Software Inc.', '글로벌투자팀', '김현준', '010-2750-0696', 'HKim@aquilasw.com', '(레거시 폼에 문의내용 입력란이 없어 내용이 없습니다)', '2024-09-18T17:27:25.000Z', 'DONE', '&lt;p&gt;안녕하세요.&lt;/p&gt;
&lt;p&gt;장인의 공간입니다.&lt;/p&gt;
&lt;p&gt;&amp;nbsp;&lt;/p&gt;
&lt;p&gt;일전에 유선으로 연락드렸습니다.&lt;/p&gt;
&lt;p&gt;문의사항 있으시면 연락주세요 :)&lt;/p&gt;
&lt;p&gt;감사합니다.&lt;/p&gt;
', '2024-10-04 13:06:28', '2024-09-18T17:27:25.000Z', 'migration');
INSERT INTO TBL_HP_INQUIRY (INQ_FLD_NM, CO_NM, PSTN_NM, WRTR_NM, WRTR_TELNO, WRTR_EML, INQ_CTT, PRVC_AGRE_DT, PRCS_STS_CD, RPLY_CTT, RPLY_DT, FRST_REG_DT, LST_CHGR_EMPNO) VALUES ('M-CORE, M-CORES 제품소개자료 요청', '한전KDN(주)', '대리', '추연한', '010-2003-1646', 'choorod@naver.com', '(레거시 폼에 문의내용 입력란이 없어 내용이 없습니다)', '2024-10-29T17:16:46.000Z', 'DONE', '&lt;p&gt;안녕하세요.&lt;/p&gt;
&lt;p&gt;장인의 공간입니다.&lt;/p&gt;
&lt;p&gt;&amp;nbsp;&lt;/p&gt;
&lt;p&gt;요청주신 자료 메일로 보내드렸습니다.&lt;/p&gt;
&lt;p&gt;추후 문의사항 있으시면 연락 부탁드립니다.&lt;/p&gt;
&lt;p&gt;&amp;nbsp;&lt;/p&gt;
&lt;p&gt;감사합니다.&lt;/p&gt;
', '2025-07-22 11:33:35', '2024-10-29T17:16:46.000Z', 'migration');
INSERT INTO TBL_HP_INQUIRY (INQ_FLD_NM, CO_NM, PSTN_NM, WRTR_NM, WRTR_TELNO, WRTR_EML, INQ_CTT, PRVC_AGRE_DT, PRCS_STS_CD, RPLY_CTT, RPLY_DT, FRST_REG_DT, LST_CHGR_EMPNO) VALUES ('MCORES', 'GIST ', '대학원생', '박인영', '010-8030-9748', 'appledog97@gm.gist.ac.kr', '(레거시 폼에 문의내용 입력란이 없어 내용이 없습니다)', '2025-02-27T02:30:54.000Z', 'DONE', '&lt;p&gt;안녕하세요.&lt;/p&gt;
&lt;p&gt;장인의 공간입니다.&lt;/p&gt;
&lt;p&gt;&amp;nbsp;&lt;/p&gt;
&lt;p&gt;해당 내용 담당자에게 전달하여 메일드리도록 하겠습니다.&lt;/p&gt;
&lt;p&gt;감사합니다.&lt;/p&gt;
', '2025-03-07 09:56:50', '2025-02-27T02:30:54.000Z', 'migration');
INSERT INTO TBL_HP_INQUIRY (INQ_FLD_NM, CO_NM, PSTN_NM, WRTR_NM, WRTR_TELNO, WRTR_EML, INQ_CTT, PRVC_AGRE_DT, PRCS_STS_CD, RPLY_CTT, RPLY_DT, FRST_REG_DT, LST_CHGR_EMPNO) VALUES ('발전전망시스템 실무교육 교육 일정 질의드립니다.(5월, 10월 정확한 교육일정 질의)', '한국남부발전(주)', '대리', '이장원', '010-4951-6780', 'racooon@kospo.co.kr', '(레거시 폼에 문의내용 입력란이 없어 내용이 없습니다)', '2025-02-28T10:59:33.000Z', 'DONE', '안녕하세요.
&lt;p&gt;장인의 공간입니다.&lt;/p&gt;
&lt;p&gt;&amp;nbsp;&lt;/p&gt;
&lt;p&gt;해당 내용 담당자에게 전달하여 빠른 시일내에 연락드리겠습니다.&lt;/p&gt;
&lt;p&gt;&amp;nbsp;&lt;/p&gt;
&lt;p&gt;감사합니다.&lt;/p&gt;
', '2025-03-05 15:23:05', '2025-02-28T10:59:33.000Z', 'migration');
INSERT INTO TBL_HP_INQUIRY (INQ_FLD_NM, CO_NM, PSTN_NM, WRTR_NM, WRTR_TELNO, WRTR_EML, INQ_CTT, PRVC_AGRE_DT, PRCS_STS_CD, RPLY_CTT, RPLY_DT, FRST_REG_DT, LST_CHGR_EMPNO) VALUES ('장인의공간 M-Core 1식 (단기, 장기 각각)  견적', '(주)인코어드테크놀로지스', '매니저', '김상식', '010-9958-0830', 'sskim@encoredtech.com', '(레거시 폼에 문의내용 입력란이 없어 내용이 없습니다)', '2025-03-27T06:15:54.000Z', 'DONE', '&lt;p&gt;안녕하세요.&lt;/p&gt;
&lt;p&gt;장인의 공간입니다.&lt;/p&gt;
&lt;p&gt;&amp;nbsp;&lt;/p&gt;
&lt;p&gt;해당 내용 담당자에게 전달하여 추후 연락드리겠습니다.&lt;/p&gt;
&lt;p&gt;&amp;nbsp;&lt;/p&gt;
&lt;p&gt;감사합니다.&lt;/p&gt;
', '2025-03-31 15:17:30', '2025-03-27T06:15:54.000Z', 'migration');
INSERT INTO TBL_HP_INQUIRY (INQ_FLD_NM, CO_NM, PSTN_NM, WRTR_NM, WRTR_TELNO, WRTR_EML, INQ_CTT, PRVC_AGRE_DT, PRCS_STS_CD, RPLY_CTT, RPLY_DT, FRST_REG_DT, LST_CHGR_EMPNO) VALUES ('SMP 추정 프로그램 견적', 'OCI SE', '매니저', '정철민', '010-6894-6584', 'cmj@ocise.co.kr', '(레거시 폼에 문의내용 입력란이 없어 내용이 없습니다)', '2025-04-01T05:36:21.000Z', 'DONE', '&lt;p&gt;안녕하세요.&lt;/p&gt;
&lt;p&gt;장인의 공간입니다.&lt;/p&gt;
&lt;p&gt;&amp;nbsp;&lt;/p&gt;
&lt;p&gt;해당 내용 담당자에게 전달하여 빠르게 연락드리겠습니다.&lt;/p&gt;
&lt;p&gt;&amp;nbsp;&lt;/p&gt;
&lt;p&gt;감사합니다.&lt;/p&gt;
', '2025-04-07 16:53:39', '2025-04-01T05:36:21.000Z', 'migration');
INSERT INTO TBL_HP_INQUIRY (INQ_FLD_NM, CO_NM, PSTN_NM, WRTR_NM, WRTR_TELNO, WRTR_EML, INQ_CTT, PRVC_AGRE_DT, PRCS_STS_CD, RPLY_CTT, RPLY_DT, FRST_REG_DT, LST_CHGR_EMPNO) VALUES ('문의`', '회사명', '직함', '김지호', '010-2555-9742', 'zh0515@masterspace.co.kr', '(레거시 폼에 문의내용 입력란이 없어 내용이 없습니다)', '2026-02-23T01:59:04.000Z', 'RECV', NULL, NULL, '2026-02-23T01:59:04.000Z', 'migration');
INSERT INTO TBL_HP_INQUIRY (INQ_FLD_NM, CO_NM, PSTN_NM, WRTR_NM, WRTR_TELNO, WRTR_EML, INQ_CTT, PRVC_AGRE_DT, PRCS_STS_CD, RPLY_CTT, RPLY_DT, FRST_REG_DT, LST_CHGR_EMPNO) VALUES ('[M-CORES] 실시간 시장 도매시장 가격 모델링 가능여부 ', '광주과학기술원', '석사', '백승현', '010-4373-7678', 'tmdgus2776@gm.gist.ac.kr', '(레거시 폼에 문의내용 입력란이 없어 내용이 없습니다)', '2026-03-09T04:50:41.000Z', 'RECV', NULL, NULL, '2026-03-09T04:50:41.000Z', 'migration');
INSERT INTO TBL_HP_INQUIRY (INQ_FLD_NM, CO_NM, PSTN_NM, WRTR_NM, WRTR_TELNO, WRTR_EML, INQ_CTT, PRVC_AGRE_DT, PRCS_STS_CD, RPLY_CTT, RPLY_DT, FRST_REG_DT, LST_CHGR_EMPNO) VALUES ('bhCtpBXEOIbwXTNlHhaei', 'JYqjvYBHYmdfLeQncMQrKevY', 'okRPpubbuVJVLfVEscowH', 'wMFJADEZoHjllQPOShNRQt', '7340166226', 'e.r.ub.e.fuha.c.e31@gmail.com', '(레거시 폼에 문의내용 입력란이 없어 내용이 없습니다)', '2026-09-02T08:17:05.000Z', 'RECV', NULL, NULL, '2026-09-02T08:17:05.000Z', 'migration');

-- 약관 (tb_yark : 1=개인정보처리방침, 2=이용약관, 3=이메일무단수집거부)
INSERT INTO TBL_HP_TERM (TERM_KND_CD, TERM_CTT, USE_YN, LST_CHGR_EMPNO) VALUES ('PRIVACY', '''(주)장인의공간''은 (이하 ''회사''는) 고객님의 개인정보를 중요시하며, ''정보통신망 이용촉진 및 정보보호''에 관한 법률을 준수하고 있습니다.<br />
회사는 개인정보취급방침을 통하여 고객님께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.<br />
회사는 개인정보취급방침을 개정하는 경우 웹사이트 공지사항(또는 개별공지)을 통하여 공지할 것입니다.<br /><br />
■ 수집하는 개인정보 항목<br /><br />
회사는 회원가입, 상담, 서비스 신청 등등을 위해 아래와 같은 개인정보를 수집하고 있습니다.<br /><br />
ο 수집항목 : 이름 , 생년월일 , 성별 , 로그인ID , 비밀번호 , 비밀번호 질문과 답변 , 자택 전화번호 , 자택 주소 , 휴대전화번호 , 이메일 , 직업 , 회사명 , 부서 , 직책 , 회사전화번호 , 취미 , 결혼여부 , 기념일 , 법정대리인정보 , 주민등록번호 , 서비스 이용기록 , 접속 로그 , 접속 IP 정보 , 결제기록<br />
ο 개인정보 수집방법 : 홈페이지(회원가입) , 서면양식<br /><br />
■ 개인정보의 수집 및 이용목적<br /><br />
회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.<br /><br />
ο 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산 콘텐츠 제공 , 구매 및 요금 결제 , 물품배송 또는 청구지 등 발송<br />
ο 회원 관리<br />
회원제 서비스 이용에 따른 본인확인 , 개인 식별 , 연령확인 , 만14세 미만 아동 개인정보 수집 시 법정 대리인 동의여부 확인 , 고지사항 전달 ο 마케팅 및 광고에 활용<br />
접속 빈도 파악 또는 회원의 서비스 이용에 대한 통계<br /><br />
■ 개인정보의 보유 및 이용기간<br /><br />
회사는 개인정보 수집 및 이용목적이 달성된 후에는 예외 없이 해당 정보를 지체 없이 파기합니다.<br /><br />
■ 개인정보의 파기절차 및 방법<br /><br />
회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다. 파기절차 및 방법은 다음과 같습니다.<br /><br />
ο 파기절차<br />
회원님이 회원가입 등을 위해 입력하신 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기되어집니다.<br /><br />
별도 DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 보유되어지는 이외의 다른 목적으로 이용되지 않습니다.<br /><br />
ο 파기방법<br />
- 전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.<br /><br />
■ 개인정보 제공<br /><br />
회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.<br />
- 이용자들이 사전에 동의한 경우<br />
- 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우<br /><br />
■ 수집한 개인정보의 위탁<br /><br />
회사는 서비스 제공 및 향상을 위하여 아래와 같이 개인정보를 위탁하고 있으며, 관계 법령에 따라 위탁계약시 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고 있습니다.&nbsp;<br />
화사의 개인정보 수탁업체 및 위탁업무의 내용은 아래와 같습니다.&nbsp;<br /><br />
───────────────────────────────────<br />
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;수탁업체 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; : &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;위탁업무 내용<br />
───────────────────────────────────<br />
　　　　　　ⅩⅩ　　　　　: &nbsp;상품배송<br />
───────────────────────────────────<br />
　　　　　　ⅩⅩ　　　　　: &nbsp;결제, 구매안전서비스 제공등<br />
───────────────────────────────────<br />
　　　　　　ⅩⅩ　　　　　: &nbsp;실명확인, 본인인증<br />
───────────────────────────────────<br /><br /><br />
■ 이용자 및 법정대리인의 권리와 그 행사방법<br /><br />
이용자 및 법정 대리인은 언제든지 등록되어 있는 자신 혹은 당해 만 14세 미만 아동의 개인정보를 조회하거나 수정할 수 있으며 가입해지를 요청할 수도 있습니 다.<br />
이용자 혹은 만 14세 미만 아동의 개인정보 조회?수정을 위해서는 ‘개인정보변 경’(또는 ‘회원정보수정’ 등)을 가입해지(동의철회)를 위해서는 “회원탈퇴”를 클릭 하여 본인 확인 절차를 거치신 후 직접 열람, 정정 또는 탈퇴가 가능합니다. 혹은 개인정보관리책임자에게 서면, 전화 또는 이메일로 연락하시면 지체없이 조 치하겠습니다.<br />
귀하가 개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까 지 당해 개인정보를 이용 또는 제공하지 않습니다. 또한 잘못된 개인정보를 제3자 에게 이미 제공한 경우에는 정정 처리결과를 제3자에게 지체없이 통지하여 정정이 이루어지도록 하겠습니다.<br />
oo는 이용자 혹은 법정 대리인의 요청에 의해 해지 또는 삭제된 개인정보는 “oo 가 수집하는 개인정보의 보유 및 이용기간”에 명시된 바에 따라 처리하고 그 외의 용도로 열람 또는 이용할 수 없도록 처리하고 있습니다.<br /><br />
■ 개인정보 자동수집 장치의 설치, 운영 및 그 거부에 관한 사항<br /><br />
회사는 귀하의 정보를 수시로 저장하고 찾아내는 ‘쿠키(cookie)’ 등을 운용합니다. 쿠키란 oo의 웹사이트를 운영하는데 이용되는 서버가 귀하의 브라우저에 보내는 아주 작은 텍스트 파일로서 귀하의 컴퓨터 하드디스크에 저장됩니다. 회사은(는) 다음과 같은 목적을 위해 쿠키를 사용합니다.<br /><br />
▶ 쿠키 등 사용 목적<br />
- 회원과 비회원의 접속 빈도나 방문 시간 등을 분석, 이용자의 취향과 관심분야를 파악 및 자취 추적, 각종 이벤트 참여 정도 및 방문 회수 파악 등을 통한 타겟 마케팅 및 개인 맞춤 서비스 제공<br /><br />
귀하는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서, 귀하는 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.<br /><br />
▶ 쿠키 설정 거부 방법<br />
예: 쿠키 설정을 거부하는 방법으로는 회원님이 사용하시는 웹 브라우저의 옵션을 선택함으로써 모든 쿠키를 허용하거나 쿠키를 저장할 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다.<br /><br />
설정방법 예(인터넷 익스플로어의 경우)<br />
: 웹 브라우저 상단의 도구 &gt; 인터넷 옵션 &gt; 개인정보<br /><br />
단, 귀하께서 쿠키 설치를 거부하였을 경우 서비스 제공에 어려움이 있을 수 있습니다.<br /><br />
■ 개인정보에 관한 민원서비스<br /><br />
회사는 고객의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이 관련 부서 및 개인정보관리책임자를 지정하고 있습니다.<br /><br />
고객서비스담당 부서 :OOO<br />
전화번호 : OO-OOOO-OOOO<br />
이메일 : OOOOO@OOOO<br /><br />
개인정보관리책임자 성명 : OOO<br />
전화번호 : OO-OOOO-OOOO<br />
이메일 : OOOOO@OOOO<br /><br />
귀하께서는 회사의 서비스를 이용하시며 발생하는 모든 개인정보보호 관련 민원을 개인정보관리책임자 혹은 담당부서로 신고하실 수 있습니다. 회사는 이용자들의 신고사항에 대해 신속하게 충분한 답변을 드릴 것입니다.<br /><br />
기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.<br />
1.개인분쟁조정위원회 (www.1336.or.kr/1336)<br />
2.정보보호마크인증위원회 (www.eprivacy.or.kr/02-580-0533~4)<br />
3.대검찰청 인터넷범죄수사센터 (http://icic.sppo.go.kr/02-3480-3600)<br />
4.경찰청 사이버테러대응센터 (www.ctrc.go.kr/02-392-0330)<br />', 'Y', 'migration');
INSERT INTO TBL_HP_TERM (TERM_KND_CD, TERM_CTT, USE_YN, LST_CHGR_EMPNO) VALUES ('SERVICE', '제 1 장 총 칙<br /><br />
제 1 조 (목적)<br />
이 약관은 ''(주)장인의공간'' (이하 ''사이트''라 합니다)에서 제공하는 인터넷서비스(이하 ''서비스''라 합니다)의 이용 조건 및 절차에 관한 기본적인 사항을 규정함을 목적으로 합니다.<br /><br />
제 2 조 (약관의 효력 및 변경)<br />
① 이 약관은 서비스 화면이나 기타의 방법으로 이용고객에게 공지함으로써 효력을 발생합니다.<br />
② 사이트는 이 약관의 내용을 변경할 수 있으며, 변경된 약관은 제1항과 같은 방법으로 공지 또는 통지함으로써 효력을 발생합니다.<br /><br />
제 3 조 (용어의 정의)<br />
이 약관에서 사용하는 용어의 정의는 다음과 같습니다.<br />
① 회원 : 사이트와 서비스 이용계약을 체결하거나 이용자 아이디(ID)를 부여받은 개인 또는 단체를 말합니다.<br />
② 신청자 : 회원가입을 신청하는 개인 또는 단체를 말합니다.<br />
③ 아이디(ID) : 회원의 식별과 서비스 이용을 위하여 회원이 정하고 사이트가 승인하는 문자와 숫자의 조합을 말합니다.<br />
④ 비밀번호 : 회원이 부여 받은 아이디(ID)와 일치된 회원임을 확인하고, 회원 자신의 비밀을 보호하기 위하여 회원이 정한 문자와 숫자의 조합을 말합니다.<br />
⑤ 해지 : 사이트 또는 회원이 서비스 이용계약을 취소하는 것을 말합니다.<br /><br />
&nbsp;<br />
제 2 장 서비스 이용계약<br /><br />
제 4 조 (이용계약의 성립)<br />
① 이용약관 하단의 동의 버튼을 누르면 이 약관에 동의하는 것으로 간주됩니다.<br />
② 이용계약은 서비스 이용희망자의 이용약관 동의 후 이용 신청에 대하여 사이트가 승낙함으로써 성립합니다.<br /><br />
제 5 조 (이용신청)<br />
① 신청자가 본 서비스를 이용하기 위해서는 사이트 소정의 가입신청 양식에서 요구하는 이용자 정보를 기록하여 제출해야 합니다.<br />
② 가입신청 양식에 기재하는 모든 이용자 정보는 모두 실제 데이터인 것으로 간주됩니다. 실명이나 실제 정보를 입력하지 않은 사용자는 법적인 보호를 받을 수 없으며, 서비스의 제한을 받을 수 있습니다.<br /><br />
제 6 조 (이용신청의 승낙)<br />
① 사이트는 신청자에 대하여 제2항, 제3항의 경우를 예외로 하여 서비스 이용신청을 승낙합니다.<br />
② 사이트는 다음에 해당하는 경우에 그 신청에 대한 승낙 제한사유가 해소될 때까지 승낙을 유보할 수 있습니다.<br />
가. 서비스 관련 설비에 여유가 없는 경우<br />
나. 기술상 지장이 있는 경우<br />
다. 기타 사이트가 필요하다고 인정되는 경우<br />
③ 사이트는 신청자가 다음에 해당하는 경우에는 승낙을 거부할 수 있습니다.<br />
가. 다른 개인(사이트)의 명의를 사용하여 신청한 경우<br />
나. 이용자 정보를 허위로 기재하여 신청한 경우<br />
다. 사회의 안녕질서 또는 미풍양속을 저해할 목적으로 신청한 경우<br />
라. 기타 사이트 소정의 이용신청요건을 충족하지 못하는 경우<br /><br />
제 7 조 (이용자정보의 변경)<br />
회원은 이용 신청시에 기재했던 회원정보가 변경되었을 경우에는, 온라인으로 수정하여야 하며 변경하지 않음으로 인하여 발생되는 모든 문제의 책임은 회원에게 있습니다.<br />
&nbsp;<br /><br />
제 3 장 계약 당사자의 의무<br /><br />
제 8 조 (사이트의 의무)<br />
① 사이트는 회원에게 각 호의 서비스를 제공합니다.<br />
가. 신규서비스와 도메인 정보에 대한 뉴스레터 발송<br />
나. 추가 도메인 등록시 개인정보 자동 입력<br />
다. 도메인 등록, 관리를 위한 각종 부가서비스<br />
② 사이트는 서비스 제공과 관련하여 취득한 회원의 개인정보를 회원의 동의없이 타인에게 누설, 공개 또는 배포할 수 없으며, 서비스관련 업무 이외의 상업적 목적으로 사용할 수 없습니다. 단, 다음 각 호의 1에 해당하는 경우는 예외입니다.<br />
가. 전기통신기본법 등 법률의 규정에 의해 국가기관의 요구가 있는 경우<br />
나. 범죄에 대한 수사상의 목적이 있거나 정보통신윤리 위원회의 요청이 있는 경우<br />
다. 기타 관계법령에서 정한 절차에 따른 요청이 있는 경우<br />
③ 사이트는 이 약관에서 정한 바에 따라 지속적, 안정적으로 서비스를 제공할 의무가 있습니다.<br /><br />
&nbsp;<br /><br />
제 9 조 (회원의 의무)<br />
① 회원은 서비스 이용 시 다음 각 호의 행위를 하지 않아야 합니다.<br />
가. 다른 회원의 ID를 부정하게 사용하는 행위<br />
나. 서비스에서 얻은 정보를 사이트의 사전승낙 없이 회원의 이용 이외의 목적으로 복제하거나 이를 변경, 출판 및 방송 등에 사용하거나 타인에게 제공하는 행위<br />
다. 사이트의 저작권, 타인의 저작권 등 기타 권리를 침해하는 행위<br />
라. 공공질서 및 미풍양속에 위반되는 내용의 정보, 문장, 도형 등을 타인에게 유포하는 행위<br />
마. 범죄와 결부된다고 객관적으로 판단되는 행위<br />
바. 기타 관계법령에 위배되는 행위<br />
② 회원은 관계법령, 이 약관에서 규정하는 사항, 서비스 이용 안내 및 주의 사항을 준수하여야 합니다.<br />
③ 회원은 내용별로 사이트가 서비스 공지사항에 게시하거나 별도로 공지한 이용 제한 사항을 준수하여야 합니다.<br /><br />
&nbsp;<br /><br />
제 4 장 서비스 제공 및 이용<br /><br />
제 10 조 (회원 아이디(ID)와 비밀번호 관리에 대한 회원의 의무)<br />
① 아이디(ID)와 비밀번호에 대한 모든 관리는 회원에게 책임이 있습니다. 회원에게 부여된 아이디(ID)와 비밀번호의 관리소홀, 부정사용에 의하여 발생하는 모든 결과에 대한 전적인 책임은 회원에게 있습니다.<br />
② 자신의 아이디(ID)가 부정하게 사용된 경우 또는 기타 보안 위반에 대하여, 회원은 반드시 사이트에 그 사실을 통보해야 합니다.&nbsp;<br /><br />
제 11 조 (서비스 제한 및 정지)<br />
① 사이트는 전시, 사변, 천재지변 또는 이에 준하는 국가비상사태가 발생하거나 발생할 우려가 있는 경우와 전기통신사업법에 의한 기간통신 사업자가 전기통신서비스를 중지하는 등 기타 불가항력적 사유가 있는 경우에는 서비스의 전부 또는 일부를 제한하거나 정지할 수 있습니다.<br />
② 사이트는 제1항의 규정에 의하여 서비스의 이용을 제한하거나 정지할 때에는 그 사유 및 제한기간 등을 지체없이 회원에게 알려야 합니다.<br /><br />
&nbsp;<br /><br />
제5장 계약사항의 변경, 해지<br /><br />
제 12 조 (정보의 변경)<br />
회원이 주소, 비밀번호 등 고객정보를 변경하고자 하는 경우에는 홈페이지의 회원정보 변경 서비스를 이용하여 변경할 수 있습니다.<br /><br />
제 13 조 (계약사항의 해지)<br />
회원은 서비스 이용계약을 해지할 수 있으며, 해지할 경우에는 본인이 직접 서비스를 통하거나 전화 또는 온라인 등으로 사이트에 해지신청을 하여야 합니다. 사이트는 해지신청이 접수된 당일부터 해당 회원의 서비스 이용을 제한합니다. 사이트는 회원이 다음 각 항의 1에 해당하여 이용계약을 해지하고자 할 경우에는 해지조치 7일전까지 그 뜻을 이용고객에게 통지하여 소명할 기회를 주어야 합니다.<br />
① 이용고객이 이용제한 규정을 위반하거나 그 이용제한 기간 내에 제한 사유를 해소하지 않는 경우<br />
② 정보통신윤리위원회가 이용해지를 요구한 경우<br />
③ 이용고객이 정당한 사유 없이 의견진술에 응하지 아니한 경우<br />
④ 타인 명의로 신청을 하였거나 신청서 내용의 허위 기재 또는 허위서류를 첨부하여 이용계약을 체결한 경우<br />
사이트는 상기 규정에 의하여 해지된 이용고객에 대해서는 별도로 정한 기간동안 가입을 제한할 수 있습니다.<br /><br /><br />
제6장 손해배상<br />
제 14 조 (면책조항)<br />
① 사이트는 회원이 서비스 제공으로부터 기대되는 이익을 얻지 못하였거나 서비스 자료에 대한 취사선택 또는 이용으로 발생하는 손해 등에 대해서는 책임이 면제됩니다.<br />
② 사이트는 회원의 귀책사유나 제3자의 고의로 인하여 서비스에 장애가 발생하거나 회원의 데이터가 훼손된 경우에 책임이 면제됩니다.<br />
③ 사이트는 회원이 게시 또는 전송한 자료의 내용에 대해서는 책임이 면제됩니다.<br />
④ 상표권이 있는 도메인의 경우, 이로 인해 발생할 수도 있는 손해나 배상에 대한 책임은 구매한 회원 당사자에게 있으며, 사이트는 이에 대한 일체의 책임을 지지 않습니다.<br /><br /><br />
제 15 조 (관할법원)<br />
서비스와 관련하여 사이트와 회원간에 분쟁이 발생할 경우 사이트의 본사 소재지를 관할하는 법원을 관할법원으로 합니다.<br /><br />
&nbsp;<br /><br />
[부칙]<br /><br />
&nbsp;(시행일) 이 약관은 20##년 ##월부터 시행합니다.<br /><br />', 'Y', 'migration');
INSERT INTO TBL_HP_TERM (TERM_KND_CD, TERM_CTT, USE_YN, LST_CHGR_EMPNO) VALUES ('EMAIL', '정보통신망법 제50조에 의거하여 본 홈페이지에 게시된 이메일 주소가 
전자우편 수집 프로그램이나 그 밖의 기술적인 장치를 이용하여 무단으로 수집되는 것을 거부하며, 
이를 위반 시 정보통신망법에 의해 형사 처분됨을 유념하시기 바랍니다. ', 'Y', 'migration');

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;

-- 분류 AUTO_INCREMENT 를 옮긴 최대값 다음으로 맞춘다.
ALTER TABLE TBL_HP_PROJECT_CTG AUTO_INCREMENT = 29;
