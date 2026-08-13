import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, CheckCircle2 } from "lucide-react";

const productLinks = [
  { name: "Features", path: "/features" },
  { name: "Pricing", path: "/pricing" },
  // { name: "Changelog", path: "/changelog" },
];

const companyLinks = [
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
  // { name: "Careers", path: "/careers" },
  // { name: "Blog", path: "/blog" },
];

const legalLinks = [
  { name: "Privacy Policy", path: "/privacy" },
  { name: "Terms of Service", path: "/terms" },
];

const socialLinks = [
  { name: "GitHub", icon: Github, href: "https://github.com/oluwaseyipd" },
  { name: "X (Twitter)", icon: Twitter, href: "https://x.com/oluwaseyipd" },
  { name: "LinkedIn", icon: Linkedin, href: " https://www.linkedin.com/in/oluwaseyiae/" },
];

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link to="/" className="">
              <img src="/logo.png" className="h-20 w-20 object-contain" alt="Acta" />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Manage your tasks with elegance and efficiency.
            </p>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Social */}
          <div className="space-y-4">
            {/*<h4 className="font-semibold text-foreground">Follow Us</h4>*/}
            <div className="flex flex-row space-x-3 md:flex-col md:space-y-3 md:space-x-0">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors w-fit"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Acta. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built by{" "}
            <a
              href="https://oluwaseyiae.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Oluwaseyi
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
