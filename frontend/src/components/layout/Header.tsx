'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              CamPy
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/cameras" 
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cameras
            </Link>
            <Link 
              href="/settings" 
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
} 