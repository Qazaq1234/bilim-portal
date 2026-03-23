export function AuthScreen(props: any) {
  const {
    authMode, setAuthMode, fullName, setFullName, centerName, setCenterName, centerCity, setCenterCity,
    firstBranch, setFirstBranch, teacherCenterCode, setTeacherCenterCode, authEmail, setAuthEmail,
    authPassword, setAuthPassword, parentCode, setParentCode, parentPin, setParentPin,
    handleLogin, handleDirectorRegister, handleTeacherRegister, handleParentRpcLogin,
    authLoading, parentLoading, authMessage, parentError,
  } = props;

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-10 lg:grid-cols-2">
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">Bilim Portal 2.0</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {[["login","Кіру"],["register-director","Директор тіркелуі"],["register-teacher","Мұғалім тіркелуі"],["parent-login","Ата-ана кіруі"]].map(([value,label]) => (
            <button key={value} onClick={() => setAuthMode(value)} className={`rounded-xl px-4 py-2 text-sm font-medium ${authMode === value ? "bg-slate-900 text-white" : "border bg-white text-slate-700"}`}>{label}</button>
          ))}
        </div>
        <div className="mt-6 space-y-3">
          {authMode !== "parent-login" && (
            <>
              {(authMode === "register-director" || authMode === "register-teacher") && <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Аты-жөні" />}
              {authMode === "register-director" && <>
                <input value={centerName} onChange={(e) => setCenterName(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Орталық атауы" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={centerCity} onChange={(e) => setCenterCity(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Қала" />
                  <input value={firstBranch} onChange={(e) => setFirstBranch(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Бірінші филиал" />
                </div>
              </>}
              {authMode === "register-teacher" && <input value={teacherCenterCode} onChange={(e) => setTeacherCenterCode(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Center code" />}
              <input value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Email" />
              <input value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} type="password" className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Пароль" />
            </>
          )}
          {authMode === "parent-login" && <>
            <input value={parentCode} onChange={(e) => setParentCode(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Student code" />
            <input value={parentPin} onChange={(e) => setParentPin(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="PIN" />
          </>}
          {authMode === "login" && <button onClick={handleLogin} disabled={authLoading} className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white">Кіру</button>}
          {authMode === "register-director" && <button onClick={handleDirectorRegister} disabled={authLoading} className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white">Директор тіркеу</button>}
          {authMode === "register-teacher" && <button onClick={handleTeacherRegister} disabled={authLoading} className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white">Мұғалім тіркеу</button>}
          {authMode === "parent-login" && <button onClick={handleParentRpcLogin} disabled={parentLoading} className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">Ата-ана кіруі</button>}
          {(authMessage || parentError) && <div className="rounded-xl bg-slate-100 px-3 py-3 text-sm text-slate-700">{authMessage || parentError}</div>}
        </div>
      </div>
    </div>
  );
}