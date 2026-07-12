import KPICards from './KPICards';
import Row2 from './Row2';
import Row3 from './Row3';
import Row4 from './Row4';
import Row5 from './Row5';
import Row6 from './Row6';
import { Plus, FileText, HeartPulse, Sparkles } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="dashboard-content" style={{ paddingBottom: '40px' }}>
      
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Executive ESG Overview</h1>
          <p className="text-secondary">Monitor Environmental, Social and Governance performance across the organization.</p>
        </div>
        
        {/* Extra Widgets - Floating */}
        <div className="flex gap-4">
          <div className="glass-panel px-4 py-2 flex items-center gap-3">
            <HeartPulse color="var(--color-primary-green)" size={20} />
            <div className="flex-col">
              <span className="text-xs text-secondary">ESG Health</span>
              <span className="text-sm font-bold text-green">81% Excellent</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Panel */}
      <div className="glass-panel p-4 mb-8 flex items-center justify-between animate-fade-in" style={{ borderLeft: '4px solid var(--color-purple)', background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.1) 0%, rgba(30, 41, 59, 1) 100%)' }}>
        <div className="flex items-center gap-3">
          <Sparkles color="var(--color-purple)" size={20} />
          <span className="text-sm font-medium">"AI recommends reducing fleet emissions by 9% to meet Q3 targets."</span>
        </div>
        <button className="btn-outline text-xs text-purple border-purple" style={{ borderColor: 'var(--color-purple)' }}>Apply Suggestion</button>
      </div>

      {/* Rows */}
      <KPICards />
      <Row2 />
      <Row3 />
      <Row4 />
      <Row5 />
      <Row6 />

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-8 mb-12 animate-fade-in delay-500">
        <button className="btn-primary" style={{ flex: '1 1 auto', justifyContent: 'center' }}>
          <Plus size={16} /> Log Carbon Transaction
        </button>
        <button className="btn-primary" style={{ background: 'var(--color-blue)', flex: '1 1 auto', justifyContent: 'center' }}>
          <Plus size={16} /> Add CSR Activity
        </button>
        <button className="btn-primary" style={{ background: 'var(--color-orange)', flex: '1 1 auto', justifyContent: 'center' }}>
          <Plus size={16} /> Create Challenge
        </button>
        <button className="btn-primary" style={{ background: 'var(--color-purple)', flex: '1 1 auto', justifyContent: 'center' }}>
          <Plus size={16} /> Start Audit
        </button>
        <button className="btn-primary" style={{ background: 'var(--color-red)', flex: '1 1 auto', justifyContent: 'center' }}>
          <Plus size={16} /> Add Compliance Issue
        </button>
        <button className="btn-outline" style={{ flex: '1 1 auto', justifyContent: 'center' }}>
          <FileText size={16} /> Generate ESG Report
        </button>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between text-xs text-muted border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex gap-4">
          <span>Version 1.0</span>
          <span>Last Updated: Today 10:45 AM</span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary-green)' }}></span>
          <span>Data Synced Successfully</span>
        </div>
      </footer>
      
    </div>
  );
}
