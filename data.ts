import { createClient } from "@/lib/supabase/server";
import { DEFAULT_PROFILE } from "@/lib/constants";
import type {
  Achievement,
  Activity,
  Category,
  CategoryType,
  GalleryItem,
  Profile,
  Project,
  SiteStats,
  TeamMember,
} from "@/types";

function fail(what: string, message: string): never {
  throw new Error(`Gagal memuat ${what}: ${message}`);
}

export async function getProfile(): Promise<Profile> {
  const { data, error } = await createClient().from("profiles").select("*").eq("id", 1).maybeSingle();
  if (error) fail("profil", error.message);
  const clean = Object.fromEntries(
    Object.entries(data ?? {}).filter(([, v]) => v !== null && v !== ""),
  );
  return { ...DEFAULT_PROFILE, ...clean } as Profile;
}

export async function getCategories(type: CategoryType): Promise<Category[]> {
  const { data, error } = await createClient()
    .from("categories")
    .select("*")
    .eq("type", type)
    .order("name");
  if (error) fail("kategori", error.message);
  return (data ?? []) as Category[];
}

export async function getActivities(limit?: number): Promise<Activity[]> {
  let q = createClient()
    .from("activities")
    .select("*, category:categories(id,name)")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) fail("kegiatan", error.message);
  return (data ?? []) as unknown as Activity[];
}

export async function getActivity(id: string): Promise<Activity | null> {
  const { data, error } = await createClient()
    .from("activities")
    .select("*, category:categories(id,name)")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    // id bukan UUID valid → anggap tidak ditemukan
    if (error.code === "22P02") return null;
    fail("kegiatan", error.message);
  }
  return (data as unknown as Activity) ?? null;
}

export async function getProjects(opts: { limit?: number; featuredFirst?: boolean } = {}): Promise<Project[]> {
  let q = createClient().from("projects").select("*, category:categories(id,name)");
  if (opts.featuredFirst) q = q.order("is_featured", { ascending: false });
  q = q.order("published_at", { ascending: false }).order("created_at", { ascending: false });
  if (opts.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) fail("proyek", error.message);
  return (data ?? []) as unknown as Project[];
}

export async function getGallery(opts: { limit?: number; activityId?: string; imagesOnly?: boolean } = {}): Promise<GalleryItem[]> {
  let q = createClient()
    .from("gallery")
    .select("*, activity:activities(id,title)")
    .order("created_at", { ascending: false });
  if (opts.activityId) q = q.eq("activity_id", opts.activityId);
  if (opts.imagesOnly) q = q.eq("media_type", "image");
  if (opts.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) fail("galeri", error.message);
  return (data ?? []) as unknown as GalleryItem[];
}

export async function getAchievements(limit?: number): Promise<Achievement[]> {
  let q = createClient().from("achievements").select("*").order("date", { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) fail("prestasi", error.message);
  return (data ?? []) as Achievement[];
}

export async function getTeam(limit?: number): Promise<TeamMember[]> {
  let q = createClient()
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) fail("anggota", error.message);
  return (data ?? []) as TeamMember[];
}

export async function getStats(): Promise<SiteStats> {
  const supabase = createClient();
  const count = async (table: string) => {
    const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
    if (error) fail("statistik", error.message);
    return count ?? 0;
  };
  const [activities, projects, gallery, achievements, members] = await Promise.all([
    count("activities"),
    count("projects"),
    count("gallery"),
    count("achievements"),
    count("team_members"),
  ]);
  return { activities, projects, gallery, achievements, members };
}
