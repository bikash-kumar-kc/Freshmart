import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { MdEco } from "react-icons/md";

const SHOP_LINKS = [
  { label: "Vegetables", href: "/shop/vegetables" },
  { label: "Fruits", href: "/shop/fruits" },
  { label: "Dairy & Eggs", href: "/shop/dairy-eggs" },
  { label: "Grains & Pulses", href: "/shop/grains" },
  { label: "Beverages", href: "/shop/beverages" },
  { label: "Seasonal picks", href: "/shop/seasonal" },
];

const COMPANY_LINKS = [
  { label: "About us", href: "/about" },
  { label: "Our farms", href: "/farms" },
  { label: "Careers", href: "/careers" },
  { label: "Press", href: "/press" },
  { label: "Blog", href: "/blog" },
];

const SUPPORT_LINKS = [
  { label: "Help center", href: "/help" },
  { label: "Track order", href: "/track" },
  { label: "Returns", href: "/returns" },
  { label: "Contact us", href: "/contact" },
  { label: "Delivery zones", href: "/zones" },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: <FaFacebook size={15} />,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: <FaInstagram size={15} />,
  },
  {
    label: "X / Twitter",
    href: "https://x.com",
    icon: <FaXTwitter size={15} />,
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: <FaYoutube size={15} />,
  },
];

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) => (
  <div className="flex flex-col gap-3">
    <p className="text-[11px] font-medium uppercase tracking-widest text-green-500">
      {title}
    </p>
    <ul className="flex flex-col gap-2.5">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            className="text-[13px] text-green-300/80 hover:text-green-100 transition-colors duration-150"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  return (
    <footer className=" w-full   bg-[#0a1502] text-green-200 pb-20 lg:pb-0">
      <div className=" px-6 pt-12 pb-0">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 items-center place-items-center gap-10">
          {/* Brand + social */}
          <div className="flex flex-col gap-4">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌿</span>
                <span className="text-[17px] font-medium text-green-50 tracking-tight">
                  FreshMart
                </span>
              </div>
            </Link>

            {/* Tagline */}
            <p className="text-[13px] text-green-400 leading-relaxed max-w-55">
              Organic groceries delivered to your door in minutes. Fresh from
              the farm, straight to you.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8.5 h-8.5 rounded-lg border border-green-800 bg-green-900/60 flex items-center justify-center text-green-400 hover:bg-green-800 hover:text-green-100 transition-colors duration-150"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Organic badge */}
            <div className="inline-flex items-center gap-1.5 bg-green-900/60 border border-green-800 rounded-md px-2.5 py-1.5 w-fit">
              <MdEco size={14} className="text-green-400" />
              <span className="text-[11px] text-green-400">
                100% organic certified
              </span>
            </div>
          </div>

          {/* Shop */}
          <FooterColumn title="Shop" links={SHOP_LINKS} />

          {/* Company */}
          <FooterColumn title="Company" links={COMPANY_LINKS} />

          {/* Support */}
          <FooterColumn title="Support" links={SUPPORT_LINKS} />
        </div>
      </div>

      {/* Bottom bar  */}
      <div className=" w-full px-6 mt-10 border-t border-green-900 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[12px] text-gray-200">
          &copy;FreshMart. All rights reserved.
        </p>
        <div className="flex items-center gap-5">
          {["Privacy policy", "Terms of service", "Cookie settings"].map(
            (item) => (
              <Link
                key={item}
                href="#"
                className="text-[12px] text-gray-400 hover:text-gray-300 transition-colors"
              >
                {item}
              </Link>
            ),
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
