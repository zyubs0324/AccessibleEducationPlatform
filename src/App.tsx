import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

type Role = "guest" | "member" | "tutor";
type AdminRole = "총괄 관리자" | "콘텐츠 담당" | "접수 담당" | "문의 담당";
type Recruitment = {
  id: string;
  title: string;
  program: string;
  type: string;
  status: "모집 중" | "모집 예정" | "마감";
  period: string;
  schedule: string;
  place: string;
  target: string;
  external?: boolean;
  summary: string;
};

const initialRecruitments: Recruitment[] = [
  { id: "R-2026-09", title: "점자 첫걸음 가을반", program: "점자 첫걸음", type: "교육", status: "모집 중", period: "2026.10.12 — 10.28", schedule: "11.07 — 12.12, 매주 토요일", place: "서울 교육장 · 온라인 병행", target: "초등 1–3학년 시각장애 아동과 보호자", summary: "촉각 탐색에서 시작해 점자 읽기의 기초를 가족과 함께 익히는 6주 과정입니다." },
  { id: "R-2026-10", title: "보호자 점자 이해 워크숍", program: "보호자 점자 이해 워크숍", type: "행사", status: "모집 중", period: "2026.10.15 — 11.02", schedule: "11.14 토요일 13:00", place: "온라인", target: "시각장애 아동 보호자", external: true, summary: "가정에서 아이의 점자 학습을 지지하는 방법을 함께 알아봅니다." },
  { id: "R-2026-11", title: "겨울방학 읽기·쓰기 점자교실", program: "읽기·쓰기 점자교실", type: "교육", status: "모집 예정", period: "2026.11.09 — 11.27", schedule: "2027.01.05 — 01.22", place: "서울 교육장", target: "초등 3–6학년", summary: "겨울방학 동안 문장 읽기와 생각 쓰기를 차근차근 연습합니다." },
  { id: "R-2026-08", title: "교사 학습지원 세미나", program: "교사 학습지원 세미나", type: "행사", status: "마감", period: "2026.09.01 — 09.30", schedule: "10.17 토요일", place: "온라인", target: "특수교육 교사와 지원 인력", summary: "학교 현장의 점자 학습 지원 사례와 자료 활용법을 나눕니다." },
  { id: "R-2026-07", title: "생활 속 보행교육 3기", program: "생활 속 보행교육", type: "교육", status: "마감", period: "2026.08.17 — 09.04", schedule: "09.19 — 10.10", place: "서울 서북권", target: "초등 4–6학년", summary: "익숙한 생활 공간에서 안전하게 이동하는 경험을 쌓습니다." },
  { id: "R-2026-12", title: "촉각 독서 활동 주말반", program: "촉각 독서 활동", type: "교육", status: "모집 예정", period: "2026.11.16 — 12.04", schedule: "12.19 토요일", place: "서울 교육장", target: "초등 전 학년", summary: "촉각 그림책을 함께 읽고 이야기하며 표현의 폭을 넓힙니다." },
  { id: "R-2026-06", title: "여름 점자 읽기 캠프", program: "읽기·쓰기 점자교실", type: "교육", status: "마감", period: "2026.06.01 — 06.19", schedule: "07.27 — 07.31", place: "경기 연수원", target: "초등 4–6학년", summary: "또래와 함께 읽고 기록하는 여름 집중 프로그램입니다." },
  { id: "R-2026-13", title: "교사를 위한 촉각자료 제작 실습", program: "교사 학습지원 세미나", type: "행사", status: "모집 중", period: "2026.10.05 — 10.23", schedule: "10.31 토요일", place: "대전 교육장", target: "특수교육 교사", external: true, summary: "수업 목표에 맞는 단순하고 명확한 촉각자료 제작 원칙을 실습합니다." },
  { id: "R-2026-05", title: "우리 동네 보행 연습", program: "생활 속 보행교육", type: "교육", status: "마감", period: "2026.04.06 — 04.24", schedule: "05.09 — 05.30", place: "참여자 거주 지역", target: "초등 3–6학년", summary: "생활권 안의 주요 목적지를 안전하게 오가는 방법을 연습했습니다." },
];

const programs = [
  ["점자 첫걸음", "촉각 탐색부터 점자 읽기 준비까지 아이의 속도에 맞춰 시작합니다.", "초등 저학년"],
  ["읽기·쓰기 점자교실", "문장 읽기와 생각 쓰기를 연결하는 단계별 학습 과정입니다.", "초등 3–6학년"],
  ["생활 속 보행교육", "학교와 동네에서 스스로 이동하는 경험을 안전하게 넓힙니다.", "초등 전 학년"],
  ["보호자 점자 이해 워크숍", "가정에서 학습을 지지하는 보호자의 역할과 대화법을 나눕니다.", "보호자"],
  ["교사 학습지원 세미나", "학교 수업에서 활용할 수 있는 지원 원칙과 사례를 공유합니다.", "교사"],
  ["촉각 독서 활동", "촉각 그림책과 이야기를 통해 읽기의 즐거움을 발견합니다.", "초등 전 학년"],
];

const resourceNames = [
  "촉각 탐색 놀이 활동지", "점자 읽기 첫걸음", "가정에서 함께하는 점자 놀이", "튜터 수업 준비 체크리스트",
  "교실 환경 점검 안내서", "점자 쓰기 관찰 기록지", "생활 속 방향 개념 카드", "보호자 대화 안내",
  "촉각 그림책 읽기 질문 카드", "학습 속도 기록표", "기초 점형 탐색 자료", "방향과 위치 활동지",
  "수업 마무리 회고지", "교사 협력 체크리스트", "보행교육 준비 안내", "온라인 수업 접근성 점검표",
  "튜터 사례 기록 양식", "튜터 안전 운영 가이드",
];
const resources = resourceNames.map((title, i) => ({
  id: `D-${String(i + 1).padStart(3, "0")}`, title, target: i % 3 === 0 ? "보호자" : i % 3 === 1 ? "학습자" : "교사",
  stage: i % 2 ? "기초" : "탐색", format: i % 4 === 0 ? "DOCX" : "PDF", tutorOnly: i === 3 || i > 15,
  summary: "수업과 가정에서 바로 활용할 수 있도록 활동 순서와 관찰 포인트를 정리한 시연용 자료입니다.",
}));

const faqs = [
  ["교육 신청에 회원가입이 필요한가요?", "아니요. 교육 신청은 회원가입 없이 가능합니다. 신청 후 접수번호와 직접 설정한 비밀번호로 내역을 확인해 주세요."],
  ["사전등록을 하면 교육이 확정되나요?", "사전등록은 관심 교육의 다음 모집 소식을 받기 위한 절차이며, 정식 신청이나 선발 확정을 뜻하지 않습니다."],
  ["교육비가 있나요?", "모집마다 운영 조건이 다를 수 있습니다. 각 모집 상세의 비용과 준비물 안내를 확인해 주세요."],
  ["외부 설문 신청은 어디에서 확인하나요?", "외부 설문으로 접수한 내용은 이 홈페이지의 내역 확인에서 조회되지 않습니다. 해당 외부 서비스 안내를 확인해 주세요."],
  ["자료실은 누가 이용할 수 있나요?", "일반 학습자료는 회원이 이용할 수 있고, 튜터 전용 자료는 승인된 튜터 회원에게만 제공됩니다."],
  ["형제자매가 함께 신청할 수 있나요?", "학습자별 교육 필요와 일정을 확인하기 위해 각각 신청해 주세요."],
];

const nav = [
  ["교육 안내", "/programs"], ["교육 신청", "/recruitments"], ["튜터 참여", "/tutors"],
  ["학습자료", "/resources"], ["교육 정보", "/information"], ["소식", "/news"], ["도움", "/support"],
];

function go(path: string) {
  history.pushState({}, "", path);
  dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function Link({ to, children, className = "" }: { to: string; children: ReactNode; className?: string }) {
  return <a href={to} className={className} onClick={(e) => { e.preventDefault(); go(to); }}>{children}</a>;
}

function Button({ children, variant = "primary", type = "button", onClick, disabled = false }: {
  children: ReactNode; variant?: "primary" | "secondary" | "ghost" | "orange"; type?: "button" | "submit"; onClick?: () => void; disabled?: boolean;
}) {
  return <button type={type} disabled={disabled} className={`btn btn-${variant}`} onClick={onClick}>{children}</button>;
}

function Tag({ children, tone = "default" }: { children: ReactNode; tone?: string }) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}

function Field({ label, name, type = "text", placeholder = "", required = false, error = "", defaultValue = "" }: {
  label: string; name: string; type?: string; placeholder?: string; required?: boolean; error?: string; defaultValue?: string;
}) {
  return <label className="field"><span>{label}{required && <b aria-label="필수"> *</b>}</span><input name={name} type={type} placeholder={placeholder} required={required} defaultValue={defaultValue} aria-invalid={!!error} />{error && <small className="error">{error}</small>}</label>;
}

function SelectField({ label, name, children }: { label: string; name: string; children: ReactNode }) {
  return <label className="field"><span>{label}</span><select name={name}>{children}</select></label>;
}

function PageHead({ eyebrow, title, desc }: { eyebrow?: string; title: string; desc: string }) {
  return <div className="page-head"><div className="container"><p className="eyebrow">{eyebrow || "함께 읽는 세상"}</p><h1>{title}</h1><p>{desc}</p></div></div>;
}

function Breadcrumb({ current }: { current: string }) {
  return <nav className="breadcrumb" aria-label="현재 위치"><div className="container"><Link to="/">홈</Link><span>/</span><span aria-current="page">{current}</span></div></nav>;
}

function Header({ role, onRole }: { role: Role; onRole: (r: Role) => void }) {
  const [open, setOpen] = useState(false);
  return <>
    <a href="#main" className="skip">본문 바로가기</a>
    <div className="service-bar"><div className="container"><span>행복나눔재단 시각장애 아동 교육 사업</span><span>시연 기준일 2026.10.19</span></div></div>
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="wordmark"><span className="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>함께 읽는 세상<small>가칭 · 교육 통합 플랫폼</small></span></Link>
        <nav className="desktop-nav" aria-label="주요 메뉴">{nav.map(([n, p]) => <Link key={p} to={p}>{n}</Link>)}</nav>
        <div className="header-actions"><Link to="/search" className="icon-link" aria-label="통합검색">검색</Link>{role === "guest" ? <Link to="/login" className="login-link">로그인</Link> : <button className="login-link" onClick={() => onRole("guest")}>{role === "tutor" ? "승인 튜터" : "일반 회원"} · 로그아웃</button>}<button className="menu-button" aria-expanded={open} onClick={() => setOpen(!open)}>전체 메뉴</button></div>
      </div>
      {open && <div className="mega"><div className="container mega-grid">{[...nav, ["교재·교구", "/materials"], ["기관·사업 소개", "/about"], ["회원 커뮤니티", "/community"], ["신청 내역 확인", "/applications/lookup"]].map(([n,p]) => <Link key={p} to={p} className="mega-item" onClick={() => setOpen(false)}><b>{n}</b><span>관련 안내와 서비스를 확인합니다</span></Link>)}</div></div>}
    </header>
  </>;
}

