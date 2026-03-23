export function ConfigScreen({
  supabaseUrl,
  supabaseKey,
  setSupabaseUrl,
  setSupabaseKey,
  saveConfig,
  configMessage,
}: any) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">Supabase конфиг</h2>
        <p className="mt-2 text-sm text-slate-500">URL мен anon key енгіз.</p>
        <div className="mt-6 space-y-3">
          <input value={supabaseUrl} onChange={(e) => setSupabaseUrl(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="https://your-project.supabase.co" />
          <textarea value={supabaseKey} onChange={(e) => setSupabaseKey(e.target.value)} className="min-h-[120px] w-full rounded-xl border px-3 py-2 text-sm" placeholder="Anon key" />
          <button onClick={saveConfig} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white">Сақтау</button>
          {configMessage && <div className="rounded-xl bg-slate-100 px-3 py-3 text-sm text-slate-700">{configMessage}</div>}
        </div>
      </div>
    </div>
  );
}