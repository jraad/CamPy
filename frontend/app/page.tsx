'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Camera, 
  Settings, 
  Activity,
  ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();

  const quickLinks = [
    {
      title: 'Cameras',
      description: 'View and manage your camera feeds',
      icon: Camera,
      href: '/cameras',
    },
    {
      title: 'Settings',
      description: 'Configure system settings',
      icon: Settings,
      href: '/settings',
    },
    {
      title: 'Activity',
      description: 'View system activity and logs',
      icon: Activity,
      href: '/activity',
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to CamPy</h1>
        <p className="text-gray-600">Your centralized camera management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickLinks.map((link) => (
          <Card key={link.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <link.icon className="h-5 w-5" />
                <h3 className="font-semibold">{link.title}</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{link.description}</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push(link.href)}
              >
                <span>View</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 