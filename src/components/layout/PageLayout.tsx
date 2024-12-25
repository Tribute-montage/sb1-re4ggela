import React from 'react';
import { PageHeader } from '../common/PageHeader';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

interface PageLayoutProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({
  title,
  description,
  actions,
  children,
  className
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PageHeader
        title={title}
        description={description}
        actions={actions}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className={cn("overflow-hidden", className)}>
          {children}
        </Card>
      </main>
    </div>
  );
}