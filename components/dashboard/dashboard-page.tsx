import { StudentRow, PaymentRow, AttendanceRow } from "@/lib/types";
import { formatMoney } from "@/lib/format";
export function DashboardPage({ students, payments, attendance }: { students: StudentRow[]; payments: PaymentRow[]; attendance: AttendanceRow[]; }) {
  const totalStudents = students.length;
  const totalIncome = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const totalDebt = students.reduce((sum, s) => sum + Number(s.debt_amount || 0), 0);
  const today = new Date().toISOString().slice(0, 10);
  const todayAttendance = attendance.filter((a) => a.lesson_date === today);
  const presentCount = todayAttendance.filter((a) => a.status === "Келді").length;
  const attendanceRate = todayAttendance.length ? Math.round((presentCount / todayAttendance.length) * 100) : 0;
  return <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Оқушылар</div><div className="mt-2 text-2xl font-bold">{totalStudents}</div></div>
    <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Айлық кіріс</div><div className="mt-2 text-2xl font-bold">{formatMoney(totalIncome)}</div></div>
    <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Қарыз</div><div className="mt-2 text-2xl font-bold">{formatMoney(totalDebt)}</div></div>
    <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Бүгінгі қатысу</div><div className="mt-2 text-2xl font-bold">{attendanceRate}%</div></div>
  </section>;
}