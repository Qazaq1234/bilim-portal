"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { AuthScreen } from "@/components/auth-screen";
import { ShellLayout } from "@/components/shell-layout";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { StudentsPage } from "@/components/students/students-page";
import { StudentCard } from "@/components/students/student-card";
import { PaymentsPage } from "@/components/payments/payments-page";
import { AttendancePage } from "@/components/attendance/attendance-page";
import { BranchesPage } from "@/components/branches/branches-page";
import { StaffPage } from "@/components/staff/staff-page";
import { ParentPage } from "@/components/parent/parent-page";
import { ReportsPage } from "@/components/reports/reports-page";
import {
  fetchAttendance,
  fetchBranches,
  fetchPayments,
  fetchStaff,
  fetchStudents,
  getCurrentProfile,
} from "@/lib/actions";
import type {
  AttendanceRow,
  AuthMode,
  BranchRow,
  ParentAttendance,
  ParentPayment,
  ParentStudent,
  PaymentRow,
  ProfileRow,
  Role,
  StudentRow,
} from "@/lib/types";

export default function Page() {
  const [sessionReady, setSessionReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  const [role, setRole] = useState<Role>("director");
  const [page, setPage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const [students, setStudents] = useState<StudentRow[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRow[]>([]);
  const [branches, setBranches] = useState<BranchRow[]>([]);
  const [staff, setStaff] = useState<ProfileRow[]>([]);

  const [studentsLoading, setStudentsLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);

  const [studentsError, setStudentsError] = useState("");
  const [paymentsError, setPaymentsError] = useState("");
  const [attendanceError, setAttendanceError] = useState("");
  const [branchesError, setBranchesError] = useState("");
  const [staffError, setStaffError] = useState("");

  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [centerName, setCenterName] = useState("");
  const [centerCity, setCenterCity] = useState("");
  const [firstBranch, setFirstBranch] = useState("");
  const [teacherCenterCode, setTeacherCenterCode] = useState("");

  const [studentForm, setStudentForm] = useState({
    name: "",
    student_code: "",
    pin_code: "",
    parent_name: "",
    parent_phone: "",
    monthly_fee: "30000",
    branch_id: "",
    teacher_user_id: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    student_id: "",
    amount: "",
    method: "cash",
    note: "",
  });

  const [attendanceForm, setAttendanceForm] = useState({
    student_id: "",
    lesson_date: "",
    status: "Келді",
    note: "",
  });

  const [branchForm, setBranchForm] = useState({
    name: "",
    city: "",
    address: "",
  });

  const [parentCode, setParentCode] = useState("");
  const [parentPin, setParentPin] = useState("");
  const [parentLoading, setParentLoading] = useState(false);
  const [parentError, setParentError] = useState("");
  const [parentStudent, setParentStudent] = useState<ParentStudent | null>(null);
  const [parentPayments, setParentPayments] = useState<ParentPayment[]>([]);
  const [parentAttendance, setParentAttendance] = useState<ParentAttendance[]>([]);

  const currentSidebar =
    role === "teacher"
      ? ["Dashboard", "Оқушылар", "Журнал"]
      : role === "parent"
        ? ["Ата-ана кабинеті"]
        : ["Dashboard", "Оқушылар", "Төлем", "Журнал", "Филиал", "Қызметкерлер", "Ата-ана", "Есеп"];

  const selectedStudent = useMemo(() => {
    const raw = students.find((s) => s.id === selectedStudentId);
    if (!raw) return null;
    return {
      id: raw.id,
      name: raw.name,
      branch: branches.find((b) => b.id === raw.branch_id)?.name || "-",
      teacher: staff.find((s) => s.user_id === raw.teacher_user_id)?.full_name || "-",
      fee: raw.monthly_fee,
      debt: raw.debt_amount,
      code: raw.student_code,
      pin: raw.pin_code,
    };
  }, [selectedStudentId, students, branches, staff]);

  const loadAll = async (currentProfile: ProfileRow) => {
    setStudentsError("");
    setPaymentsError("");
    setAttendanceError("");
    setBranchesError("");
    setStaffError("");

    setBranchesLoading(true);
    const branchesRes = await fetchBranches(supabase, currentProfile);
    setBranchesLoading(false);
    if (branchesRes.error) setBranchesError(branchesRes.error.message);
    else setBranches((branchesRes.data as BranchRow[]) || []);

    setStaffLoading(true);
    const staffRes = await fetchStaff(supabase, currentProfile);
    setStaffLoading(false);
    if (staffRes.error) setStaffError(staffRes.error.message);
    else setStaff((staffRes.data as ProfileRow[]) || []);

    setStudentsLoading(true);
    const studentsRes = await fetchStudents(supabase, currentProfile);
    setStudentsLoading(false);
    if (studentsRes.error) {
      setStudentsError(studentsRes.error.message);
      setStudents([]);
      return;
    }

    const loadedStudents = (studentsRes.data as StudentRow[]) || [];
    setStudents(loadedStudents);
    const ids = loadedStudents.map((s) => s.id);

    setPaymentsLoading(true);
    const paymentsRes = await fetchPayments(supabase, currentProfile, ids);
    setPaymentsLoading(false);
    if (paymentsRes.error) setPaymentsError(paymentsRes.error.message);
    else setPayments((paymentsRes.data as PaymentRow[]) || []);

    setAttendanceLoading(true);
    const attendanceRes = await fetchAttendance(supabase, currentProfile, ids);
    setAttendanceLoading(false);
    if (attendanceRes.error) setAttendanceError(attendanceRes.error.message);
    else setAttendance((attendanceRes.data as AttendanceRow[]) || []);
  };

  useEffect(() => {
    const boot = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user || null;
      setUser(sessionUser);

      if (sessionUser) {
        const p = await getCurrentProfile(supabase);
        setProfile(p);
        if (p?.role === "teacher") setRole("teacher");
        else setRole("director");
        if (p) await loadAll(p);
      }

      setSessionReady(true);
    };
    boot();
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user || null;
      setUser(sessionUser);

      if (sessionUser) {
        const p = await getCurrentProfile(supabase);
        setProfile(p);
        if (p?.role === "teacher") setRole("teacher");
        else setRole("director");
        if (p) await loadAll(p);
      } else {
        setProfile(null);
        setStudents([]);
        setPayments([]);
        setAttendance([]);
        setBranches([]);
        setStaff([]);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    setAuthLoading(true);
    setAuthMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    setAuthLoading(false);
    if (error) setAuthMessage(error.message);
  };

  const handleDirectorRegister = async () => {
    setAuthLoading(true);
    setAuthMessage("");
    const centerCode = `CTR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const signRes = await supabase.auth.signUp({ email: authEmail, password: authPassword });
    if (signRes.error || !signRes.data.user?.id) {
      setAuthLoading(false);
      setAuthMessage(signRes.error?.message || "Тіркелу қатесі");
      return;
    }

    const uid = signRes.data.user.id;
    const centerRes = await supabase
      .from("centers")
      .insert({ name: centerName, city: centerCity, owner_user_id: uid, center_code: centerCode })
      .select("id")
      .single();

    if (centerRes.error || !centerRes.data) {
      setAuthLoading(false);
      setAuthMessage(centerRes.error?.message || "Center жасалмады");
      return;
    }

    const profileRes = await supabase.from("profiles").insert({
      user_id: uid,
      center_id: centerRes.data.id,
      full_name: fullName,
      role: "director",
      status: "active",
    });

    if (profileRes.error) {
      setAuthLoading(false);
      setAuthMessage(profileRes.error.message);
      return;
    }

    if (firstBranch.trim()) {
      await supabase.from("branches").insert({
        center_id: centerRes.data.id,
        name: firstBranch,
        city: centerCity || null,
        address: null,
        status: "active",
      });
    }

    setAuthLoading(false);
    setAuthMessage(`Тіркелді. Center code: ${centerCode}`);
  };

  const handleTeacherRegister = async () => {
    setAuthLoading(true);
    setAuthMessage("");
    const centerRes = await supabase.from("centers").select("id").eq("center_code", teacherCenterCode).maybeSingle();

    if (centerRes.error || !centerRes.data) {
      setAuthLoading(false);
      setAuthMessage("Center code қате");
      return;
    }

    const signRes = await supabase.auth.signUp({ email: authEmail, password: authPassword });
    if (signRes.error || !signRes.data.user?.id) {
      setAuthLoading(false);
      setAuthMessage(signRes.error?.message || "Тіркелу қатесі");
      return;
    }

    const profileRes = await supabase.from("profiles").insert({
      user_id: signRes.data.user.id,
      center_id: centerRes.data.id,
      full_name: fullName,
      role: "teacher",
      status: "active",
    });

    setAuthLoading(false);
    if (profileRes.error) setAuthMessage(profileRes.error.message);
    else setAuthMessage("Мұғалім тіркелді");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setRole("director");
    setPage("Dashboard");
  };

  const handleCreateStudent = async () => {
    if (!profile) return;
    setStudentsError("");
    const res = await supabase.from("students").insert({
      center_id: profile.center_id,
      name: studentForm.name,
      branch_id: studentForm.branch_id || null,
      teacher_user_id: studentForm.teacher_user_id || null,
      student_code: studentForm.student_code,
      pin_code: studentForm.pin_code,
      parent_name: studentForm.parent_name || null,
      parent_phone: studentForm.parent_phone || null,
      monthly_fee: Number(studentForm.monthly_fee || 0),
      debt_amount: Number(studentForm.monthly_fee || 0),
      status: "active",
    });
    if (res.error) {
      setStudentsError(res.error.message);
      return;
    }
    setStudentForm({
      name: "",
      student_code: "",
      pin_code: "",
      parent_name: "",
      parent_phone: "",
      monthly_fee: "30000",
      branch_id: "",
      teacher_user_id: "",
    });
    await loadAll(profile);
  };

  const handleDeleteStudent = async (id: string) => {
    if (!profile) return;
    const res = await supabase.from("students").delete().eq("id", id);
    if (res.error) {
      setStudentsError(res.error.message);
      return;
    }
    if (selectedStudentId === id) setSelectedStudentId(null);
    await loadAll(profile);
  };

  const handleCreatePayment = async () => {
    if (!profile || !user) return;
    setPaymentsError("");
    if (!paymentForm.student_id || !paymentForm.amount) {
      setPaymentsError("Оқушы мен сома керек");
      return;
    }
    const amount = Number(paymentForm.amount || 0);
    const selected = students.find((s) => s.id === paymentForm.student_id);
    const res = await supabase.from("payments").insert({
      center_id: profile.center_id,
      student_id: paymentForm.student_id,
      amount,
      method: paymentForm.method,
      note: paymentForm.note || null,
      created_by: user.id,
    });
    if (res.error) {
      setPaymentsError(res.error.message);
      return;
    }
    if (selected) {
      const nextDebt = Math.max(Number(selected.debt_amount || 0) - amount, 0);
      await supabase.from("students").update({ debt_amount: nextDebt }).eq("id", selected.id);
    }
    setPaymentForm({ student_id: "", amount: "", method: "cash", note: "" });
    await loadAll(profile);
  };

  const handleDeletePayment = async (id: string) => {
    if (!profile) return;
    const res = await supabase.from("payments").delete().eq("id", id);
    if (res.error) {
      setPaymentsError(res.error.message);
      return;
    }
    await loadAll(profile);
  };

  const handleCreateAttendance = async () => {
    if (!profile || !user) return;
    setAttendanceError("");
    if (!attendanceForm.student_id || !attendanceForm.lesson_date) {
      setAttendanceError("Оқушы және күн керек");
      return;
    }
    const res = await supabase.from("attendance").insert({
      center_id: profile.center_id,
      student_id: attendanceForm.student_id,
      lesson_date: attendanceForm.lesson_date,
      status: attendanceForm.status,
      note: attendanceForm.note || null,
      created_by: user.id,
    });
    if (res.error) {
      setAttendanceError(res.error.message);
      return;
    }
    setAttendanceForm({ student_id: "", lesson_date: "", status: "Келді", note: "" });
    await loadAll(profile);
  };

  const handleDeleteAttendance = async (id: string) => {
    if (!profile) return;
    const res = await supabase.from("attendance").delete().eq("id", id);
    if (res.error) {
      setAttendanceError(res.error.message);
      return;
    }
    await loadAll(profile);
  };

  const handleCreateBranch = async () => {
    if (!profile) return;
    setBranchesError("");
    const res = await supabase.from("branches").insert({
      center_id: profile.center_id,
      name: branchForm.name,
      city: branchForm.city || null,
      address: branchForm.address || null,
      status: "active",
    });
    if (res.error) {
      setBranchesError(res.error.message);
      return;
    }
    setBranchForm({ name: "", city: "", address: "" });
    await loadAll(profile);
  };

  const handleDeleteBranch = async (id: string) => {
    if (!profile) return;
    const res = await supabase.from("branches").delete().eq("id", id);
    if (res.error) {
      setBranchesError(res.error.message);
      return;
    }
    await loadAll(profile);
  };

  const handleParentRpcLogin = async () => {
    setParentLoading(true);
    setParentError("");
    setParentStudent(null);
    setParentPayments([]);
    setParentAttendance([]);

    const studentRes = await supabase.rpc("parent_login_check", { p_code: parentCode, p_pin: parentPin });
    if (studentRes.error || !studentRes.data || !studentRes.data.length) {
      setParentLoading(false);
      setParentError(studentRes.error?.message || "Code/PIN қате");
      return;
    }

    const [paymentsRes, attendanceRes] = await Promise.all([
      supabase.rpc("parent_payments", { p_code: parentCode, p_pin: parentPin }),
      supabase.rpc("parent_attendance", { p_code: parentCode, p_pin: parentPin }),
    ]);

    if (paymentsRes.error) setParentError(paymentsRes.error.message);
    if (attendanceRes.error) setParentError(attendanceRes.error.message);

    setParentStudent((studentRes.data[0] as ParentStudent) || null);
    setParentPayments((paymentsRes.data as ParentPayment[]) || []);
    setParentAttendance((attendanceRes.data as ParentAttendance[]) || []);
    setParentLoading(false);
    setRole("parent");
    setPage("Ата-ана кабинеті");
  };

  if (!sessionReady) {
    return <div className="p-10 text-center">Жүктелуде...</div>;
  }

  if (!user) {
    return (
      <AuthScreen
        authMode={authMode}
        setAuthMode={setAuthMode}
        fullName={fullName}
        setFullName={setFullName}
        centerName={centerName}
        setCenterName={setCenterName}
        centerCity={centerCity}
        setCenterCity={setCenterCity}
        firstBranch={firstBranch}
        setFirstBranch={setFirstBranch}
        teacherCenterCode={teacherCenterCode}
        setTeacherCenterCode={setTeacherCenterCode}
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        parentCode={parentCode}
        setParentCode={setParentCode}
        parentPin={parentPin}
        setParentPin={setParentPin}
        handleLogin={handleLogin}
        handleDirectorRegister={handleDirectorRegister}
        handleTeacherRegister={handleTeacherRegister}
        handleParentRpcLogin={handleParentRpcLogin}
        authLoading={authLoading}
        parentLoading={parentLoading}
        authMessage={authMessage}
        parentError={parentError}
      />
    );
  }

  const renderPage = () => {
    if (role === "parent") return <ParentPage parentStudent={parentStudent} parentPayments={parentPayments} parentAttendance={parentAttendance} />;
    if (page === "Dashboard") return <DashboardPage students={students} payments={payments} attendance={attendance} />;
    if (page === "Оқушылар") return (
      <StudentsPage
        students={students}
        studentsLoading={studentsLoading}
        studentsError={studentsError}
        studentForm={studentForm}
        setStudentForm={setStudentForm}
        branches={branches}
        staff={staff}
        search={search}
        setSearch={setSearch}
        onCreateStudent={handleCreateStudent}
        onDeleteStudent={handleDeleteStudent}
        onOpenStudent={(id) => { setSelectedStudentId(id); setPage("Student Card"); }}
      />
    );
    if (page === "Student Card") return <StudentCard student={selectedStudent} payments={payments} attendance={attendance} onBack={() => setPage("Оқушылар")} />;
    if (page === "Төлем") return <PaymentsPage payments={payments} students={students} paymentsLoading={paymentsLoading} paymentsError={paymentsError} paymentForm={paymentForm} setPaymentForm={setPaymentForm} onCreatePayment={handleCreatePayment} onDeletePayment={handleDeletePayment} />;
    if (page === "Журнал") return <AttendancePage attendance={attendance} students={students} attendanceLoading={attendanceLoading} attendanceError={attendanceError} attendanceForm={attendanceForm} setAttendanceForm={setAttendanceForm} onCreateAttendance={handleCreateAttendance} onDeleteAttendance={handleDeleteAttendance} />;
    if (page === "Филиал") return <BranchesPage branches={branches} branchesLoading={branchesLoading} branchesError={branchesError} branchForm={branchForm} setBranchForm={setBranchForm} onCreateBranch={handleCreateBranch} onDeleteBranch={handleDeleteBranch} />;
    if (page === "Қызметкерлер") return <StaffPage staff={staff} staffLoading={staffLoading} staffError={staffError} />;
    if (page === "Ата-ана") return <ParentPage parentStudent={parentStudent} parentPayments={parentPayments} parentAttendance={parentAttendance} />;
    if (page === "Есеп") return <ReportsPage students={students} payments={payments} attendance={attendance} />;
    return <div className="rounded-2xl border bg-white p-5 shadow-sm">Бұл бөлім кейін толтырылады.</div>;
  };

  return (
    <ShellLayout
      role={role}
      profile={profile || { role, center_id: "" }}
      page={page}
      setPage={setPage}
      currentSidebar={currentSidebar}
      onLogout={handleLogout}
    >
      {renderPage()}
    </ShellLayout>
  );
}
