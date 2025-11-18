import Link from 'next/link';
import Demo from './components/Demo';

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 blur-3xl">
          <div className="mx-auto mt-24 h-64 w-64 rounded-full bg-blue-400/40 dark:bg-blue-500/30" />
        </div>

        <div className="mx-auto max-w-5xl px-6 py-24 md:py-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/60 px-3 py-1 text-xs text-zinc-700 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Production-ready Drag & Drop for React
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl md:text-6xl">
            ddo-dnd
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-7 text-zinc-600 dark:text-zinc-400">
            가볍고 확장 가능한 React DnD 라이브러리. 좌표 기반 드래그, 스냅,
            충돌(사각형/원/OBB) 지원, 제네릭 타입으로 도메인에 맞게 확장하세요.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/getting-started"
              className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              시작하기
            </Link>
            <Link
              href="/api/components"
              className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              API 문서
            </Link>
          </div>
        </div>
      </section>

      <Demo />

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Feature
            title="확장 가능한 타입"
            desc="BlockType을 제네릭으로 확장해 도메인 필드를 안전하게 유지합니다."
          />
          <Feature
            title="정확한 충돌"
            desc="AABB(사각형), 원 근사, OBB(회전 박스)까지 상황에 맞는 충돌 모드를 선택."
          />
          <Feature
            title="부드러운 트랜지션"
            desc="useBlocksTransition으로 위치/크기 보간 애니메이션을 간단하게."
          />
          <Feature
            title="스냅 & 경계 체크"
            desc="격자 스냅과 경계 범위 검사로 사용자 경험을 향상합니다."
          />
          <Feature
            title="작은 러닝커브"
            desc="DragContainer, DraggableItem, DraggingItem 조합으로 빠르게 구축."
          />
          <Feature
            title="모노레포 친화적"
            desc="플레이그라운드/문서와 함께 손쉽게 개발·배포 가능한 구조."
          />
        </div>
      </section>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {desc}
      </p>
    </div>
  );
}