function Footer() {
  return <footer><div className="container footer-grid"><div><div className="footer-brand">함께 읽는 세상</div><p>아이의 배움이 더 넓은 세상으로 이어지도록<br/>행복나눔재단 시각장애 아동 교육 사업</p></div><div><b>서비스 안내</b><Link to="/privacy">개인정보 처리방침</Link><Link to="/terms">이용약관</Link><Link to="/contact">연락처·운영기관 정보</Link></div><div><b>문의</b><p>support@example.org<br/>02-0000-0000<br/>평일 10:00–17:00</p></div></div><div className="container footer-note">본 사이트의 인물·연락처·운영 데이터는 프로토타입을 위한 가상 정보입니다.</div></footer>;
}

function Home() {
  return <main id="main">
    <section className="hero"><div className="container hero-grid"><div><Tag tone="orange">배움의 가능성을 함께 넓힙니다</Tag><h1>아이의 배움이<br/><em>더 넓은 세상</em>으로<br/>이어지도록</h1><p>시각장애 아동과 가족, 교사, 튜터가 필요한 교육과 자료를 한곳에서 편안하게 찾을 수 있습니다.</p><div className="button-row"><Link to="/programs" className="btn btn-primary">교육 알아보기</Link><Link to="/recruitments" className="btn btn-secondary">모집 중 교육 보기</Link></div><p className="sub-link"><Link to="/pre-registration">지금 맞는 모집이 없다면 상시 사전등록하기 →</Link></p></div><div className="hero-art" role="img" aria-label="책과 점자 교구를 함께 살펴보는 교육 활동 일러스트"><div className="sun"></div><div className="book"><span></span><span></span></div><div className="dots">{Array.from({length: 18}).map((_,i)=><i key={i}></i>)}</div><div className="leaf leaf-a"></div><div className="leaf leaf-b"></div></div></div></section>
    <section className="quick"><div className="container quick-grid"><div><span>무엇을 찾고 계신가요?</span><b>필요한 길을 바로 안내해 드릴게요.</b></div><Link to="/programs"><span>01</span><b>교육을 알아봐요</b><small>점자·보행·다양한 교육</small></Link><Link to="/applications/lookup"><span>02</span><b>신청 내역을 확인해요</b><small>접수번호로 안전하게 조회</small></Link><Link to="/support"><span>03</span><b>도움이 필요해요</b><small>FAQ와 비공개 문의</small></Link></div></section>
    <section className="section container"><div className="section-head"><div><p className="eyebrow">교육 프로그램</p><h2>아이의 오늘에 맞는 배움</h2><p>속도와 경험을 존중하며 일상으로 이어지는 교육을 만듭니다.</p></div><Link to="/programs">전체 프로그램 보기 →</Link></div><div className="feature-grid"><Link to="/programs/braille" className="feature-card teal"><span>01 · BRAILLE</span><h3>점자교육</h3><p>손끝의 탐색에서 읽고 쓰는 즐거움까지, 아이의 단계에 맞춰 함께합니다.</p><b>점자교육 자세히 보기 →</b></Link><Link to="/programs/mobility" className="feature-card orange"><span>02 · MOBILITY</span><h3>보행교육</h3><p>익숙한 공간에서 시작해 스스로 움직이는 자신감과 경험을 쌓습니다.</p><b>보행교육 자세히 보기 →</b></Link><Link to="/programs" className="feature-card cream"><span>03 · TOGETHER</span><h3>함께하는 교육</h3><p>보호자와 교사를 위한 워크숍, 촉각 독서 활동을 만나 보세요.</p><b>다른 프로그램 보기 →</b></Link></div></section>
    <section className="section soft"><div className="container"><div className="section-head"><div><p className="eyebrow">지금 신청할 수 있어요</p><h2>모집 중인 교육과 행사</h2></div><Link to="/recruitments">모든 모집 보기 →</Link></div><div className="recruit-grid">{initialRecruitments.filter(r=>r.status==="모집 중").slice(0,3).map(r=><RecruitCard key={r.id} item={r}/>)}</div></div></section>
    <section className="section container split"><div><p className="eyebrow">처음 오셨나요?</p><h2>궁금한 점부터<br/>천천히 살펴보세요.</h2><p>신청 전 자주 묻는 질문을 모았습니다. 더 필요한 내용은 비공개 문의로 남겨 주세요.</p><Link to="/support" className="btn btn-secondary">FAQ 전체 보기</Link></div><div className="faq-list">{faqs.slice(0,4).map(([q,a],i)=><details key={q} open={i===0}><summary>{q}<span>＋</span></summary><p>{a}</p></details>)}</div></section>
    <section className="cta-band"><div className="container"><div><p>다음 모집 소식을 놓치고 싶지 않다면</p><h2>관심 교육을 미리 알려 주세요.</h2><span>사전등록은 정식 신청이나 선발 확정이 아닙니다. 모집이 열리면 안내드려요.</span></div><Link to="/pre-registration" className="btn btn-light">상시 사전등록 하기</Link></div></section>
  </main>;
}

function RecruitCard({ item }: { item: Recruitment }) {
  return <Link to={`/recruitments/${item.id}`} className="recruit-card"><div><Tag tone={item.status === "모집 중" ? "open" : item.status === "모집 예정" ? "soon" : "closed"}>{item.status}</Tag><Tag>{item.type}</Tag></div><h3>{item.title}</h3><p>{item.summary}</p><dl><div><dt>신청 기간</dt><dd>{item.period}</dd></div><div><dt>대상</dt><dd>{item.target}</dd></div></dl><b>{item.external ? "외부 신청 안내 보기" : item.status === "모집 중" ? "모집 상세와 신청 보기" : "모집 상세 보기"} →</b></Link>;
}

function Programs({ path }: { path: string }) {
  const detail = path !== "/programs";
  if (detail) {
    const mobility = path.includes("mobility");
    const title = mobility ? "생활 속 보행교육" : "점자 첫걸음";
    return <main id="main"><Breadcrumb current={title}/><PageHead eyebrow="교육 프로그램" title={title} desc={mobility ? "일상 속 이동 경험을 안전하게 넓히는 단계별 교육입니다." : "손끝의 탐색에서 시작해 점자 읽기 준비를 차근차근 돕습니다."}/><div className="container content-layout"><article className="article"><section><h2>교육의 목적</h2><p>아이마다 다른 감각 경험과 학습 속도를 존중합니다. 활동을 통해 자신만의 방법을 발견하고, 배움이 일상에서 자연스럽게 이어지도록 돕습니다.</p></section><section><h2>이런 분께 권해요</h2><ul><li>새로운 학습 방법을 편안하게 시작하고 싶은 아동</li><li>가정에서 아이의 배움을 함께 지원하고 싶은 보호자</li><li>아이의 현재 단계를 이해하고 다음 경험을 설계하고 싶은 가족</li></ul></section><section><h2>진행 단계</h2><div className="steps"><div><b>01</b><span>현재 경험 확인</span></div><div><b>02</b><span>개별 목표 세우기</span></div><div><b>03</b><span>활동과 연습</span></div><div><b>04</b><span>가정 연계 안내</span></div></div></section><section><h2>운영 방식</h2><p>소규모 그룹과 개별 활동을 함께 운영하며, 모집 회차별 일정과 장소는 연결된 모집 공고에서 안내합니다. 프로그램 소개와 실제 모집 일정은 다를 수 있습니다.</p></section></article><aside className="side-card"><Tag tone="orange">연결된 모집</Tag><h3>점자 첫걸음 가을반</h3><p>10월 28일까지 신청할 수 있습니다.</p><Link to="/recruitments/R-2026-09" className="btn btn-primary">모집 상세 보기</Link></aside></div></main>;
  }
  return <main id="main"><Breadcrumb current="교육 안내"/><PageHead title="배움의 시작부터 일상까지" desc="아이와 가족의 필요에 따라 선택할 수 있는 교육 프로그램을 소개합니다. 회차별 일정은 모집 공고에서 확인해 주세요."/><div className="container section"><div className="notice"><b>프로그램 소개와 모집 공고는 달라요.</b><span>아래는 상시 운영 방향입니다. 신청 가능한 회차는 교육 신청 메뉴에서 확인해 주세요.</span></div><div className="program-list">{programs.map((p,i)=><Link key={p[0]} to={i===2?"/programs/mobility":"/programs/braille"} className="program-row"><span>{String(i+1).padStart(2,"0")}</span><div><Tag>{p[2]}</Tag><h2>{p[0]}</h2><p>{p[1]}</p></div><b>자세히 보기 →</b></Link>)}</div></div></main>;
}

