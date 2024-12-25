import React from 'react';
import { useEditorDashboard } from '../../hooks/editor/useEditorDashboard';
import { EditorStats } from '../../components/editor/stats/EditorStats';
import { DashboardContent } from '../../components/editor/dashboard/DashboardContent';
import { DashboardHeader } from '../../components/editor/dashboard/DashboardHeader';
import { DashboardSkeleton } from '../../components/editor/dashboard/DashboardSkeleton';
import { DashboardError } from '../../components/editor/dashboard/DashboardError';

export default function EditorDashboard() {
  const { stats, orders, drafts, feedback, timeline, loading, error, refetch } = useEditorDashboard();

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <DashboardError message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <EditorStats stats={stats} />
      <DashboardContent 
        orders={orders}
        drafts={drafts}
        feedback={feedback}
        timeline={timeline}
      />
    </div>
  );
}