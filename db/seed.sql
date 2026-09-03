SET NAMES utf8mb4;

-- =====================================================================
-- (주)장인의공간 홈페이지 - 초기 데이터 (MySQL)
--
-- 관리자 계정 / 권한 / 프로그램 / 메뉴 / 권한별 메뉴를 세팅한다.
-- 메뉴는 osca 와 동일하게 3단계(대>중>소) 구조이며, 권한은 3단계 메뉴에 부여한다.
--
-- 실행:  mysql -h <host> -u <user> -p <db> < db/seed.sql   (schema.sql 실행 후)
--
-- ⚠ 초기 관리자 비밀번호는 mastersp!2026 이다. 최초 로그인 후 반드시 변경할 것.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 권한
-- ---------------------------------------------------------------------
INSERT IGNORE INTO TBL_SYS_AUTH (AUTH_ID, AUTH_NM, USE_YN, FRST_REGR_EMPNO, LST_CHGR_EMPNO) VALUES
  ('ADMIN', '시스템관리자', 'Y', 'system', 'system'),
  ('MNGR',  '운영담당자',   'Y', 'system', 'system');

-- ---------------------------------------------------------------------
-- 관리자 계정  (비밀번호: mastersp!2026 / bcrypt)
-- ---------------------------------------------------------------------
INSERT IGNORE INTO TBL_SYS_USER (USER_ID, USER_NM, USER_PWD, USER_EML, USE_YN, APR_YN, APR_ID, FRST_REGR_EMPNO, LST_CHGR_EMPNO) VALUES
  ('admin', '시스템관리자', '$2b$10$T/cb9qKeTS/9tbdgL7ZYLex1vVtSBysU6MwSA.vDylj3HSEFjZaLC',
   'master@masterspace.co.kr', 'Y', 'Y', 'system', 'system', 'system');

INSERT IGNORE INTO TBL_SYS_USER_AUTH (USER_ID, AUTH_ID, FRST_REGR_EMPNO, LST_CHGR_EMPNO) VALUES
  ('admin', 'ADMIN', 'system', 'system');

-- ---------------------------------------------------------------------
-- 프로그램 (화면 경로)
-- ---------------------------------------------------------------------
INSERT IGNORE INTO TBL_SYS_PGM (PGM_ID, PGM_NM, PGM_PTH_NM, FRST_REGR_EMPNO, LST_CHGR_EMPNO) VALUES
  ('PGM_INQ_MNG',      '고객문의 관리',   '/admin/hp/inquiry-mng',   'system', 'system'),
  ('PGM_HIST_MNG',     '연혁 관리',       '/admin/hp/history-mng',   'system', 'system'),
  ('PGM_PRJ_MNG',      '수행과제 관리',   '/admin/hp/project-mng',   'system', 'system'),
  ('PGM_USER_MNG',     '사용자 관리',     '/admin/sys/user-mng',      'system', 'system'),
  ('PGM_AUTH_MNG',     '권한 관리',       '/admin/sys/auth-mng',      'system', 'system'),
  ('PGM_USER_AUTH_MNG','사용자권한 관리', '/admin/sys/user-auth-mng', 'system', 'system'),
  ('PGM_MENU_MNG',     '메뉴 관리',       '/admin/sys/menu-mng',      'system', 'system'),
  ('PGM_PGM_MNG',      '프로그램 관리',   '/admin/sys/pgm-mng',       'system', 'system'),
  ('PGM_AUTH_MENU_MNG','권한별메뉴 관리', '/admin/sys/auth-menu-mng', 'system', 'system'),
  ('PGM_USER_HST',     '접속이력 조회',   '/admin/sys/user-hst',      'system', 'system');

-- ---------------------------------------------------------------------
-- 메뉴 (1단계: 대분류)
-- ---------------------------------------------------------------------
INSERT IGNORE INTO TBL_SYS_MENU (MENU_ID, MENU_NM, UPPO_MENU_ID, PGM_ID, MENU_STEP, MENU_SEQO, USE_YN, FRST_REGR_EMPNO, LST_CHGR_EMPNO) VALUES
  ('M1_HP',  '홈페이지관리', NULL, NULL, '1', 1, 'Y', 'system', 'system'),
  ('M1_SYS', '시스템관리',   NULL, NULL, '1', 2, 'Y', 'system', 'system');