function Recruitments({ path, recruitments }: { path: string; recruitments: Recruitment[] }) {
  const id = path.split("/")[2];
  if (id) {
    const item = recruitments.find(r=>r.id===id) || recruitments[0];
    if (path.endsWith("/apply")) return <ApplicationForm item={item}/>;
    if (path.endsWith("/external")) return <ExternalNotice item={item}/>;
    return <main id="main"><Breadcrumb current={item.title}/><PageHead eyebrow={`${item.program} · ${item.id}`} title={item.title} desc={item.summary}/><div className="container content-layout"><article className="article"><div className="status-line"><Tag tone={item.status==="모집 중"?"open":item.status==="모집 예정"?"soon":"closed"}>{item.status}</Tag><span>신청 기간 {item.period}</span></div><section><h2>모집 안내</h2><dl className="info-table"><div><dt>교육 대상</dt><dd>{item.target}</dd></div><div><dt>교육 일정</dt><dd>{item.schedule}</dd></div><div><dt>장소</dt><dd>{item.place}</dd></div><div><dt>신청 방법</dt><dd>{item.external ? "외부 설문에서 신청" : "홈페이지 자체 신청서 작성"}</dd></div></dl></section><section><h2>선정 및 진행 단계</h2><div className="steps"><div><b>01</b><span>신청 접수</span></div><div><b>02</b><span>내용 검토</span></div><div><b>03</b><span>선정 안내</span></div><div><b>04</b><span>교육 참여</span></div></div><p>신청 완료는 참여 확정을 뜻하지 않습니다. 검토 후 입력한 연락처로 선정 결과를 별도 안내합니다.</p></section><section><h2>문의</h2><p>운영팀 support@example.org · 02-0000-0000</p></section></article><aside className="side-card sticky"><span>신청 기간</span><h3>{item.period}</h3><p>{item.external ? "외부 설문 서비스로 이동하며, 이 사이트에서 접수번호가 생성되지 않습니다." : "신청 전 대상과 일정을 다시 확인해 주세요."}</p>{item.status==="모집 중" ? <Link to={`/recruitments/${item.id}/${item.external?"external":"apply"}`} className="btn btn-primary">{item.external?"외부 신청 안내":"신청서 작성하기"}</Link>:<Button disabled>{item.status==="모집 예정"?"아직 신청 전이에요":"모집이 마감되었어요"}</Button>}<Link to="/pre-registration" className="text-link">다음 모집 사전등록</Link></aside></div></main>;
  }
  return <main id="main"><Breadcrumb current="교육 신청"/><PageHead title="교육과 행사에 참여해 보세요" desc="모집 상태와 일정을 확인하고 나에게 맞는 교육을 신청할 수 있습니다."/><ListFilter/><div className="container section compact"><div className="result-head"><b>전체 {recruitments.length}건</b><span>기준일 2026.10.19</span></div><div className="recruit-grid">{recruitments.map(r=><RecruitCard key={r.id} item={r}/>)}</div></div></main>;
}

function ListFilter() {
  return <div className="filter-wrap"><div className="container filter-grid"><Field label="검색" name="q" placeholder="교육명이나 내용을 입력하세요"/><SelectField label="유형" name="type"><option>전체</option><option>교육</option><option>행사</option></SelectField><SelectField label="모집 상태" name="status"><option>전체</option><option>모집 중</option><option>모집 예정</option><option>마감</option></SelectField><Button>조건으로 찾기</Button></div></div>;
}

function ApplicationForm({ item }: { item: Recruitment }) {
  const [submitted, setSubmitted] = useState(false);
  const [tried, setTried] = useState(false);
  const [valid, setValid] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setTried(true);
    const fd = new FormData(e.currentTarget);
    if (!fd.get("guardian") || !fd.get("learner") || !fd.get("phone") || !fd.get("agree")) return;
    setValid(true); setTimeout(()=>setSubmitted(true), 250);
  }
  if (submitted) return <Completion type="교육 신청" number="EDU-261019-025" title={item.title}/>;
  return <main id="main"><Breadcrumb current="교육 신청서"/><PageHead eyebrow="2분 정도 걸려요" title={`${item.title} 신청`} desc="필요한 최소 정보만 받고 있습니다. 별표(*) 항목은 꼭 입력해 주세요."/><form className="container form-layout" onSubmit={submit} noValidate><div>{tried && !valid && <div className="error-summary" role="alert"><b>입력 내용을 확인해 주세요.</b><span>필수 항목을 입력하고 동의 여부를 확인해 주세요.</span></div>}<FormSection n="1" title="보호자 정보"><div className="form-grid"><Field label="보호자 이름" name="guardian" required error={tried?"이름을 입력해 주세요.":""}/><Field label="연락처" name="phone" placeholder="010-0000-0000" required/><Field label="이메일" name="email" type="email" placeholder="name@example.org"/></div></FormSection><FormSection n="2" title="학습자와 교육 정보"><div className="form-grid"><Field label="학습자 이름 또는 별칭" name="learner" required/><SelectField label="학년" name="grade"><option>선택해 주세요</option><option>초등 1학년</option><option>초등 2학년</option><option>초등 3학년</option></SelectField><SelectField label="현재 학습 단계" name="stage"><option>처음 시작해요</option><option>기초를 배우고 있어요</option><option>문장을 읽고 써요</option></SelectField></div><label className="field"><span>이번 교육에서 기대하는 점 *</span><textarea name="need" rows={5} placeholder="아이에게 필요한 학습 경험을 편안하게 적어 주세요."></textarea></label></FormSection><FormSection n="3" title="조회 정보와 동의"><div className="form-grid"><Field label="조회용 비밀번호" name="password" type="password" required/><Field label="비밀번호 확인" name="password2" type="password" required/></div><label className="check"><input type="checkbox" name="agree" value="yes"/><span><b>[필수] 신청 처리에 필요한 개인정보 수집·이용에 동의합니다.</b><small>접수 확인과 운영 안내 목적으로만 사용합니다.</small></span></label><label className="check"><input type="checkbox"/><span><b>[선택] 다음 교육 소식 수신에 동의합니다.</b><small>동의하지 않아도 신청할 수 있습니다.</small></span></label></FormSection><div className="form-actions"><Link to={`/recruitments/${item.id}`} className="btn btn-ghost">취소하고 돌아가기</Link><Button type="submit">입력 내용 확인하고 제출</Button></div></div><aside className="side-card sticky"><Tag tone="open">모집 중</Tag><h3>{item.title}</h3><p>{item.schedule}<br/>{item.place}</p><hr/><b>꼭 확인해 주세요</b><p>접수 완료는 선발 확정이 아닙니다. 제출 후 접수번호를 보관해 주세요.</p></aside></form></main>;
}

function FormSection({n,title,children}:{n:string;title:string;children:ReactNode}) {
  return <section className="form-section"><div className="form-title"><span>{n}</span><h2>{title}</h2></div>{children}</section>;
}

function Completion({type,number,title}:{type:string;number:string;title:string}) {
  return <main id="main" className="complete-page"><div className="complete-mark">✓</div><p className="eyebrow">{type} 접수 완료</p><h1>신청해 주셔서 고맙습니다.</h1><p>{title} 접수가 안전하게 완료되었습니다.<br/>신청 내용 검토 후 입력한 연락처로 안내드리겠습니다.</p><div className="receipt"><span>접수번호</span><strong>{number}</strong><small>내역 확인에 필요하니 접수번호와 비밀번호를 따로 보관해 주세요.</small></div><div className="notice"><b>접수 완료는 선발 확정이 아닙니다.</b><span>담당자 검토 후 선정 여부를 별도로 안내합니다.</span></div><div className="button-row center"><Link to="/applications/lookup" className="btn btn-primary">신청 내역 확인하기</Link><Link to="/" className="btn btn-secondary">홈으로 가기</Link></div></main>;
}

function ExternalNotice({item}:{item:Recruitment}) {
  return <main id="main" className="complete-page"><div className="external-icon">↗</div><p className="eyebrow">외부 서비스 이동 안내</p><h1>외부 설문에서 신청합니다.</h1><p><b>{item.title}</b>은 운영기관이 별도로 관리하는 외부 설문을 사용합니다.</p><div className="notice left"><b>이동하기 전에 확인해 주세요.</b><span>이 홈페이지의 자체 신청서나 접수번호는 생성되지 않습니다. 외부 서비스의 개인정보 처리와 접수 확인 방식을 확인해 주세요.</span></div><div className="button-row center"><Link to="/external-example" className="btn btn-primary">예시 외부 설문으로 이동</Link><Link to={`/recruitments/${item.id}`} className="btn btn-secondary">취소하고 돌아가기</Link></div></main>;
}

function PreRegistration({path}:{path:string}) {
  const [done,setDone]=useState(path.endsWith("/complete"));
  if(done) return <Completion type="상시 사전등록" number="PRE-261019-019" title="점자교육 모집 소식 사전등록"/>;
  return <main id="main"><Breadcrumb current="상시 사전등록"/><PageHead title="관심 교육을 미리 알려 주세요" desc="맞는 모집이 아직 없다면 사전등록해 주세요. 다음 모집이 열릴 때 안내받을 수 있습니다."/><div className="container form-layout"><form onSubmit={(e)=>{e.preventDefault();setDone(true)}}><div className="notice"><b>사전등록은 정식 교육 신청이나 선발 확정이 아닙니다.</b><span>다음 모집 안내를 위한 관심 정보 등록이며, 모집이 열리면 별도의 신청서를 작성해야 합니다.</span></div><FormSection n="1" title="희망 교육"><div className="choice-grid">{["점자 첫걸음","읽기·쓰기 점자교실","생활 속 보행교육","촉각 독서 활동"].map(x=><label className="check-card" key={x}><input type="checkbox"/><span>{x}</span></label>)}</div></FormSection><FormSection n="2" title="연락 정보"><div className="form-grid"><Field name="learner" label="학습자 이름 또는 별칭" required/><Field name="guardian" label="보호자 이름" required/><Field name="phone" label="연락처" required/><SelectField name="contact" label="선호 연락 방법"><option>문자</option><option>이메일</option><option>전화</option></SelectField></div></FormSection><FormSection n="3" title="동의"><label className="check"><input type="checkbox" required/><span><b>[필수] 모집 안내를 위한 개인정보 수집·이용에 동의합니다.</b><small>철회를 원하면 support@example.org로 접수번호와 함께 알려 주세요. 유사한 연락처의 중복 등록은 담당자가 확인할 수 있습니다.</small></span></label></FormSection><Button type="submit">사전등록 완료하기</Button></form><aside className="side-card sticky"><h3>안내 절차</h3><ol className="number-list"><li><b>관심 교육 등록</b><span>희망 교육과 연락 방법 입력</span></li><li><b>다음 모집 안내</b><span>담당자가 대상 확인 후 수동 안내</span></li><li><b>정식 신청</b><span>모집 공고에서 별도 신청</span></li></ol></aside></div></main>;
}

