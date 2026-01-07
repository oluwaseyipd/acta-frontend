import { Outlet } from "react-router-dom";
import { PublicNavbar } from "./PublicNavbar";
import { Footer } from "./Footer";

interface PublicLayoutProps {
  children?: React.ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicNavbar />
      <main className="flex-1">{children || <Outlet />}</main>
      <Footer />
    </div>
  );
};
