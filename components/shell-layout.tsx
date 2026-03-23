export function ShellLayout({ role, profile, page, setPage, currentSidebar, onLogout, children }: any) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bilim Portal 2.0</h1>
            <p className="text-sm text-slate-500">Қазақстанға сатылатын оқу орталықтарына арналған SaaS</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl border px-3 py-2 text-sm">{profile?.role || role}</div>
            <button onClick={onLogout} className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-slate-50">Шығу</button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-2xl border bg-white p-3 shadow-sm">
          <div className="mb-3 rounded-2xl bg-blue-50 p-4">
            <div className="text-sm text-slate-500">Орталық</div>
            <div className="mt-1 text-lg font-semibold">{profile?.center_id ? "Center connected" : "Center"}</div>
            <div className="mt-2 text-xs text-slate-500">role: {profile?.role || role}</div>
          </div>
          <nav className="space-y-1">
            {currentSidebar.map((item: string) => (
              <button key={item} onClick={() => setPage(item)} className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium transition ${page === item ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`}>{item}</button>
            ))}
          </nav>
        </aside>
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}