function Lookup({kind="교육 신청"}:{kind?:string}) {
  const [state,setState]=useState<"form"|"error"|"found">("form");
  if(state==="found") return <main id="main"><Breadcrumb current={`${kind} 내역`}/><PageHead title={`${kind} 내역`} desc="접수한 내용과 현재 처리 상태를 확인할 수 있습니다."/><div className="container narrow section"><div className="application-status"><Tag tone="soon">검토 중</Tag><h2>{kind==="문의"?"수업 자료 이용 권한을 알고 싶어요":kind==="튜터 지원"?"점자 첫걸음 학습 튜터 지원":"점자 첫걸음 가을반"}</h2><p>접수번호 EDU-261019-025 · 2026.10.19 접수</p><div className="timeline"><div className="active"><b>접수</b><span>10.19 완료</span></div><div className="active"><b>검토 중</b><span>담당자 확인 중</span></div><div><b>선정 안내</b><span>검토 후 안내</span></div></div><dl className="info-table"><div><dt>신청자</dt><dd>보호자 김하늘 · 학습자 별칭 ‘봄이’</dd></div><div><dt>연락처</dt><dd>010-0000-12**</dd></div><div><dt>처리 안내</dt><dd>2026년 10월 28일 이후 입력한 연락처로 안내 예정</dd></div></dl><div className="notice"><b>내용 변경이나 취소가 필요하신가요?</b><span>접수번호와 함께 support@example.org 또는 02-0000-0000으로 문의해 주세요.</span></div></div></div></main>;
  return <main id="main"><Breadcrumb current={`${kind} 내역 확인`}/><PageHead title={`${kind} 내역을 확인해요`} desc="접수할 때 받은 접수번호와 직접 설정한 비밀번호를 입력해 주세요."/><div className="container narrow section"><form className="lookup-card" onSubmit={(e)=>{e.preventDefault();setState(state==="form"?"error":"found")}}>{state==="error"&&<div className="error-summary" role="alert"><b>내역을 찾지 못했습니다.</b><span>접수번호와 비밀번호를 다시 확인해 주세요. 보안을 위해 등록 여부는 별도로 안내하지 않습니다.</span></div>}<Field label="접수번호" name="number" placeholder="예: EDU-261019-025" required defaultValue={state==="error"?"EDU-261019-025":""}/><Field label="조회 비밀번호" name="pw" type="password" required/><Button type="submit">{state==="error"?"다시 확인하기":"내역 확인하기"}</Button><p>자체 신청 건만 조회됩니다. 외부 설문으로 신청한 내용은 해당 외부 서비스에서 확인해 주세요.</p></form></div></main>;
}

function Resources({role,path}:{role:Role;path:string}) {
  if(role==="guest") return <Gate title="학습자료실은 회원에게 열려 있어요" desc="아이의 학습 정보가 담긴 자료를 안전하게 제공하기 위해 로그인 후 목록과 상세를 확인할 수 있습니다."/>;
  const tutorPath=path.includes("/tutor");
  if(tutorPath&&role!=="tutor") return <Gate title="승인된 튜터만 이용할 수 있어요" desc="튜터 지원 접수와 튜터 회원 권한은 별도입니다. 운영자 승인 후 전용 자료를 이용할 수 있습니다." restricted/>;
  const id=path.split("/").pop();
  const item=resources.find(r=>r.id===id);
  if(item) return <main id="main"><Breadcrumb current={item.title}/><PageHead eyebrow={`${item.format} · ${item.stage}`} title={item.title} desc={item.summary}/><div className="container content-layout"><article className="article"><section><h2>자료 소개</h2><p>학습자의 반응을 관찰하며 활동 속도와 순서를 조절할 수 있도록 구성했습니다. 이 자료는 시연용 예시이며 실제 교육 현장에서는 담당 전문가와 협의해 활용해 주세요.</p></section><section><h2>활용 방법</h2><ul><li>활동 전 학습자와 목표와 순서를 함께 확인합니다.</li><li>정답보다 탐색 과정과 표현을 충분히 기다립니다.</li><li>활동 후 편안했던 점과 어려웠던 점을 기록합니다.</li></ul></section></article><aside className="side-card"><h3>첨부파일</h3><div className="file-box"><b>{item.title}.{item.format.toLowerCase()}</b><span>{item.format} · 1.2MB · 시연용</span></div><Button onClick={()=>alert("시연용 파일 다운로드를 시작합니다.")}>샘플 파일 다운로드</Button><small>실제 교육 자료가 아닌 프로토타입용 샘플입니다.</small></aside></div></main>;
  return <main id="main"><Breadcrumb current="학습자료실"/><PageHead title={tutorPath?"튜터 전용 자료":"배움을 이어가는 학습자료"} desc={tutorPath?"승인된 튜터의 수업 준비와 기록을 돕는 전용 자료입니다.":"가정과 교실에서 활용할 수 있는 학습자료를 모았습니다."}/><div className="container tabs"><Link to="/resources" className={!tutorPath?"active":""}>일반 학습자료</Link><Link to="/resources/tutor" className={tutorPath?"active":""}>튜터 전용 자료</Link></div><ListFilter/><div className="container section compact"><div className="resource-grid">{resources.filter(r=>tutorPath?r.tutorOnly:!r.tutorOnly).map(r=><Link to={`/resources/${tutorPath?"tutor/":""}${r.id}`} className="resource-card" key={r.id}><div className="file-type">{r.format}</div><Tag>{r.target}</Tag><Tag>{r.stage}</Tag><h3>{r.title}</h3><p>{r.summary}</p><span>{r.format} · 1.2MB</span></Link>)}</div></div></main>;
}

function Gate({title,desc,restricted=false}:{title:string;desc:string;restricted?:boolean}) {
  return <main id="main" className="gate"><div className="gate-symbol">{restricted?"!":"⌁"}</div><p className="eyebrow">접근 안내</p><h1>{title}</h1><p>{desc}</p><div className="button-row center">{restricted?<><Link to="/tutors" className="btn btn-primary">튜터 활동 안내 보기</Link><Link to="/" className="btn btn-secondary">홈으로 가기</Link></>:<><Link to="/login?next=/resources" className="btn btn-primary">로그인하고 이용하기</Link><Link to="/signup" className="btn btn-secondary">회원가입</Link></>}</div></main>;
}

const hubData: Record<string,{title:string;desc:string;items:string[]}> = {
  "/materials": {title:"교재·교구를 살펴보세요",desc:"학습 단계와 활동에 맞는 도구의 특징과 활용법을 소개합니다. 구매와 결제는 제공하지 않습니다.",items:["점자판과 점필","점자 라벨 활용 세트","촉각 그림책","촉각 도형판","자석 점자 블록","촉각 지도 기초판","휴대용 점자 메모 도구","소리·촉각 활동 카드"]},
  "/information": {title:"점자·보행 정보를 만나 보세요",desc:"배움과 생활에 참고할 수 있는 정보를 쉬운 말로 정리했습니다. 시연용 콘텐츠이며 공식 지침이 아닙니다.",items:["점자를 처음 만날 때 알아둘 점","촉각 탐색을 편안하게 시작하는 환경","가정에서 방향 개념을 이야기하는 법","학교와 보행교육 협력하기","학습자료의 대체텍스트 확인하기","새 학기 교실 환경 함께 살피기","보호자와 교사의 관찰 기록","교육 지원 제도 확인 경로","아이와 이동 계획 세우기","보조공학 기기 선택 전 질문","촉각 그림책 함께 읽기","지역 교육 지원기관 찾기"]},
  "/news": {title:"함께 읽는 세상의 소식",desc:"교육 모집과 운영 안내, 사업 이야기를 전합니다.",items:["2026년 11월 교육 일정 안내","점자 첫걸음 가을반 모집","홈페이지 시연 서비스 이용 안내","촉각 독서 활동 현장 이야기","교사 학습지원 세미나 자료 안내","추석 연휴 문의 운영 안내","생활 속 보행교육 3기 마무리","개인정보 처리방침 검토 안내","여름 점자 읽기 캠프 이야기","상반기 교육 운영 돌아보기"]},
  "/community": {title:"서로의 경험을 나누는 공간",desc:"보호자, 교사, 튜터 회원이 개인정보 없이 별칭으로 경험과 아이디어를 나눕니다. 선택 기능입니다.",items:["아침 10분 점자 놀이를 시작했어요","새 교실을 함께 살펴본 기록","촉각책을 고를 때 아이에게 물어본 것","첫 수업 전 튜터가 준비한 질문","가정과 학교의 기록을 연결하는 방법","보행 연습 뒤 아이와 나눈 대화","수업 속도를 조절했던 경험","이번 달 함께 읽은 책을 소개해요"]},
};

function ContentHub({path,role}:{path:string;role:Role}) {
  const root="/"+path.split("/")[1];
  if(root==="/community"&&role==="guest") return <Gate title="회원 커뮤니티는 로그인 후 이용할 수 있어요" desc="경험을 안전하게 나누기 위해 회원에게만 글과 댓글을 공개합니다."/>;
  const d=hubData[root]||hubData["/information"];
  const detail=path.split("/").length>2;
  if(detail) return <main id="main"><Breadcrumb current={d.items[0]}/><PageHead title={decodeURIComponent(path.split("/").pop()||d.items[0])} desc={d.desc}/><article className="container article standalone"><p className="meta">2026.10.16 · 함께 읽는 세상 운영팀 · 시연용 콘텐츠</p><section><h2>먼저 살펴볼 점</h2><p>아이가 정보를 받아들이고 표현하는 방식은 모두 다릅니다. 정해진 방법을 빠르게 익히는 것보다 현재의 경험과 편안함을 확인하는 데서 시작합니다.</p></section><section><h2>일상에서 함께하는 방법</h2><p>활동의 목적과 순서를 먼저 설명하고 충분히 탐색할 시간을 주세요. 아이가 선택하거나 멈추고 싶다는 표현을 존중하고, 관찰한 내용은 보호자와 교사가 함께 나눌 수 있습니다.</p><div className="quote">“작은 변화도 기록하면 다음 배움을 설계하는 중요한 단서가 됩니다.”</div></section><section><h2>꼭 기억해 주세요</h2><p>이 글은 프로토타입을 위한 일반적인 예시 정보입니다. 개별 교육이나 제도에 관한 결정은 담당 전문가와 공식 기관의 최신 안내를 확인해 주세요.</p></section><div className="button-row"><Link to={root} className="btn btn-secondary">목록으로 돌아가기</Link>{root==="/community"&&<Button>글 수정하기</Button>}</div></article></main>;
  return <main id="main"><Breadcrumb current={d.title}/><PageHead title={d.title} desc={d.desc}/><ListFilter/><div className="container section compact"><div className="content-list">{d.items.map((x,i)=><Link to={`${root}/${encodeURIComponent(x)}`} key={x}><span>{root==="/news"?(i<2?"중요 공지":"사업 소식"):root==="/materials"?"교재·교구":root==="/community"?"경험 나눔":"배움 정보"}</span><div><h2>{x}</h2><p>{i%2?"아이의 경험을 존중하며 가정과 교육 현장에서 참고할 수 있는 내용을 담았습니다.":"처음 접하는 분도 이해하기 쉽도록 핵심 내용과 활용 방법을 차분히 정리했습니다."}</p></div><small>{root==="/news"?"2026.10."+String(18-i).padStart(2,"0"):"자세히 보기 →"}</small></Link>)}</div></div></main>;
}

