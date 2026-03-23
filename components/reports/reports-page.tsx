import { StudentRow, PaymentRow, AttendanceRow } from "@/lib/types";
import { formatMoney } from "@/lib/format";
export function ReportsPage({ students, payments, attendance }: { students: StudentRow[]; payments: PaymentRow[]; attendance: AttendanceRow[]; }) {
  const totalIncome = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const totalDebt = students.reduce((sum, s) => sum + Number(s.debt_amount || 0), 0);
  const presentCount = attendance.filter((a) => a.status === "Келді").length;
  const attendanceRate = attendance.length ? Math.round((presentCount / attendance.length) * 100) : 0;
  const reportText = `Айлық есеп\nОқушы саны: ${students.length}\nТөлем: ${formatMoney(totalIncome)}\nҚарыз: ${formatMoney(totalDebt)}\nҚатысу: ${attendanceRate}%`;
  return <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"><div className="rounded-2xl border bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold">Айлық есеп</h2><div className="mt-4 grid grid-cols-2 gap-4 text-sm"><div className="rounded-xl bg-slate-50 p-4">Оқушы саны: {students.length}</div><div className="rounded-xl bg-slate-50 p-4">Төлем: {formatMoney(totalIncome)}</div><div className="rounded-xl bg-slate-50 p-4">Қарыз: {formatMoney(totalDebt)}</div><div className="rounded-xl bg-slate-50 p-4">Қатысу: {attendanceRate}%</div></div></div><div className="rounded-2xl border bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold">Экспорт / жіберу</h2><textarea className="mt-4 min-h-[180px] w-full rounded-2xl border p-4 text-sm" defaultValue={reportText} /></div></section>;
}