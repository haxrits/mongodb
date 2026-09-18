import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import RoomsPage from './pages/RoomsPage';
import ExamsPage from './pages/ExamsPage';
import GeneratePage from './pages/GeneratePage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import VisualSeatingPlan from './components/VisualSeatingPlan';
import { api } from './services/api';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const [preselectedExamId, setPreselectedExamId] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev?.id === Date.now() ? null : prev));
    }, 4500);
  };

  const fetchDashboardStats = async () => {
    try {
      const res = await api.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      const res = await api.seedDemoData();
      if (res.success) {
        showToast('Demo dataset loaded! 120 students, 3 rooms, 2 exams in MongoDB Atlas.', 'success');
        fetchDashboardStats();
      }
    } catch (err) {
      showToast(`Seed failed: ${err.message}`, 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleViewPlan = async (planId) => {
    try {
      const res = await api.getSeatingPlanById(planId);
      if (res.success) {
        setActivePlan(res.data);
        setCurrentTab('visual_plan');
      }
    } catch (err) {
      showToast(`Failed to load seating plan: ${err.message}`, 'error');
    }
  };

  const handleNavigateToGenerate = (examId) => {
    setPreselectedExamId(examId);
    setCurrentTab('generate');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200 border-slate-700 bg-slate-900/95">
          {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="h-5 w-5 text-brand-400 shrink-0" />}
          <p className="text-xs font-semibold text-slate-200 pr-2">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="rounded p-1 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab === 'visual_plan' ? 'history' : currentTab}
        setCurrentTab={(tab) => {
          setActivePlan(null);
          setCurrentTab(tab);
        }}
        counts={{
          students: stats?.totalStudents,
          rooms: stats?.totalRooms,
          exams: stats?.totalExams,
          plans: stats?.totalPlans,
        }}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top Navbar */}
        <Navbar
          onSeedData={handleSeedData}
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            setActivePlan(null);
            setCurrentTab(tab);
          }}
          isSeeding={isSeeding}
        />

        {/* Mobile Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 bg-slate-900/60 p-2 md:hidden">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'students', label: 'Students' },
            { id: 'rooms', label: 'Rooms' },
            { id: 'exams', label: 'Exams' },
            { id: 'generate', label: 'Generate' },
            { id: 'history', label: 'History' },
            { id: 'analytics', label: 'Analytics' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActivePlan(null);
                setCurrentTab(t.id);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                currentTab === t.id ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            
            {currentTab === 'dashboard' && (
              <DashboardPage
                stats={stats}
                latestPlan={stats?.latestPlan}
                onNavigate={setCurrentTab}
                onViewPlan={handleViewPlan}
                onSeedData={handleSeedData}
                isSeeding={isSeeding}
              />
            )}

            {currentTab === 'students' && (
              <StudentsPage
                showToast={showToast}
                onDataChange={fetchDashboardStats}
              />
            )}

            {currentTab === 'rooms' && (
              <RoomsPage
                showToast={showToast}
                onDataChange={fetchDashboardStats}
              />
            )}

            {currentTab === 'exams' && (
              <ExamsPage
                showToast={showToast}
                onNavigateToGenerate={handleNavigateToGenerate}
                onDataChange={fetchDashboardStats}
              />
            )}

            {currentTab === 'generate' && (
              <GeneratePage
                preselectedExamId={preselectedExamId}
                onViewPlan={handleViewPlan}
                showToast={showToast}
                onDataChange={fetchDashboardStats}
              />
            )}

            {currentTab === 'history' && (
              <HistoryPage
                onViewPlan={handleViewPlan}
                showToast={showToast}
                onDataChange={fetchDashboardStats}
              />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsPage showToast={showToast} />
            )}

            {currentTab === 'visual_plan' && (
              <VisualSeatingPlan
                plan={activePlan}
                onBack={() => setCurrentTab('history')}
              />
            )}

          </div>
        </main>

      </div>
    </div>
  );
}
