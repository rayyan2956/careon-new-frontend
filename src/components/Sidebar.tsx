'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/lib/api';

interface NavItem {
  label: string;
  href: string;
}

interface SidebarProps {
  items: NavItem[];
  title: string;
}

export default function Sidebar({ items, title }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-primary-600">CareOn</h1>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