function Support({path}:{path:string}) {
  if(path.includes("lookup")) return <Lookup kind="문의"/>;
  if(path.includes("new")) return <SimpleInquiry/>;
  return <main id="main"><Breadcrumb current="Q&A"/><PageHead title="무엇을 도와드릴까요?" desc="자주 묻는 질문을 찾거나, 필요한 답을 찾지 못했다면 비공개 문의를 남겨 주세요."/><div className="container tabs"><Link to="/support" className="active">자주 묻는 질문</Link><Link to="/support/new">비공개 문의하기</Link><Link to="/support/lookup">내 문의 확인</Link></div><div className="container split section"><div><p className="eyebrow">FAQ</p><h2>자주 묻는 질문</h2><p>교육 신청, 자료 이용, 튜터 활동에 관한 답을 확인하세요.</p></div><div className="faq-list">{[...faqs,...faqs,...faqs.slice(0,3)].map(([q,a],i)=><details key={i}><summary>{q}<span>＋</span></summary><p>{a}</p></details>)}</div></div></main>;
}

function SimpleInquiry() {
  const [done,setDone]=useState(false);
  if(done)return <Completion type="비공개 문의" number="QNA-261019-011" title="문의가 비공개로 접수되었습니다."/>;
  return <main id="main"><Breadcrumb current="비공개 문의"/><PageHead title="궁금한 점을 남겨 주세요" desc="회원가입 없이 문의할 수 있습니다. 답변은 접수번호와 비밀번호로만 확인할 수 있어요."/><form className="container narrow section form-section" onSubmit={e=>{e.preventDefault();setDone(true)}}><SelectField label="문의 유형" name="type"><option>교육 신청</option><option>학습자료</option><option>튜터 활동</option><option>기타</option></SelectField><Field label="제목" name="title" required/><label className="field"><span>문의 내용 *</span><textarea rows={7} required></textarea></label><Field label="답변 알림 이메일" name="email" type="email" placeholder="name@example.org" required/><Field label="조회 비밀번호" name="pw" type="password" required/><label className="check"><input type="checkbox" required/><span><b>[필수] 문의 처리에 필요한 개인정보 수집·이용 동의</b><small>화면의 간단한 질문이 이용하기 어렵다면 02-0000-0000으로 문의해 주세요.</small></span></label><Button type="submit">비공개 문의 접수하기</Button></form></main>;
}

function About({path}:{path:string}) {
  const business=path.includes("business");
  return <main id="main"><Breadcrumb current="기관·사업 소개"/><PageHead title={business?"배움의 연결을 만드는 사업":"행복나눔재단과 함께합니다"} desc={business?"시각장애 아동의 교육 경험이 가정과 학교, 지역으로 이어지도록 함께합니다.":"사람과 가능성을 연결하는 공익 활동의 하나로 시각장애 아동 교육 사업을 운영합니다."}/><div className="container tabs"><Link to="/about" className={!business?"active":""}>기관 소개</Link><Link to="/about/business" className={business?"active":""}>사업 소개</Link></div><article className="container article standalone"><section><p className="eyebrow">{business?"사업이 시작된 배경":"운영기관"}</p><h2>{business?"아이를 둘러싼 배움의 환경을 함께 봅니다.":"사람의 가능성이 이어지는 사회를 생각합니다."}</h2><p>아이의 학습은 교육 시간에만 머물지 않습니다. 가정에서의 연습, 학교에서의 지원, 지역에서의 이동이 자연스럽게 연결될 때 배움의 경험도 넓어집니다.</p></section><div className="feature-grid"><div className="plain-card"><b>배움의 시작</b><p>아이의 현재 경험을 이해하고 필요한 교육을 찾습니다.</p></div><div className="plain-card"><b>함께하는 사람</b><p>보호자, 교사, 튜터가 같은 방향을 바라보도록 돕습니다.</p></div><div className="plain-card"><b>일상으로 연결</b><p>교육에서 익힌 경험이 일상에서도 이어지게 지원합니다.</p></div></div><div className="notice"><b>프로토타입 안내</b><span>이 화면의 설명은 구조 검토를 위한 예시 문안이며, 공식 사업 성과나 확정된 기관 소개가 아닙니다.</span></div></article></main>;
}

function Auth({type,onLogin}:{type:string;onLogin:(r:Role)=>void}) {
  const [step,setStep]=useState(0); const [error,setError]=useState(false);
  if(step>0)return <main id="main" className="complete-page"><div className="complete-mark">✓</div><h1>{type==="signup"?"이메일을 확인해 주세요":"요청을 완료했어요"}</h1><p>{type==="signup"?"입력한 이메일로 확인 링크를 보냈습니다. 링크는 24시간 동안 유효합니다.":"비밀번호 재설정 링크를 보냈습니다. 링크가 만료되었다면 다시 요청해 주세요."}</p><Button onClick={()=>setStep(0)}>확인 메일 다시 보내기</Button></main>;
  if(type==="login")return <main id="main" className="auth-page"><div className="auth-copy"><p className="eyebrow">다시 만나서 반가워요</p><h1>로그인하고<br/>배움을 이어가세요.</h1><p>학습자료와 회원 커뮤니티를 안전하게 이용할 수 있습니다.</p></div><form className="auth-card" onSubmit={e=>{e.preventDefault();if(error){onLogin("member");go("/resources")}else setError(true)}}><h2>회원 로그인</h2>{error&&<div className="error-summary"><b>데모 로그인을 준비했어요.</b><span>한 번 더 누르면 일반 회원으로 로그인합니다.</span></div>}<Field label="이메일" name="email" type="email" defaultValue="member@example.org"/><Field label="비밀번호" name="pw" type="password" defaultValue="demo1234"/><Button type="submit">로그인</Button><div className="auth-links"><Link to="/password-reset">비밀번호 재설정</Link><Link to="/signup">회원가입</Link></div><hr/><Button variant="secondary" onClick={()=>{onLogin("tutor");go("/resources/tutor")}}>승인 튜터 데모로 로그인</Button></form></main>;
  return <main id="main"><Breadcrumb current={type==="signup"?"회원가입":"비밀번호 재설정"}/><PageHead title={type==="signup"?"회원가입":"비밀번호를 다시 설정해요"} desc={type==="signup"?"이메일과 최소 정보로 가입하고 학습자료를 이용하세요.":"가입한 이메일로 안전한 재설정 링크를 보내 드립니다."}/><form className="container narrow section form-section" onSubmit={e=>{e.preventDefault();setStep(1)}}><Field label="이메일" name="email" type="email" required/><Field label="이름 또는 별칭" name="name" required={type==="signup"}/>{type==="signup"&&<><Field label="비밀번호" name="pw" type="password" required/><label className="check"><input type="checkbox" required/><span><b>[필수] 이용약관과 개인정보 처리방침에 동의합니다.</b></span></label></>}<Button type="submit">{type==="signup"?"가입하고 이메일 확인하기":"재설정 링크 받기"}</Button></form></main>;
}

function Policy({type}:{type:string}) {
  const titles:Record<string,string>={privacy:"개인정보 처리방침",terms:"이용약관",contact:"연락처·운영기관 정보"};
  return <main id="main"><Breadcrumb current={titles[type]}/><PageHead title={titles[type]} desc="서비스 운영 원칙과 이용에 필요한 정보를 안내합니다."/><article className="container article standalone"><div className="notice"><b>검토용 예시 문안입니다.</b><span>이 내용은 최종 법률 문안이나 실제 기관 고지가 아니며, 정식 운영 전 법률 검토와 확정이 필요합니다.</span></div><section><h2>1. 안내 목적</h2><p>함께 읽는 세상은 교육 정보 제공과 신청 처리에 필요한 최소한의 정보를 다룹니다. 이용자가 이해하기 쉬운 표현과 접근 가능한 방법으로 안내하는 것을 원칙으로 합니다.</p></section><section><h2>2. 이용자 정보와 권리</h2><p>접수 정보의 확인, 정정, 철회가 필요하면 support@example.org 또는 02-0000-0000으로 문의할 수 있습니다. 본 프로토타입에는 실제 개인정보를 입력하지 마세요.</p></section><section><h2>3. 운영기관</h2><p>행복나눔재단 시각장애 아동 교육 사업 · 서울시 중구 예시로 00 (가상 주소)<br/>운영시간 평일 10:00–17:00</p></section></article></main>;
}

function Tutors({path}:{path:string}) {
  if(path.includes("lookup"))return <Lookup kind="튜터 지원"/>;
  if(path.includes("apply"))return <TutorApply/>;
  return <main id="main"><Breadcrumb current="튜터 참여"/><PageHead title="배움의 곁을 함께 걸어요" desc="시각장애인·비장애인 튜터가 서로의 경험과 전문성을 존중하며 아이의 배움을 지원합니다."/><div className="container section"><div className="feature-grid"><div className="plain-card"><span>01</span><h2>지원</h2><p>모집 조건과 활동 내용을 확인하고 지원서를 작성합니다.</p></div><div className="plain-card"><span>02</span><h2>대화와 확인</h2><p>경험과 가능한 일정을 함께 확인합니다.</p></div><div className="plain-card"><span>03</span><h2>준비 교육</h2><p>아동 존중과 안전 원칙을 함께 익힙니다.</p></div></div><div className="section-head spaced"><div><p className="eyebrow">현재 모집</p><h2>튜터 모집 공고</h2></div><Link to="/tutors/lookup">지원 내역 확인 →</Link></div><div className="recruit-grid">{["점자 첫걸음 학습 튜터","생활 속 보행 활동 튜터","촉각 독서 활동 튜터","겨울방학 온라인 학습 튜터"].map((x,i)=><div className="recruit-card" key={x}><div><Tag tone={i<2?"open":"soon"}>{i<2?"모집 중":"모집 예정"}</Tag><Tag>{i%2?"비장애인 튜터":"시각장애인 튜터 우대"}</Tag></div><h3>{x}</h3><p>아이의 선택과 속도를 존중하며 교육 활동을 함께 준비하고 기록합니다.</p><dl><div><dt>기간</dt><dd>2026.10.12 — 10.30</dd></div><div><dt>서류</dt><dd>{i===0?"경험 소개서 필수":"간단 활동 계획 선택"}</dd></div></dl>{i<2?<Link to={`/tutors/${i+1}/apply`} className="btn btn-primary">지원하기</Link>:<Button disabled>모집 예정</Button>}</div>)}</div></div></main>;
}

