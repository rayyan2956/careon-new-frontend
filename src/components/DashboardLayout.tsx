'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  items: { label: string; href: string }[];
  title: string;
}

export default function DashboardLayout({ children, items, title }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar items={items} title={title} />
      <div className="ml-64 p-8">{children}</div>
    </div>
  );
}
