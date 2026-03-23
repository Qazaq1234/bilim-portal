import "./globals.css";

export const metadata = {
  title: "Bilim Portal 2.0",
  description: "Қазақстанға сатылатын оқу орталықтарына арналған SaaS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kk">
      <body className="min-h-screen bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}