function TutorApply(){
  const [done,setDone]=useState(false); const [file,setFile]=useState("");
  if(done)return <Completion type="튜터 지원" number="TUT-261019-013" title="점자 첫걸음 학습 튜터 지원"/>;
  return <main id="main"><Breadcrumb current="튜터 지원서"/><PageHead title="점자 첫걸음 학습 튜터 지원" desc="활동 경험과 가능한 일정을 알려 주세요. 지원 접수와 튜터 회원 권한 승인은 별도 절차입니다."/><form className="container narrow section form-section" onSubmit={e=>{e.preventDefault();setDone(true)}}><div className="form-grid"><Field label="이름 또는 별칭" name="name" required/><Field label="연락 이메일" name="email" type="email" required/><SelectField label="지원 유형" name="type"><option>시각장애인 튜터</option><option>비장애인 튜터</option></SelectField><Field label="가능한 요일·시간" name="time" required/></div><label className="field"><span>관련 경험 *</span><textarea rows={5} required placeholder="교육이나 아동과 함께한 경험을 적어 주세요."></textarea></label><label className="upload"><input type="file" onChange={e=>setFile(e.target.files?.[0]?.name||"")}/><b>{file||"경험 소개서 파일 선택"}</b><span>PDF, DOCX · 최대 10MB · 필수 파일</span>{file&&<button type="button" onClick={()=>setFile("")}>선택 삭제</button>}</label><Field label="조회 비밀번호" name="pw" type="password" required/><label className="check"><input type="checkbox" required/><span><b>[필수] 지원 처리에 필요한 개인정보 수집·이용 동의</b></span></label><Button type="submit">지원서 제출하기</Button></form></main>;
}

function AdminShell({path,role,recruitments,setRecruitments,onExit}:{path:string;role:AdminRole;recruitments:Recruitment[];setRecruitments:(r:Recruitment[])=>void;onExit:()=>void}) {
  const [side,setSide]=useState(false); const [toast,setToast]=useState("");
  const menus=[["대시보드","/admin"],["교육·모집 관리","/admin/recruitments"],["교육 접수 관리","/admin/applications"],["사전등록 관리","/admin/pre-registrations"],["튜터 관리","/admin/tutors"],["콘텐츠 관리","/admin/content"],["문의 관리","/admin/inquiries"],["회원 관리","/admin/members"],["이메일 템플릿","/admin/notifications"],["운영 통계","/admin/statistics"],["시스템 관리","/admin/system"],["화면 목록","/admin/screens"]];
  return <div className="admin-shell">
    <aside className={`admin-side ${side?"open":""}`}><Link to="/admin" className="admin-brand"><span>함께 읽는 세상</span><small>ADMIN CMS</small></Link><nav>{menus.map(([n,p],i)=><Link key={p} to={p} className={path===p||path.startsWith(p+"/")?"active":""}><span>{String(i+1).padStart(2,"0")}</span>{n}{["이메일 템플릿","운영 통계"].includes(n)&&<small>선택</small>}</Link>)}</nav><div className="admin-demo">시연용 가상 데이터<br/>기준일 2026.10.19</div></aside>
    <div className="admin-main"><header className="admin-top"><button onClick={()=>setSide(!side)} className="admin-menu">메뉴</button><div><Link to="/" className="top-link">사용자 홈페이지 열기 ↗</Link><span className="admin-user"><i>김</i><b>김관리</b><small>{role}</small></span><button onClick={onExit} className="top-link">로그아웃</button></div></header><AdminContent path={path} role={role} recruitments={recruitments} setRecruitments={setRecruitments} notify={(x)=>{setToast(x);setTimeout(()=>setToast(""),2500)}}/></div>{toast&&<div className="toast" role="status"><b>저장 완료</b><span>{toast}</span></div>}
  </div>;
}

function AdminContent({path,role,recruitments,setRecruitments,notify}:{path:string;role:AdminRole;recruitments:Recruitment[];setRecruitments:(r:Recruitment[])=>void;notify:(s:string)=>void}) {
  if(path==="/admin")return <AdminDashboard/>;
  if(path==="/admin/screens")return <ScreenMap/>;
  if(path==="/admin/recruitments/new"||path.includes("/edit"))return <RecruitEditor recruitments={recruitments} setRecruitments={setRecruitments} notify={notify}/>;
  if(path==="/admin/recruitments")return <AdminRecruitments items={recruitments}/>;
  if(path==="/admin/applications")return <AdminApplications notify={notify} role={role}/>;
  if(path==="/admin/statistics")return <Statistics/>;
  if(path==="/admin/system"&&role!=="총괄 관리자")return <AdminDenied/>;
  return <AdminGeneric path={path} notify={notify}/>;
}

function AdminTitle({eyebrow,title,desc,action}:{eyebrow:string;title:string;desc:string;action?:ReactNode}) {
  return <div className="admin-title"><div><p>{eyebrow}</p><h1>{title}</h1><span>{desc}</span></div>{action}</div>;
}

function AdminDashboard(){
  return <main className="admin-content"><AdminTitle eyebrow="2026년 10월 19일 월요일" title="좋은 아침이에요, 김관리님." desc="오늘 확인이 필요한 업무를 모았습니다."/ > <div className="admin-alert"><b>오늘의 처리 대기</b><div><Link to="/admin/applications"><strong>7</strong><span>교육 신청<br/>검토 대기</span></Link><Link to="/admin/tutors"><strong>4</strong><span>튜터 지원<br/>서류 확인</span></Link><Link to="/admin/inquiries"><strong>3</strong><span>비공개 문의<br/>답변 대기</span></Link><Link to="/admin/pre-registrations"><strong>6</strong><span>사전등록<br/>안내 대상</span></Link></div></div><div className="admin-grid"><section className="admin-panel wide"><div className="panel-head"><div><h2>진행 중인 모집</h2><span>자체 접수 기준 · 외부 설문 제외</span></div><Link to="/admin/recruitments">전체 보기 →</Link></div><table><thead><tr><th>모집명</th><th>기간</th><th>접수</th><th>검토 대기</th><th>상태</th></tr></thead><tbody><tr><td><b>점자 첫걸음 가을반</b></td><td>10.12 — 10.28</td><td>24명</td><td>7명</td><td><Tag tone="open">모집 중</Tag></td></tr><tr><td><b>교사를 위한 촉각자료 제작 실습</b></td><td>10.05 — 10.23</td><td>외부 접수</td><td>—</td><td><Tag tone="open">모집 중</Tag></td></tr></tbody></table></section><section className="admin-panel"><div className="panel-head"><h2>빠른 관리</h2></div><div className="quick-admin"><Link to="/admin/recruitments/new"><b>새 모집 등록</b><span>프로그램과 신청서 구성</span></Link><Link to="/admin/content"><b>콘텐츠 작성</b><span>공지·자료·FAQ 등록</span></Link><Link to="/admin/pre-registrations"><b>다음 모집 안내</b><span>대상 추출과 이력 기록</span></Link></div></section></div><div className="prototype-note"><b>시연용 가상 데이터</b><span>실제 인증, 이메일 발송, 파일 저장은 연결되지 않았습니다. 주요 업무 흐름과 권한 처리를 확인하는 프로토타입입니다.</span></div></main>;
}

function AdminRecruitments({items}:{items:Recruitment[]}) {
  return <main className="admin-content"><AdminTitle eyebrow="교육 관리 / 모집 관리" title="교육·행사 모집" desc="모집 공고와 신청 방식을 등록하고 관리합니다." action={<Link to="/admin/recruitments/new" className="btn btn-primary">새 모집 등록</Link>}/><AdminFilters/><div className="admin-panel"><table><thead><tr><th>모집명</th><th>연결 프로그램</th><th>접수 방식</th><th>기간</th><th>상태</th><th>관리</th></tr></thead><tbody>{items.map(r=><tr key={r.id}><td><b>{r.title}</b><small>{r.id}</small></td><td>{r.program}</td><td>{r.external?"외부 설문":"자체 신청"}</td><td>{r.period}</td><td><Tag tone={r.status==="모집 중"?"open":"default"}>{r.status}</Tag></td><td><Link to={`/admin/recruitments/${r.id}/edit`}>수정</Link></td></tr>)}</tbody></table></div></main>;
}

function AdminFilters(){return <div className="admin-filters"><Field label="검색" name="q" placeholder="이름, 접수번호 검색"/><SelectField label="상태" name="s"><option>전체 상태</option><option>검토 중</option><option>처리 완료</option></SelectField><Button>검색</Button></div>}

function RecruitEditor({recruitments,setRecruitments,notify}:{recruitments:Recruitment[];setRecruitments:(r:Recruitment[])=>void;notify:(s:string)=>void}) {
  const [preview,setPreview]=useState(false); const [questions,setQuestions]=useState(["이번 교육에서 기대하는 점","선호하는 교육 시간"]);
  function save(e:FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget);const title=String(f.get("title")||"새 모집"); if(!recruitments.find(x=>x.title===title))setRecruitments([{...recruitments[0],id:"R-2026-14",title},...recruitments]);notify("모집 공고가 사용자 화면에도 반영되었습니다.");}
  return <main className="admin-content"><AdminTitle eyebrow="교육 관리 / 모집 관리" title="모집 공고 등록" desc="기본 정보와 신청서 질문을 구성합니다." action={<div className="button-row"><Button variant="secondary" onClick={()=>setPreview(!preview)}>사용자 화면 미리보기</Button><Button onClick={()=>document.querySelector<HTMLFormElement>("#recruit-form")?.requestSubmit()}>저장하기</Button></div>}/>{preview&&<div className="preview-box"><b>사용자 화면 미리보기</b><span>점자 첫걸음 겨울 준비반 · 모집 예정 · 자체 신청</span></div>}<form id="recruit-form" onSubmit={save}><section className="admin-form-panel"><div className="panel-head"><div><span>1단계</span><h2>기본 정보</h2></div></div><div className="form-grid"><Field label="모집 제목" name="title" defaultValue="점자 첫걸음 겨울 준비반" required/><SelectField label="연결 프로그램" name="program"><option>점자 첫걸음</option><option>생활 속 보행교육</option></SelectField><SelectField label="유형" name="type"><option>교육</option><option>행사</option></SelectField><SelectField label="접수 방식" name="way"><option>자체 신청서</option><option>외부 URL</option></SelectField><Field label="모집 시작일" name="start" type="date" defaultValue="2026-11-02"/><Field label="모집 종료일" name="end" type="date" defaultValue="2026-11-20"/></div><label className="field"><span>모집 요약 *</span><textarea rows={4} defaultValue="촉각 탐색과 점자 읽기의 기초를 함께 경험하는 겨울 준비 과정입니다."/></label></section><section className="admin-form-panel"><div className="panel-head"><div><span>2단계</span><h2>신청서 질문 구성</h2></div><Button variant="secondary" onClick={()=>setQuestions([...questions,"새 질문"])}>질문 추가</Button></div><div className="question-builder">{questions.map((q,i)=><div key={i}><span className="drag">{i+1}</span><Field label={`질문 ${i+1}`} name={`q${i}`} defaultValue={q}/><SelectField label="답변 형식" name={`t${i}`}><option>장문</option><option>단답</option><option>단일 선택</option><option>복수 선택</option><option>날짜</option><option>파일</option></SelectField><label className="inline-check"><input type="checkbox" defaultChecked/> 필수</label><div className="move"><button type="button" aria-label="위로 이동">↑</button><button type="button" aria-label="아래로 이동">↓</button><button type="button" onClick={()=>setQuestions(questions.filter((_,j)=>j!==i))}>삭제</button></div></div>)}</div><div className="fixed-fields"><b>기본 필수 항목</b><span>보호자 연락처 · 학습자 정보 · 조회 비밀번호 · 필수/선택 동의는 별도로 고정 제공됩니다.</span></div></section></form></main>;
}

