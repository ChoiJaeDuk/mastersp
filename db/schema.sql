-- =====================================================================
-- (주)장인의공간 홈페이지 - PostgreSQL 스키마
--
-- 1) TBL_SYS_*  : 시스템/권한 테이블. osca 프로젝트와 동일한 구조로,
--                 사용자관리 / 권한관리 / 사용자권한관리 / 메뉴관리 /
--                 프로그램관리 / 권한별메뉴관리 화면을 그대로 이식하기 위한 것이다.
-- 2) TBL_HP_*   : 홈페이지 콘텐츠 테이블. 레거시 PHP 의 tb_inquiry / tb_history /
--                 tb_project / tb_category / tb_file / tb_yark 에서
--                 실제 화면이 사용하는 컬럼만 추려 정규화했다.
--
-- 레거시 대비 변경 규칙
--   enum('Y','N')  -> CHAR(1) + CHECK           (osca 컨벤션 유지)
--   datetime       -> TIMESTAMPTZ
--   AUTO_INCREMENT -> GENERATED ALWAYS AS IDENTITY
--   field_etc_01.. -> 의미 있는 컬럼명으로 치환
--
-- 실행:  psql -U <user> -d <db> -f db/schema.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. 시스템 / 권한
-- ---------------------------------------------------------------------

-- 사용자
CREATE TABLE IF NOT EXISTS TBL_SYS_USER (
  USER_ID         VARCHAR(30)  NOT NULL,                      -- 로그인 아이디
  USER_NM         VARCHAR(50)  NOT NULL,                      -- 사용자명
  USER_PWD        VARCHAR(100) NOT NULL,                      -- 비밀번호 (bcrypt 해시)
  USER_EML        VARCHAR(200),                               -- 이메일
  USE_YN          CHAR(1)      NOT NULL DEFAULT 'Y',          -- 사용여부
  APR_YN          CHAR(1)      NOT NULL DEFAULT 'N',          -- 승인여부
  APR_ID          VARCHAR(30),                                -- 승인자
  FRST_REG_DT     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  FRST_REGR_EMPNO VARCHAR(30),
  LST_CHG_DT      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  LST_CHGR_EMPNO  VARCHAR(30),
  CONSTRAINT PK_SYS_USER PRIMARY KEY (USER_ID),
  CONSTRAINT CK_SYS_USER_USE_YN CHECK (USE_YN IN ('Y', 'N')),
  CONSTRAINT CK_SYS_USER_APR_YN CHECK (APR_YN IN ('Y', 'N'))
);
COMMENT ON TABLE TBL_SYS_USER IS '사용자';

-- 사용자 접속 이력
CREATE TABLE IF NOT EXISTS TBL_SYS_USER_HST (
  HST_SQNO        BIGINT      GENERATED ALWAYS AS IDENTITY,
  USER_ID         VARCHAR(30) NOT NULL,
  CNN_IP          VARCHAR(45),                                -- 접속 IP (IPv6 대응)
  FRST_REG_DT     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FRST_REGR_EMPNO VARCHAR(30),
  LST_CHG_DT      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  LST_CHGR_EMPNO  VARCHAR(30),
  CONSTRAINT PK_SYS_USER_HST PRIMARY KEY (HST_SQNO)
);
COMMENT ON TABLE TBL_SYS_USER_HST IS '사용자 접속 이력';
CREATE INDEX IF NOT EXISTS IX_SYS_USER_HST_01 ON TBL_SYS_USER_HST (USER_ID, FRST_REG_DT DESC);

-- 권한
CREATE TABLE IF NOT EXISTS TBL_SYS_AUTH (
  AUTH_ID         VARCHAR(20) NOT NULL,                       -- 권한 아이디 (예: ADMIN, MNGR)
  AUTH_NM         VARCHAR(50) NOT NULL,                       -- 권한명
  USE_YN          CHAR(1)     NOT NULL DEFAULT 'Y',
  FRST_REG_DT     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FRST_REGR_EMPNO VARCHAR(30),
  LST_CHG_DT      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  LST_CHGR_EMPNO  VARCHAR(30),
  CONSTRAINT PK_SYS_AUTH PRIMARY KEY (AUTH_ID),
  CONSTRAINT CK_SYS_AUTH_USE_YN CHECK (USE_YN IN ('Y', 'N'))
);
COMMENT ON TABLE TBL_SYS_AUTH IS '권한';