-- 메뉴 (2단계: 중분류)
INSERT IGNORE INTO TBL_SYS_MENU (MENU_ID, MENU_NM, UPPO_MENU_ID, PGM_ID, MENU_STEP, MENU_SEQO, USE_YN, FRST_REGR_EMPNO, LST_CHGR_EMPNO) VALUES
  ('M2_HP_INQ', '고객문의',   'M1_HP',  NULL, '2', 1, 'Y', 'system', 'system'),
  ('M2_HP_CTT', '콘텐츠',     'M1_HP',  NULL, '2', 2, 'Y', 'system', 'system'),
  ('M2_SYS',    '시스템',     'M1_SYS', NULL, '2', 1, 'Y', 'system', 'system');

-- 메뉴 (3단계: 실제 화면 - 권한은 이 단계에 부여한다)
INSERT IGNORE INTO TBL_SYS_MENU (MENU_ID, MENU_NM, UPPO_MENU_ID, PGM_ID, MENU_STEP, MENU_SEQO, USE_YN, FRST_REGR_EMPNO, LST_CHGR_EMPNO) VALUES
  ('M3_INQ_MNG',       '문의 관리',       'M2_HP_INQ', 'PGM_INQ_MNG',       '3', 1, 'Y', 'system', 'system'),
  ('M3_HIST_MNG',      '연혁 관리',       'M2_HP_CTT', 'PGM_HIST_MNG',      '3', 1, 'Y', 'system', 'system'),
  ('M3_PRJ_MNG',       '수행과제 관리',   'M2_HP_CTT', 'PGM_PRJ_MNG',       '3', 2, 'Y', 'system', 'system'),
  ('M3_USER_MNG',      '사용자 관리',     'M2_SYS',    'PGM_USER_MNG',      '3', 1, 'Y', 'system', 'system'),
  ('M3_AUTH_MNG',      '권한 관리',       'M2_SYS',    'PGM_AUTH_MNG',      '3', 2, 'Y', 'system', 'system'),
  ('M3_USER_AUTH_MNG', '사용자권한 관리', 'M2_SYS',    'PGM_USER_AUTH_MNG', '3', 3, 'Y', 'system', 'system'),
  ('M3_MENU_MNG',      '메뉴 관리',       'M2_SYS',    'PGM_MENU_MNG',      '3', 4, 'Y', 'system', 'system'),
  ('M3_PGM_MNG',       '프로그램 관리',   'M2_SYS',    'PGM_PGM_MNG',       '3', 5, 'Y', 'system', 'system'),
  ('M3_AUTH_MENU_MNG', '권한별메뉴 관리', 'M2_SYS',    'PGM_AUTH_MENU_MNG', '3', 6, 'Y', 'system', 'system'),
  ('M3_USER_HST',      '접속이력 조회',   'M2_SYS',    'PGM_USER_HST',      '3', 7, 'Y', 'system', 'system');

-- ---------------------------------------------------------------------
-- 권한별 메뉴
--   ADMIN : 전체 메뉴
--   MNGR  : 홈페이지관리 메뉴만
-- ---------------------------------------------------------------------
INSERT IGNORE INTO TBL_SYS_AUTH_MENU (AUTH_ID, MENU_ID, FRST_REGR_EMPNO, LST_CHGR_EMPNO)
SELECT 'ADMIN', MENU_ID, 'system', 'system'
  FROM TBL_SYS_MENU
 WHERE MENU_STEP = '3';

INSERT IGNORE INTO TBL_SYS_AUTH_MENU (AUTH_ID, MENU_ID, FRST_REGR_EMPNO, LST_CHGR_EMPNO)
SELECT 'MNGR', MENU_ID, 'system', 'system'
  FROM TBL_SYS_MENU
 WHERE MENU_ID IN ('M3_INQ_MNG', 'M3_HIST_MNG', 'M3_PRJ_MNG');

-- ---------------------------------------------------------------------
-- 약관 (레거시 tb_yark 대체 - 본문은 관리자 화면에서 교체)
-- ---------------------------------------------------------------------
-- 약관 (레거시 tb_yark 대체 - 실데이터는 db/data.sql 이 덮어쓴다)
INSERT INTO TBL_HP_TERM (TERM_KND_CD, TERM_CTT, USE_YN, LST_CHGR_EMPNO)
SELECT 'PRIVACY', '<p>개인정보처리방침 본문을 입력해 주세요.</p>', 'Y', 'system' FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM TBL_HP_TERM WHERE TERM_KND_CD = 'PRIVACY');

INSERT INTO TBL_HP_TERM (TERM_KND_CD, TERM_CTT, USE_YN, LST_CHGR_EMPNO)
SELECT 'EMAIL', '<p>이메일무단수집거부 본문을 입력해 주세요.</p>', 'Y', 'system' FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM TBL_HP_TERM WHERE TERM_KND_CD = 'EMAIL');