function AdminApplications({notify,role}:{notify:(s:string)=>void;role:AdminRole}) {
  const [selected,setSelected]=useState(false); const [modal,setModal]=useState(false);
  return <main className="admin-content"><AdminTitle eyebrow="교육 관리 / 접수 관리" title="교육·행사 접수" desc="자체 신청 내용을 검토하고 처리 상태를 관리합니다." action={<Button variant="secondary" onClick={()=>setModal(true)}>엑셀 다운로드</Button>}/><AdminFilters/><div className="admin-panel"><table><thead><tr><th><input type="checkbox" aria-label="전체 선택"/></th><th>접수번호 / 신청자</th><th>모집명</th><th>접수일</th><th>상태</th><th>관리</th></tr></thead><tbody>{Array.from({length:8}).map((_,i)=><tr key={i}><td><input type="checkbox" onChange={()=>setSelected(true)} aria-label={`${i+1}번 선택`}/></td><td><b>EDU-2610{19-i}-{String(25-i).padStart(3,"0")}</b><small>보호자 김** · 학습자 ‘봄이’</small></td><td>점자 첫걸음 가을반</td><td>2026.10.{19-i}</td><td><Tag tone={i<3?"soon":"open"}>{i<3?"검토 중":"접수"}</Tag></td><td><button className="table-link" onClick={()=>{notify("상태가 ‘검토 중’으로 변경되고 이력에 기록되었습니다.")}}>상세·상태 변경</button></td></tr>)}</tbody></table>{selected&&<div className="batch-bar"><b>선택 항목을</b><Button variant="secondary" onClick={()=>notify("선택한 접수 상태를 변경했습니다.")}>검토 중으로 변경</Button></div>}</div>{modal&&<div className="modal-backdrop" role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-labelledby="download-title"><h2 id="download-title">접수 명단 다운로드</h2>{role==="문의 담당"?<div className="error-summary"><b>다운로드 권한이 없습니다.</b><span>총괄 관리자에게 개인정보 다운로드 권한을 요청해 주세요.</span></div>:<><p>현재 검색 결과 24건을 XLSX 형식으로 다운로드합니다. 사유는 감사 로그에 기록됩니다.</p><label className="field"><span>다운로드 사유 *</span><textarea rows={3} placeholder="업무 목적을 구체적으로 입력하세요."/></label></>}<div className="button-row"><Button variant="ghost" onClick={()=>setModal(false)}>취소</Button>{role!=="문의 담당"&&<Button onClick={()=>{setModal(false);notify("다운로드 시뮬레이션이 감사 로그에 기록되었습니다.")}}>사유 기록 후 다운로드</Button>}</div></div></div>}</main>;
}

const adminGeneric:Record<string,[string,string,string,string[]]>={
  "/admin/pre-registrations":["사전등록 관리","사전등록 명단","희망 교육과 상태를 확인하고 다음 모집 안내를 수동으로 기록합니다.",["중복 후보 2건","안내 대기 6건","안내 완료 9건","신청 연결 3건"]],
  "/admin/tutors":["튜터 관리","튜터 모집과 지원자","지원 서류와 활동 조건, 검토 상태를 관리합니다.",["모집 중 2건","지원자 12명","서류 확인 4건","승인 완료 5건"]],
  "/admin/content":["콘텐츠 관리","콘텐츠를 관리해요","사용자 화면에 게시되는 자료와 안내를 한곳에서 관리합니다.",["학습자료 18건","교재·교구 8건","정보 글 12건","소식·공지 10건","FAQ 15건","기관·사업 소개 2건","홈 배너 3건"]],
  "/admin/inquiries":["문의 관리","비공개 문의","문의 내용을 확인하고 인증된 이용자에게 보일 답변을 작성합니다.",["답변 대기 3건","답변 완료 7건","오늘 접수 1건","이메일 알림 시뮬레이션"]],
  "/admin/members":["회원 관리","회원과 튜터 권한","최소 회원 정보와 튜터 승인 이력을 관리합니다.",["전체 회원 16명","일반 회원 10명","승인 튜터 6명","권한 검토 2건"]],
  "/admin/notifications":["협의 기능","이메일 템플릿","실제 발송 없이 접수·답변 알림 문구와 치환 항목을 점검합니다.",["접수 확인","담당자 통보","문의 답변 알림","모집 안내"]],
  "/admin/system":["시스템 관리","계정·분류·감사 로그","관리자 권한과 공통 분류, 주요 행위 기록을 관리합니다.",["관리자 계정 5명","공통 분류 19개","감사 로그 28건","다운로드 기록 4건"]],
};

function AdminGeneric({path,notify}:{path:string;notify:(s:string)=>void}) {
  const key=Object.keys(adminGeneric).find(k=>path.startsWith(k))||"/admin/content";const [eye,title,desc,items]=adminGeneric[key];
  return <main className="admin-content"><AdminTitle eyebrow={eye} title={title} desc={desc} action={<Button onClick={()=>notify("새 항목을 등록할 수 있는 편집 화면을 열었습니다.")}>새 항목 등록</Button>}/><div className="metric-grid">{items.map((x,i)=><div className="metric" key={x}><span>{String(i+1).padStart(2,"0")}</span><b>{x}</b><small>세부 목록과 변경 이력을 확인합니다.</small></div>)}</div><div className="admin-panel"><div className="panel-head"><h2>최근 변경 항목</h2><Button variant="secondary">검색·필터</Button></div><table><thead><tr><th>항목</th><th>구분</th><th>최근 변경</th><th>담당자</th><th>상태</th><th>관리</th></tr></thead><tbody>{items.concat(items.slice(0,2)).map((x,i)=><tr key={i}><td><b>{x.replace(/[0-9]+건|[0-9]+명/g,"")} 상세 항목 {i+1}</b><small>ID-{String(i+1).padStart(4,"0")}</small></td><td>{eye}</td><td>2026.10.{19-i} 14:20</td><td>김관리</td><td><Tag tone={i%3?"open":"soon"}>{i%3?"게시":"검토 중"}</Tag></td><td><button className="table-link" onClick={()=>notify("변경 내용을 저장하고 이력에 기록했습니다.")}>상세·수정</button></td></tr>)}</tbody></table></div><div className="admin-form-panel"><h2>{key==="/admin/notifications"?"템플릿 미리보기":"업무 처리 메모"}</h2>{key==="/admin/notifications"?<><div className="token-list"><code>{"{{이름}}"}</code><code>{"{{모집명}}"}</code><code>{"{{접수번호}}"}</code><code>{"{{조회주소}}"}</code></div><label className="field"><span>이메일 본문</span><textarea rows={6} defaultValue={"{{이름}}님, {{모집명}} 접수가 완료되었습니다.\n접수번호: {{접수번호}}\n조회: {{조회주소}}\n비밀번호는 이메일에 포함하지 않습니다."}/></label></>:<label className="field"><span>내부 메모 (사용자에게 표시되지 않음)</span><textarea rows={4} placeholder="처리 과정과 확인할 내용을 남겨 주세요."/></label>}<Button onClick={()=>notify("내용을 저장하고 변경 이력에 기록했습니다.")}>저장하기</Button></div></main>;
}

function Statistics(){return <main className="admin-content"><AdminTitle eyebrow="선택 기능 / 운영 통계" title="운영 현황" desc="자체 접수 데이터만 집계하며 외부 설문 응답은 포함하지 않습니다."/><div className="metric-grid"><div className="metric"><span>교육 신청</span><strong>24</strong><small>자체 신청 · 외부 제외</small></div><div className="metric"><span>튜터 지원</span><strong>12</strong><small>자체 지원</small></div><div className="metric"><span>사전등록</span><strong>18</strong><small>철회 1건 포함</small></div><div className="metric"><span>문의</span><strong>10</strong><small>답변 완료 7건</small></div></div><div className="admin-grid"><section className="admin-panel wide"><div className="panel-head"><h2>월별 자체 접수 추이</h2><span>표 형태 대체 정보 제공</span></div><div className="chart" aria-label="7월 8건, 8월 13건, 9월 18건, 10월 24건"><i style={{height:"30%"}}><b>8</b><span>7월</span></i><i style={{height:"48%"}}><b>13</b><span>8월</span></i><i style={{height:"68%"}}><b>18</b><span>9월</span></i><i style={{height:"90%"}}><b>24</b><span>10월</span></i></div></section><section className="admin-panel"><h2>집계 기준</h2><p>기준일 2026.10.19<br/>중복 여부와 무관하게 접수 건 단위 집계<br/>외부 설문 모집 2건 제외<br/>삭제된 시연 데이터 없음</p></section></div></main>}

function AdminDenied(){return <main className="admin-content gate admin-gate"><div className="gate-symbol">!</div><h1>이 화면에 접근할 권한이 없습니다.</h1><p>시스템 관리는 총괄 관리자만 이용할 수 있습니다. 필요한 경우 담당 관리자에게 권한을 요청해 주세요.</p><Link to="/admin" className="btn btn-primary">대시보드로 돌아가기</Link></main>}