-- 사용자별 권한
CREATE TABLE IF NOT EXISTS TBL_SYS_USER_AUTH (
  USER_ID         VARCHAR(30) NOT NULL,
  AUTH_ID         VARCHAR(20) NOT NULL,
  FRST_REG_DT     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FRST_REGR_EMPNO VARCHAR(30),
  LST_CHG_DT      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  LST_CHGR_EMPNO  VARCHAR(30),
  CONSTRAINT PK_SYS_USER_AUTH PRIMARY KEY (USER_ID, AUTH_ID),
  CONSTRAINT FK_SYS_USER_AUTH_01 FOREIGN KEY (USER_ID) REFERENCES TBL_SYS_USER (USER_ID) ON DELETE CASCADE,
  CONSTRAINT FK_SYS_USER_AUTH_02 FOREIGN KEY (AUTH_ID) REFERENCES TBL_SYS_AUTH (AUTH_ID) ON DELETE CASCADE
);
COMMENT ON TABLE TBL_SYS_USER_AUTH IS '사용자별 권한';

-- 프로그램 (화면 경로)
CREATE TABLE IF NOT EXISTS TBL_SYS_PGM (
  PGM_ID          VARCHAR(30)  NOT NULL,                      -- 프로그램 아이디
  PGM_NM          VARCHAR(100) NOT NULL,                      -- 프로그램명
  PGM_PTH_NM      VARCHAR(255) NOT NULL,                      -- 라우트 경로 (예: /admin/sys/menu-mng)
  FRST_REG_DT     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  FRST_REGR_EMPNO VARCHAR(30),
  LST_CHG_DT      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  LST_CHGR_EMPNO  VARCHAR(30),
  CONSTRAINT PK_SYS_PGM PRIMARY KEY (PGM_ID)
);
COMMENT ON TABLE TBL_SYS_PGM IS '프로그램';

-- 메뉴 (3단계 트리)
CREATE TABLE IF NOT EXISTS TBL_SYS_MENU (
  MENU_ID         VARCHAR(30)  NOT NULL,                      -- 메뉴 아이디
  MENU_NM         VARCHAR(100) NOT NULL,                      -- 메뉴명
  UPPO_MENU_ID    VARCHAR(30),                                -- 상위 메뉴 아이디
  PGM_ID          VARCHAR(30),                                -- 연결 프로그램
  MENU_STEP       CHAR(1)      NOT NULL,                      -- 메뉴 단계 (1/2/3)
  MENU_SEQO       INTEGER,                                    -- 정렬 순서
  PARM_CTT        VARCHAR(255),                               -- 쿼리스트링 파라미터
  USE_YN          CHAR(1)      NOT NULL DEFAULT 'Y',
  FRST_REG_DT     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  FRST_REGR_EMPNO VARCHAR(30),
  LST_CHG_DT      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  LST_CHGR_EMPNO  VARCHAR(30),
  CONSTRAINT PK_SYS_MENU PRIMARY KEY (MENU_ID),
  CONSTRAINT FK_SYS_MENU_01 FOREIGN KEY (PGM_ID) REFERENCES TBL_SYS_PGM (PGM_ID) ON DELETE SET NULL,
  CONSTRAINT CK_SYS_MENU_STEP CHECK (MENU_STEP IN ('1', '2', '3')),
  CONSTRAINT CK_SYS_MENU_USE_YN CHECK (USE_YN IN ('Y', 'N'))
);
COMMENT ON TABLE TBL_SYS_MENU IS '메뉴';
CREATE INDEX IF NOT EXISTS IX_SYS_MENU_01 ON TBL_SYS_MENU (MENU_STEP, UPPO_MENU_ID, MENU_SEQO);

-- 권한별 메뉴
CREATE TABLE IF NOT EXISTS TBL_SYS_AUTH_MENU (
  AUTH_ID         VARCHAR(20) NOT NULL,
  MENU_ID         VARCHAR(30) NOT NULL,
  FRST_REG_DT     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FRST_REGR_EMPNO VARCHAR(30),
  LST_CHG_DT      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  LST_CHGR_EMPNO  VARCHAR(30),
  CONSTRAINT PK_SYS_AUTH_MENU PRIMARY KEY (AUTH_ID, MENU_ID),
  CONSTRAINT FK_SYS_AUTH_MENU_01 FOREIGN KEY (AUTH_ID) REFERENCES TBL_SYS_AUTH (AUTH_ID) ON DELETE CASCADE,
  CONSTRAINT FK_SYS_AUTH_MENU_02 FOREIGN KEY (MENU_ID) REFERENCES TBL_SYS_MENU (MENU_ID) ON DELETE CASCADE
);
COMMENT ON TABLE TBL_SYS_AUTH_MENU IS '권한별 메뉴';

-- ---------------------------------------------------------------------
-- 2. 홈페이지 콘텐츠
-- ---------------------------------------------------------------------

