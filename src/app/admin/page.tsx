/**
 * app/admin/page.tsx — Admin Page (Server Component)
 * Checks the admin session cookie server-side.
 * If not authenticated → redirect to /admin/login.
 * Otherwise → render the full AdminDashboard client component.
 */
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata = {
  title: "Admin Dashboard | PremiumStore",
  robots: { index: false, follow: false }, // Never index admin pages
};

export default async function AdminPage() {
  const isAuth = await isAdmin();
  
  if (!isAuth) {
    redirect("/admin/login");
  }

  /* Authenticated → render dashboard */
  return <AdminDashboard />;
}
