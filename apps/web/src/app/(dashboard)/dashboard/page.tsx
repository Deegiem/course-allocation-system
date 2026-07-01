'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout/Layout';
import StatsCard from '@/components/common/Cards/StatsCard';
import {
  ArrowRight,
  ClipboardPenLine,
  FileText,
  Plus,
  Sparkles,
  Zap,
  CheckCircle2,
  CirclePlay,
  Database,
  WandSparkles,
} from 'lucide-react';

interface DashboardStats {
  totalLecturers: number;
  activeLecturers: number;
  totalCourses: number;
  totalAllocations: number;
  averageUtilization: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  data: T[];
  message?: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLecturers: 0,
    activeLecturers: 0,
    totalCourses: 0,
    totalAllocations: 0,
    averageUtilization: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      let lecturersData: ApiResponse = { data: [], success: false };
      let coursesData: ApiResponse = { data: [], success: false };
      let allocationsData: ApiResponse = { data: [], success: false };
      let distributionData: ApiResponse = { data: [], success: false };

      try {
        const lecturersRes = await fetch('/api/lecturers', { cache: 'no-store' });
        lecturersData = await lecturersRes.json();
      } catch (err) {
        console.error('Error fetching lecturers:', err);
      }

      try {
        const coursesRes = await fetch('/api/courses', { cache: 'no-store' });
        coursesData = await coursesRes.json();
      } catch (err) {
        console.error('Error fetching courses:', err);
      }

      try {
        const allocationsRes = await fetch('/api/allocations', { cache: 'no-store' });
        allocationsData = await allocationsRes.json();
      } catch (err) {
        console.error('Error fetching allocations:', err);
      }

      try {
        const distributionRes = await fetch('/api/allocations?distribution=true', {
          cache: 'no-store',
        });
        distributionData = await distributionRes.json();
      } catch (err) {
        console.error('Error fetching distribution:', err);
      }

      const activeLecturers = lecturersData.success
        ? lecturersData.data.filter((lecturer: any) => lecturer.isActive)
        : [];

      const averageUtilization =
        distributionData.success && distributionData.data.length > 0
          ? Math.round(
              distributionData.data.reduce((sum: number, item: any) => {
                const utilization = Number(item?.utilization ?? 0);
                return sum + (Number.isFinite(utilization) ? utilization : 0);
              }, 0) / distributionData.data.length
            )
          : 0;

      setStats({
        totalLecturers: lecturersData.success ? lecturersData.data.length : 0,
        activeLecturers: activeLecturers.length,
        totalCourses: coursesData.success ? coursesData.data.length : 0,
        totalAllocations: allocationsData.success ? allocationsData.data.length : 0,
        averageUtilization: Number.isFinite(averageUtilization)
          ? averageUtilization
          : 0,
      });

