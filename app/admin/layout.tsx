import AdminNavbar from '../../components/AdminNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminNavbar />
      <main className="pt-24">{children}</main>
    </>
  );
}