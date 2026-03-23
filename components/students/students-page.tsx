import { StudentRow, BranchRow, ProfileRow } from "@/lib/types";
import { formatMoney } from "@/lib/format";
type StudentForm = { name: string; student_code: string; pin_code: string; parent_name: string; parent_phone: string; monthly_fee: string; branch_id: string; teacher_user_id: string; };
export function StudentsPage({ students, studentsLoading, studentsError, studentForm, setStudentForm, branches, staff, search, setSearch, onCreateStudent, onDeleteStudent, onOpenStudent }:
{ students: StudentRow[]; studentsLoading: boolean; studentsError: string; studentForm: StudentForm; setStudentForm: React.Dispatch<React.SetStateAction<StudentForm>>; branches: BranchRow[]; staff: ProfileRow[]; search: string; setSearch: (v: string) => void; onCreateStudent: () => void; onDeleteStudent: (id: string) => void; onOpenStudent: (id: string) => void; }) {
  const mapped = students.map((student) => ({ ...student, branch_name: branches.find((b) => b.id === student.branch_id)?.name || "-", teacher_name: staff.find((p) => p.user_id === student.teacher_user_id)?.full_name || "-" }))
    .filter((student) => [student.name, student.branch_name, student.teacher_name, student.student_code].join(" ").toLowerCase().includes(search.toLowerCase()));
  return <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Оқушы қосу</h2>
      <div className="mt-4 grid gap-3">
        <input value={studentForm.name} onChange={(e) => setStudentForm((s) => ({ ...s, name: e.target.value }))} className="rounded-xl border px-3 py-2 text-sm" placeholder="Аты-жөні" />
        <div className="grid grid-cols-2 gap-3">
          <input value={studentForm.student_code} onChange={(e) => setStudentForm((s) => ({ ...s, student_code: e.target.value }))} className="rounded-xl border px-3 py-2 text-sm" placeholder="Student code" />
          <input value={studentForm.pin_code} onChange={(e) => setStudentForm((s) => ({ ...s, pin_code: e.target.value }))} className="rounded-xl border px-3 py-2 text-sm" placeholder="PIN" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input value={studentForm.parent_name} onChange={(e) => setStudentForm((s) => ({ ...s, parent_name: e.target.value }))} className="rounded-xl border px-3 py-2 text-sm" placeholder="Ата-ана аты" />
          <input value={studentForm.parent_phone} onChange={(e) => setStudentForm((s) => ({ ...s, parent_phone: e.target.value }))} className="rounded-xl border px-3 py-2 text-sm" placeholder="Ата-ана нөмірі" />
        </div>
        <select value={studentForm.branch_id} onChange={(e) => setStudentForm((s) => ({ ...s, branch_id: e.target.value }))} className="rounded-xl border px-3 py-2 text-sm"><option value="">Филиал таңда</option>{branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
        <select value={studentForm.teacher_user_id} onChange={(e) => setStudentForm((s) => ({ ...s, teacher_user_id: e.target.value }))} className="rounded-xl border px-3 py-2 text-sm"><option value="">Мұғалім таңда</option>{staff.filter((p) => p.role === "teacher").map((p) => <option key={p.user_id} value={p.user_id}>{p.full_name}</option>)}</select>
        <input value={studentForm.monthly_fee} onChange={(e) => setStudentForm((s) => ({ ...s, monthly_fee: e.target.value }))} className="rounded-xl border px-3 py-2 text-sm" placeholder="Айлық төлем" />
        <button onClick={onCreateStudent} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white">Сақтау</button>
        {studentsError && <div className="rounded-xl bg-rose-50 px-3 py-3 text-sm text-rose-700">{studentsError}</div>}
      </div>
    </div>
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Оқушылар тізімі</h2><input value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-xl border px-3 py-2 text-sm" placeholder="Іздеу..." /></div>
      {studentsLoading ? <div className="text-sm text-slate-500">Жүктеліп жатыр...</div> : <div className="space-y-3">{mapped.map((student) => <div key={student.id} className="flex items-center justify-between rounded-2xl border p-4"><button onClick={() => onOpenStudent(student.id)} className="flex-1 text-left"><div className="font-semibold">{student.name}</div><div className="mt-1 text-sm text-slate-500">{student.branch_name} · {student.teacher_name}</div></button><div className="ml-4 flex items-center gap-3"><div className="text-right"><div className="text-sm">{formatMoney(student.monthly_fee)}</div><div className={Number(student.debt_amount) === 0 ? "text-sm text-emerald-600" : "text-sm text-amber-600"}>Қарыз: {formatMoney(student.debt_amount)}</div></div><button onClick={() => onDeleteStudent(student.id)} className="rounded-xl border px-3 py-2 text-sm font-medium hover:bg-slate-50">Өшіру</button></div></div>)}</div>}
    </div>
  </section>;
}