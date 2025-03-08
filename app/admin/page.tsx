// app/admin/page.tsx
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata = {
    title: 'Admin Dashboard | Regency Reading Retreat',
    description: 'Administrative dashboard for the Regency Reading Retreat event',
};

export default function AdminPage() {
    return <AdminDashboard />;
}