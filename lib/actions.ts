import { SupabaseClient } from "@supabase/supabase-js";
import type { ProfileRow } from "@/lib/types";

export async function getCurrentProfile(supabase: SupabaseClient): Promise<ProfileRow | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData.session?.user?.id;
  if (!uid) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, center_id, full_name, phone, role, status, created_at")
    .eq("user_id", uid)
    .maybeSingle();
  if (error) return null;
  return (data as ProfileRow | null) ?? null;
}

export async function fetchStudents(supabase: SupabaseClient, profile: ProfileRow) {
  let query = supabase
    .from("students")
    .select("id, center_id, branch_id, teacher_user_id, name, student_code, pin_code, parent_name, parent_phone, monthly_fee, debt_amount, status, created_at")
    .eq("center_id", profile.center_id)
    .order("created_at", { ascending: false });

  if (profile.role === "teacher") query = query.eq("teacher_user_id", profile.user_id);
  return query;
}

export async function fetchPayments(supabase: SupabaseClient, profile: ProfileRow, studentIds: string[]) {
  let query = supabase
    .from("payments")
    .select("id, center_id, student_id, amount, method, note, created_by, created_at")
    .eq("center_id", profile.center_id)
    .order("created_at", { ascending: false });

  if (profile.role === "teacher") {
    if (!studentIds.length) return { data: [], error: null };
    query = query.in("student_id", studentIds);
  }
  return query;
}

export async function fetchAttendance(supabase: SupabaseClient, profile: ProfileRow, studentIds: string[]) {
  let query = supabase
    .from("attendance")
    .select("id, center_id, student_id, lesson_date, status, note, created_by, created_at")
    .eq("center_id", profile.center_id)
    .order("lesson_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (profile.role === "teacher") {
    if (!studentIds.length) return { data: [], error: null };
    query = query.in("student_id", studentIds);
  }
  return query;
}

export async function fetchBranches(supabase: SupabaseClient, profile: ProfileRow) {
  return supabase
    .from("branches")
    .select("id, center_id, name, city, address, status, created_at")
    .eq("center_id", profile.center_id)
    .order("created_at", { ascending: false });
}

export async function fetchStaff(supabase: SupabaseClient, profile: ProfileRow) {
  return supabase
    .from("profiles")
    .select("user_id, center_id, full_name, phone, role, status, created_at")
    .eq("center_id", profile.center_id)
    .order("created_at", { ascending: false });
}