import Image from "next/image";

export default function Home() {
  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="hidden rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 lg:block">
        <div className="mb-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
          Sidebar
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Navigation will appear here.
        </p>
      </aside>

      <section className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Step 1
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
            Layout & Theming
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Base shell for the OpenAPI renderer. Sidebar is sticky on desktop; content is centered with a max
            width for readability. Dark mode ready.
          </p>
        </div>

        <div className="mt-8 grid gap-4 rounded-lg border border-dashed border-slate-300 bg-slate-50/80 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
          <div className="font-semibold">Status</div>
          <ul className="list-disc space-y-1 pl-5">
            <li>Layout scaffolded with header, sidebar placeholder, content area, and footer.</li>
            <li>Light/dark theme tokens applied; Tailwind utilities available.</li>
            <li>Ready for Step 2: load OpenAPI spec server-side and render title/description.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