      if (!lecturersData.success || !coursesData.success) {
        setError(
          'Some dashboard data could not be loaded. Verify that the backend APIs are available.'
        );
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="dashboard-panel flex min-w-70 flex-col items-center gap-4 px-8 py-10 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-[#9bb7ff]" />
            <div>
              <h3 className="text-lg font-semibold text-white">Loading dashboard</h3>
              <p className="mt-1 text-sm text-[#aeb9d4]">
                Pulling allocation metrics and system status...
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <section className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="panel-section-title">Dashboard</h1>
            <p className="mt-1 text-base text-[#aeb9d4]">
              Comprehensive overview of academic resource allocation and status.
            </p>
          </div>

          <Link href="/allocations/manual" className="dashboard-primary-btn w-fit">
            <Plus className="h-4 w-4" />
            New Allocation
          </Link>
        </section>

        {error && (
          <div className="dashboard-panel border border-amber-400/20 bg-amber-500/10 px-5 py-4 text-amber-100">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-amber-400/20 p-1.5">
                <Zap className="h-4 w-4 text-amber-300" />
              </div>
              <div>
                <p className="font-semibold">Partial data warning</p>
                <p className="mt-1 text-sm text-amber-100/80">{error}</p>
              </div>
            </div>
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Total Lecturers"
            value={stats.totalLecturers}
            subtitle={`${stats.activeLecturers} active`}
            icon="lecturers"
            color="blue"
          />
          <StatsCard
            title="Total Courses"
            value={stats.totalCourses}
            subtitle="All active courses"
            icon="courses"
            color="blue"
          />
          <StatsCard
            title="Allocations"
            value={stats.totalAllocations}
            subtitle="Courses assigned"
            icon="allocations"
            color="green"
          />
          <StatsCard
            title="Workload Utilization"
            value={`${stats.averageUtilization}%`}
            subtitle="Average workload"
            icon="utilization"
            color="orange"
          />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_1fr]">
          <div className="dashboard-panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 className="text-[1.9rem] font-bold tracking-tight text-white">
                Quick Actions
              </h2>
              <Zap className="h-5 w-5 text-[#dbe6ff]" />
            </div>

            <div className="space-y-4 p-5">
              <Link
                href="/allocations/manual"
                className="group block rounded-md border border-[#3b4c70] bg-[#24355a] p-5 transition hover:border-[#5673ad] hover:bg-[#2a3c63]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#40598b] text-[#dce7ff]">
                    <ClipboardPenLine className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-[#dbe6ff]">
                        Allocate Course Manually
                      </h3>
                      <ArrowRight className="h-4 w-4 text-[#aeb9d4] transition group-hover:translate-x-0.5 group-hover:text-white" />
                    </div>

                    <p className="mt-1 text-sm text-[#c2cee8]">
                      Override system defaults for specific assignments
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/allocations/auto"
                className="group block rounded-md border border-emerald-500/20 bg-[#163743] p-5 transition hover:border-emerald-400/30 hover:bg-[#19404d]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#215161] text-[#6ef2bb]">
                    <Sparkles className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-[#6ef2bb]">
                        Run Auto Allocation
                      </h3>
                      <ArrowRight className="h-4 w-4 text-[#8ed9bc] transition group-hover:translate-x-0.5 group-hover:text-[#6ef2bb]" />
                    </div>

                    <p className="mt-1 text-sm text-[#c2e8d8]">
                      Optimize lecturer distribution via algorithm
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/reports"
                className="group block rounded-2xl border border-white/10 bg-[#202c45] p-5 transition hover:border-white/15 hover:bg-[#26324c]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#31415f] text-[#dbe6ff]">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-[#dbe6ff]">
                        Generate Report
                      </h3>
                      <ArrowRight className="h-4 w-4 text-[#aeb9d4] transition group-hover:translate-x-0.5 group-hover:text-white" />
                    </div>

                    <p className="mt-1 text-sm text-[#c2cee8]">
                      Export allocation status for stakeholders
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="dashboard-panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 className="text-[1.9rem] font-bold tracking-tight text-white">
                System Status
              </h2>

              <span className="status-badge">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                HEALTHY
              </span>
            </div>

            <div className="p-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#21314d] p-2.5 text-[#b7c9f8]">
                      <Database className="h-4 w-4" />
                    </div>
                    <span className="text-[15px] text-[#d7e0f5]">Database</span>
                  </div>

                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#21314d] p-2.5 text-[#b7c9f8]">
                      <CirclePlay className="h-4 w-4" />
                    </div>
                    <span className="text-[15px] text-[#d7e0f5]">Backend</span>
                  </div>

                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Running
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-[15px] text-[#b8c4df]">Total Lecturers</span>
                  <span className="text-lg font-semibold text-white">
                    {stats.totalLecturers}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-[15px] text-[#b8c4df]">Total Courses</span>
                  <span className="text-lg font-semibold text-white">
                    {stats.totalCourses}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-[15px] text-[#b8c4df]">Allocations</span>
                  <span className="text-lg font-semibold text-white">
                    {stats.totalAllocations}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[15px] text-[#b8c4df]">Optimization Engine</span>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#9bb7ff]">
                    <WandSparkles className="h-4 w-4" />
                    Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}