-- 고객문의  (레거시 tb_inquiry)
--   title        <- title          (문의분야)
--   CO_NM        <- field_etc_01   (회사명)
--   PSTN_NM      <- field_etc_02   (직함)
CREATE TABLE IF NOT EXISTS TBL_HP_INQUIRY (
  INQ_SQNO        BIGINT       GENERATED ALWAYS AS IDENTITY,
  INQ_FLD_NM      VARCHAR(255) NOT NULL,                      -- 문의분야
  CO_NM           VARCHAR(255),                               -- 회사명
  PSTN_NM         VARCHAR(255),                               -- 직함
  WRTR_NM         VARCHAR(50)  NOT NULL,                      -- 이름
  WRTR_TELNO      VARCHAR(30)  NOT NULL,                      -- 연락처
  WRTR_EML        VARCHAR(250) NOT NULL,                      -- 이메일
  INQ_CTT         TEXT         NOT NULL,                      -- 문의내용
  PRVC_AGRE_DT    TIMESTAMPTZ  NOT NULL,                      -- 개인정보 수집 동의 시각
  PRCS_STS_CD     VARCHAR(10)  NOT NULL DEFAULT 'RECV',       -- 처리상태 RECV(접수) / DONE(답변완료)
  RPLY_CTT        TEXT,                                       -- 답변내용
  RPLY_DT         TIMESTAMPTZ,                                -- 답변일시
  RPLY_USER_ID    VARCHAR(30),                                -- 답변자
  WRTR_IP         VARCHAR(45),                                -- 등록 IP
  DEL_YN          CHAR(1)      NOT NULL DEFAULT 'N',          -- 삭제여부 (소프트 삭제)
  FRST_REG_DT     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  LST_CHG_DT      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  LST_CHGR_EMPNO  VARCHAR(30),
  CONSTRAINT PK_HP_INQUIRY PRIMARY KEY (INQ_SQNO),
  CONSTRAINT CK_HP_INQUIRY_STS CHECK (PRCS_STS_CD IN ('RECV', 'DONE')),
  CONSTRAINT CK_HP_INQUIRY_DEL_YN CHECK (DEL_YN IN ('Y', 'N'))
);
COMMENT ON TABLE TBL_HP_INQUIRY IS '고객문의';
CREATE INDEX IF NOT EXISTS IX_HP_INQUIRY_01 ON TBL_HP_INQUIRY (DEL_YN, FRST_REG_DT DESC);

-- 연혁  (레거시 tb_history)
CREATE TABLE IF NOT EXISTS TBL_HP_HISTORY (
  HIST_SQNO       BIGINT      GENERATED ALWAYS AS IDENTITY,
  HIST_YR         CHAR(4)     NOT NULL,                       -- 연도
  HIST_MM         CHAR(2)     NOT NULL,                       -- 월
  HIST_CTT        TEXT        NOT NULL,                       -- 내용
  MENU_SEQO       INTEGER     NOT NULL DEFAULT 999,           -- 정렬 순서
  USE_YN          CHAR(1)     NOT NULL DEFAULT 'Y',           -- 노출여부 (레거시 viewtype)
  FRST_REG_DT     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  LST_CHG_DT      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  LST_CHGR_EMPNO  VARCHAR(30),
  CONSTRAINT PK_HP_HISTORY PRIMARY KEY (HIST_SQNO),
  CONSTRAINT CK_HP_HISTORY_USE_YN CHECK (USE_YN IN ('Y', 'N'))
);
COMMENT ON TABLE TBL_HP_HISTORY IS '회사 연혁';
CREATE INDEX IF NOT EXISTS IX_HP_HISTORY_01 ON TBL_HP_HISTORY (USE_YN, HIST_YR DESC, HIST_MM DESC);

-- 수행과제 분류  (레거시 tb_category / tablename='tb_project')
CREATE TABLE IF NOT EXISTS TBL_HP_PROJECT_CTG (
  CTG_SQNO        BIGINT       GENERATED ALWAYS AS IDENTITY,
  CTG_NM          VARCHAR(255) NOT NULL,                      -- 분류명 (연도 등)
  MENU_SEQO       INTEGER      NOT NULL DEFAULT 999,
  USE_YN          CHAR(1)      NOT NULL DEFAULT 'Y',
  FRST_REG_DT     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  LST_CHG_DT      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  LST_CHGR_EMPNO  VARCHAR(30),
  CONSTRAINT PK_HP_PROJECT_CTG PRIMARY KEY (CTG_SQNO),
  CONSTRAINT CK_HP_PROJECT_CTG_USE_YN CHECK (USE_YN IN ('Y', 'N'))
);
COMMENT ON TABLE TBL_HP_PROJECT_CTG IS '수행과제 분류';

