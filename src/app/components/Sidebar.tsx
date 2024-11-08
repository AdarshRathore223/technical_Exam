"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";  // Optimized for Next.js routing
import { TbForms, TbReportAnalytics } from "react-icons/tb";
import { CiViewTable, CiCircleChevLeft } from "react-icons/ci";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Control sidebar visibility
  const pathname = usePathname();  // Get the current path directly

  // Define navigation links with icons, titles, and hrefs
  const navlinks = [
    { icon: <TbForms />, title: "Form", href: "/page/form" },
    { icon: <CiViewTable />, title: "Listing", href: "/page/listing" },
    { icon: <TbReportAnalytics />, title: "Report", href: "/page/report" },
  ];

  return (
    <div
      className={`w-64 sm:w-80 h-full fixed top-0 bg-gray-700 text-gray-400 z-50 transition-transform duration-500 ${
        isSidebarOpen ? "" : "-translate-x-full"
      }`}
    >
      {/* Sidebar header */}
      <div className="transition-transform duration-500 flex items-center justify-between py-8 px-8 font-bold text-xl text-white relative">
        <h1>Dashboard</h1>
        <div
          className={`absolute text-white md:hidden transition-transform duration-500 ${
            !isSidebarOpen
              ? "-right-10 rounded-xl p-4 rotate-180 bg-gray-700"
              : "right-5"
          }`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <CiCircleChevLeft />
        </div>
      </div>

      {/* Navigation links */}
      <nav>
        <ul>
          {navlinks.map((nav, index) => (
            <a
              key={index}
              href={nav.href}
              className={`pl-8 py-5 flex items-center transition duration-500 cursor-pointer select-none ${
                pathname === nav.href
                  ? "border-l-3 bg-gray-500 text-white"  // Active class when path matches
                  : "hover:bg-gray-600"
              }`}
            >
              <div>{nav.icon}</div>
              <div className="pl-5">{nav.title}</div>
            </a>
          ))}
        </ul>
      </nav>
    </div>
  );
}
