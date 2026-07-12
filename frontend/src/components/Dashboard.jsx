import KPICards from './KPICards';
import Row2 from './Row2';
import Row3 from './Row3';
import Row4 from './Row4';
import Row5 from './Row5';

export default function Dashboard() {
  return (
    <div className="dashboard-content" style={{ paddingBottom: '40px' }}>
      
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1 text-primary" style={{ color: 'var(--color-text-primary)' }}>Executive ESG Overview</h1>
        <p className="text-secondary text-sm">Monitor Environmental, Social and Governance performance across the organization.</p>
      </div>

      {/* Rows */}
      <KPICards />
      <Row2 />
      <Row3 />
      <Row4 />
      <Row5 />

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-8 mb-12">
        <button className="btn-outline">Log Carbon</button>
        <button className="btn-outline">Create Challenge</button>
        <button className="btn-outline">Create Audit</button>
        <button className="btn-outline">Generate Report</button>
        <button className="btn-outline">Add CSR</button>
        <button className="btn-outline">Add Policy</button>
      </div>

    </div>
  );
}