-- 수행과제  (레거시 tb_project)
--   PRJ_KND_CD <- mode          ('1' 국책과제 / '2' 기타과제 - 화면 탭)
--   CTG_SQNO   <- depth1        (연도 카테고리)
--   ORDR_NM    <- field_etc_01  (발주처)
CREATE TABLE IF NOT EXISTS TBL_HP_PROJECT (
  PRJ_SQNO        BIGINT       GENERATED ALWAYS AS IDENTITY,
  PRJ_KND_CD      CHAR(1)      NOT NULL,                      -- 과제구분 1/2
  CTG_SQNO        BIGINT,                                     -- 분류(연도)
  PRJ_NM          VARCHAR(255) NOT NULL,                      -- 과제명
  PRJ_CTT         TEXT,                                       -- 내용 (줄바꿈 단위로 목록 렌더링)
  BGNG_DE         DATE,                                       -- 시작일
  END_DE          DATE,                                       -- 종료일
  ORDR_NM         VARCHAR(255),                               -- 발주처
  MENU_SEQO       INTEGER      NOT NULL DEFAULT 999,
  USE_YN          CHAR(1)      NOT NULL DEFAULT 'Y',
  FRST_REG_DT     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  LST_CHG_DT      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  LST_CHGR_EMPNO  VARCHAR(30),
  CONSTRAINT PK_HP_PROJECT PRIMARY KEY (PRJ_SQNO),
  CONSTRAINT FK_HP_PROJECT_01 FOREIGN KEY (CTG_SQNO) REFERENCES TBL_HP_PROJECT_CTG (CTG_SQNO) ON DELETE SET NULL,
  CONSTRAINT CK_HP_PROJECT_KND CHECK (PRJ_KND_CD IN ('1', '2')),
  CONSTRAINT CK_HP_PROJECT_USE_YN CHECK (USE_YN IN ('Y', 'N'))
);
COMMENT ON TABLE TBL_HP_PROJECT IS '수행과제';
CREATE INDEX IF NOT EXISTS IX_HP_PROJECT_01 ON TBL_HP_PROJECT (PRJ_KND_CD, CTG_SQNO, USE_YN);

-- 첨부파일  (레거시 tb_file)
CREATE TABLE IF NOT EXISTS TBL_HP_ATTACH (
  ATCH_SQNO       BIGINT       GENERATED ALWAYS AS IDENTITY,
  REF_TBL_NM      VARCHAR(50)  NOT NULL,                      -- 참조 테이블명
  REF_SQNO        BIGINT       NOT NULL,                      -- 참조 일련번호
  ORGNL_FILE_NM   VARCHAR(255) NOT NULL,                      -- 원본 파일명
  STRG_FILE_NM    VARCHAR(255) NOT NULL,                      -- 저장 파일명
  FILE_SZ         BIGINT       NOT NULL,                      -- 파일 크기(byte)
  FILE_MIME       VARCHAR(100),                               -- MIME 타입
  DWLD_CNT        INTEGER      NOT NULL DEFAULT 0,            -- 다운로드 횟수
  MENU_SEQO       INTEGER      NOT NULL DEFAULT 0,
  FRST_REG_DT     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT PK_HP_ATTACH PRIMARY KEY (ATCH_SQNO)
);
COMMENT ON TABLE TBL_HP_ATTACH IS '첨부파일';
CREATE INDEX IF NOT EXISTS IX_HP_ATTACH_01 ON TBL_HP_ATTACH (REF_TBL_NM, REF_SQNO);

-- 약관 / 개인정보처리방침  (레거시 tb_yark)
CREATE TABLE IF NOT EXISTS TBL_HP_TERM (
  TERM_SQNO       BIGINT      GENERATED ALWAYS AS IDENTITY,
  TERM_KND_CD     VARCHAR(20) NOT NULL,                       -- PRIVACY / EMAIL / SERVICE
  TERM_CTT        TEXT        NOT NULL,                       -- 본문 (HTML)
  APLY_BGNG_DT    TIMESTAMPTZ NOT NULL DEFAULT NOW(),         -- 시행일
  USE_YN          CHAR(1)     NOT NULL DEFAULT 'Y',
  FRST_REG_DT     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  LST_CHG_DT      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  LST_CHGR_EMPNO  VARCHAR(30),
  CONSTRAINT PK_HP_TERM PRIMARY KEY (TERM_SQNO),
  CONSTRAINT CK_HP_TERM_USE_YN CHECK (USE_YN IN ('Y', 'N'))
);
COMMENT ON TABLE TBL_HP_TERM IS '약관/개인정보처리방침';
CREATE INDEX IF NOT EXISTS IX_HP_TERM_01 ON TBL_HP_TERM (TERM_KND_CD, USE_YN, APLY_BGNG_DT DESC);