function ScreenMap(){
  const user=[["U01 메인","/"],["U02 교육 안내","/programs"],["U03 교육 신청","/recruitments"],["U04 상시 사전등록","/pre-registration"],["U05 신청 내역","/applications/lookup"],["U06 튜터 지원","/tutors"],["U07 학습자료실","/resources"],["U08 교재·교구","/materials"],["U09 점자·보행 정보","/information"],["U10 소식·공지","/news"],["U11 Q&A","/support"],["U12 기관·사업 소개","/about"],["U13 회원 커뮤니티 · 선택","/community"],["U14 계정·검색","/login"],["U15 정책·오류","/privacy"]];
  const admin=[["A01 관리자 로그인","/admin/login"],["A02 교육 관리","/admin/recruitments"],["A03 사전등록 관리","/admin/pre-registrations"],["A04 튜터 관리","/admin/tutors"],["A05 콘텐츠 관리","/admin/content"],["A06 문의 관리","/admin/inquiries"],["A07 회원 관리","/admin/members"],["A08 알림 · 협의","/admin/notifications"],["A09 통계 · 선택","/admin/statistics"],["A10 시스템 관리","/admin/system"]];
  return <main className="admin-content"><AdminTitle eyebrow="프로토타입 검수" title="전체 화면 목록" desc="사용자·관리자 메뉴별 구현 화면과 접근 링크를 확인합니다."/><div className="screen-map"><section><h2>사용자 화면</h2>{user.map(([x,p])=><Link to={p} key={x}><b>{x}</b><span>구현 완료</span><small>{p}</small></Link>)}</section><section><h2>관리자 화면</h2>{admin.map(([x,p])=><Link to={p} key={x}><b>{x}</b><span>구현 완료</span><small>{p}</small></Link>)}</section></div></main>;
}

function AdminLogin({onLogin}:{onLogin:(r:AdminRole)=>void}) {
  const [error,setError]=useState(false);
  return <main className="admin-login"><div className="admin-login-copy"><Link to="/" className="wordmark"><span className="brand-mark"><i></i><i></i><i></i><i></i></span><span>함께 읽는 세상<small>관리자 CMS</small></span></Link><div><p className="eyebrow">ADMINISTRATION</p><h1>배움의 연결을<br/>꼼꼼하게 관리합니다.</h1><p>사용자 계정과 분리된 관리자 전용 로그인입니다.<br/>시연용 계정으로 역할별 권한을 확인할 수 있습니다.</p></div><small>시연 기준일 2026.10.19 · 가상 데이터</small></div><form className="admin-login-form" onSubmit={e=>{e.preventDefault();error?onLogin("총괄 관리자"):setError(true)}}><h2>관리자 로그인</h2><p>업무 계정으로 로그인해 주세요.</p>{error&&<div className="error-summary"><b>아이디 또는 비밀번호를 확인해 주세요.</b><span>데모에서는 한 번 더 누르면 총괄 관리자로 로그인합니다.</span></div>}<Field label="관리자 이메일" name="email" type="email" defaultValue="admin@example.org"/><Field label="비밀번호" name="pw" type="password" defaultValue="demo1234"/><Button type="submit">관리자 로그인</Button><hr/><p className="demo-label">권한별 데모 로그인</p><div className="role-buttons">{(["총괄 관리자","콘텐츠 담당","접수 담당","문의 담당"] as AdminRole[]).map(r=><button type="button" key={r} onClick={()=>onLogin(r)}>{r}<span>→</span></button>)}</div><Link to="/" className="back-link">← 사용자 홈페이지로 돌아가기</Link></form></main>;
}

function SearchPage(){
  const [q,setQ]=useState(""); const items=[...programs.map(x=>x[0]),...initialRecruitments.map(x=>x.title),...hubData["/information"].items,...hubData["/news"].items,...hubData["/materials"].items];
  const result=q?items.filter(x=>x.includes(q)):[];
  return <main id="main"><Breadcrumb current="통합검색"/><PageHead title="무엇을 찾고 계신가요?" desc="공개 프로그램, 모집, 정보, 공지, FAQ와 교재·교구에서 찾아드립니다."/><div className="container narrow section"><label className="search-big"><span className="sr-only">검색어</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="예: 점자 첫걸음, 보호자 교육"/><button>검색</button></label>{q&&<div className="search-results"><h2>‘{q}’ 검색 결과 <em>{result.length}</em>건</h2>{result.length?result.map((x,i)=><Link to={i%2?"/information/1":"/programs/braille"} key={x}><Tag>{i%2?"정보":"교육"}</Tag><b>{x}</b><span>관련 공개 콘텐츠의 요약과 상세 내용을 확인합니다.</span></Link>):<div className="empty"><b>검색 결과가 없습니다.</b><span>다른 단어로 검색하거나 띄어쓰기를 확인해 주세요.</span></div>}</div>}</div></main>;
}

function PrototypeTools({role,setRole,adminRole,setAdminRole,reset}:{role:Role;setRole:(r:Role)=>void;adminRole:AdminRole;setAdminRole:(r:AdminRole)=>void;reset:()=>void}) {
  const [open,setOpen]=useState(false);
  return <div className={`prototype-tools ${open?"open":""}`}><button className="tool-toggle" onClick={()=>setOpen(!open)} aria-expanded={open}>프로토타입 도구 <span>{open?"닫기":"열기"}</span></button>{open&&<div className="tool-body"><div className="tool-head"><b>시연 환경 설정</b><small>실제 계정과 무관한 가상 데이터</small></div><label>사용자 권한<select value={role} onChange={e=>setRole(e.target.value as Role)}><option value="guest">비회원</option><option value="member">일반 회원</option><option value="tutor">승인 튜터</option></select></label><label>관리자 역할<select value={adminRole} onChange={e=>setAdminRole(e.target.value as AdminRole)}><option>총괄 관리자</option><option>콘텐츠 담당</option><option>접수 담당</option><option>문의 담당</option></select></label><div className="tool-links"><Link to="/">사용자 홈</Link><Link to="/admin">관리자 CMS</Link><Link to="/admin/screens">전체 화면 목록</Link><button onClick={reset}>데이터 초기화</button></div><p>실제 인증·이메일·파일 저장·보안 연동은 포함되지 않은 UI 프로토타입입니다.</p></div>}</div>;
}

function NotFound(){return <main id="main" className="gate"><div className="gate-symbol">404</div><h1>페이지를 찾을 수 없습니다.</h1><p>주소가 바뀌었거나 삭제된 페이지일 수 있습니다. 메뉴에서 필요한 내용을 다시 찾아보세요.</p><Link to="/" className="btn btn-primary">홈으로 돌아가기</Link></main>}

export default function App() {
  const [path,setPath]=useState(location.pathname);
  const [role,setRole]=useState<Role>(()=>(localStorage.getItem("demo-role") as Role)||"guest");
  const [adminRole,setAdminRole]=useState<AdminRole>(()=>(localStorage.getItem("admin-role") as AdminRole)||"총괄 관리자");
  const [adminLogged,setAdminLogged]=useState(()=>localStorage.getItem("admin-login")==="true");
  const [recruitments,setRecruitmentsState]=useState<Recruitment[]>(()=>{
    try{return JSON.parse(localStorage.getItem("recruitments")||"null")||initialRecruitments}catch{return initialRecruitments}
  });
  useEffect(()=>{const fn=()=>setPath(location.pathname);addEventListener("popstate",fn);return()=>removeEventListener("popstate",fn)},[]);
  useEffect(()=>localStorage.setItem("demo-role",role),[role]);
  function setRecruitments(r:Recruitment[]){setRecruitmentsState(r);localStorage.setItem("recruitments",JSON.stringify(r))}
  function loginAdmin(r:AdminRole){setAdminRole(r);setAdminLogged(true);localStorage.setItem("admin-role",r);localStorage.setItem("admin-login","true");go("/admin")}
  function reset(){localStorage.clear();setRole("guest");setAdminRole("총괄 관리자");setRecruitmentsState(initialRecruitments);alert("시연 데이터와 권한을 초기화했습니다.")}

  let page:ReactNode;
  if(path==="/admin/login") page=<AdminLogin onLogin={loginAdmin}/>;
  else if(path.startsWith("/admin")) page=adminLogged?<AdminShell path={path} role={adminRole} recruitments={recruitments} setRecruitments={setRecruitments} onExit={()=>{setAdminLogged(false);localStorage.removeItem("admin-login");go("/admin/login")}}/>:<AdminLogin onLogin={loginAdmin}/>;
  else {
    if(path==="/")page=<Home/>;
    else if(path.startsWith("/programs"))page=<Programs path={path}/>;
    else if(path.startsWith("/recruitments"))page=<Recruitments path={path} recruitments={recruitments}/>;
    else if(path.startsWith("/pre-registration"))page=<PreRegistration path={path}/>;
    else if(path==="/applications/lookup")page=<Lookup/>;
    else if(path.startsWith("/tutors"))page=<Tutors path={path}/>;
    else if(path.startsWith("/resources"))page=<Resources path={path} role={role}/>;
    else if(["/materials","/information","/news","/community"].some(x=>path.startsWith(x)))page=<ContentHub path={path} role={role}/>;
    else if(path.startsWith("/support"))page=<Support path={path}/>;
    else if(path.startsWith("/about"))page=<About path={path}/>;
    else if(path==="/login")page=<Auth type="login" onLogin={setRole}/>;
    else if(path==="/signup")page=<Auth type="signup" onLogin={setRole}/>;
    else if(path==="/password-reset")page=<Auth type="reset" onLogin={setRole}/>;
    else if(path==="/search")page=<SearchPage/>;
    else if(["/privacy","/terms","/contact"].includes(path))page=<Policy type={path.slice(1)}/>;
    else if(path==="/external-example")page=<main className="gate"><div className="gate-symbol">↗</div><h1>외부 서비스 예시 화면입니다.</h1><p>실제 접수나 구매는 발생하지 않습니다.</p><Button onClick={()=>history.back()}>이전 화면으로 돌아가기</Button></main>;
    else page=<NotFound/>;
    page=<><Header role={role} onRole={setRole}/>{page}<Footer/></>;
  }
  return <>{page}<PrototypeTools role={role} setRole={setRole} adminRole={adminRole} setAdminRole={r=>{setAdminRole(r);localStorage.setItem("admin-role",r)}} reset={reset}/></>;
}
