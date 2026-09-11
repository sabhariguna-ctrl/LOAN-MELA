import React, { useEffect, useMemo, useState } from 'react';
import { getApplications, updateApplicationStatus } from '../../utils/auth';
import ApplicationHeader from '../shared/components/Applications/Application_Header';
import ApplicationCards from '../shared/components/Applications/Application_Cards';
import ApplicationFilter from '../shared/components/Applications/Application_Filter';
import ApplicationsList from '../shared/components/Applications/Applications_List';
import NewApplicationModal from '../shared/components/Applications/NewApplicationModal';

const STATUS_OPTIONS = ['Pending', 'Approved', 'Rejected'];

// Applications can be dated with either an ISO string (from appliedAt) or
// a plain "YYYY-MM-DD" (from the <input type="date"> filter fields), so
// both sides of the range check are compared as calendar days, not exact
// timestamps — otherwise "From: today" would exclude an application
// submitted earlier today.
function isWithinRange(appliedAt, from, to) {
  const applied = new Date(appliedAt);
  if (Number.isNaN(applied.getTime())) return false;
  const day = new Date(applied.getFullYear(), applied.getMonth(), applied.getDate());
  if (from && day < new Date(from)) return false;
  if (to && day > new Date(to)) return false;
  return true;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState(() => getApplications());
  const [loanType, setLoanType] = useState('All');
  const [status, setStatus] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isNewAppOpen, setIsNewAppOpen] = useState(false);

  // Applications can change from another tab/route (the public Loan
  // Scheme page's "Apply Now" form) or from this page's own row-menu
  // approve/reject action, so keep the list live either way.
  useEffect(() => {
    const refresh = () => setApplications(getApplications());
    window.addEventListener('applicationschange', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('applicationschange', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const loanTypeOptions = useMemo(() => {
    const set = new Set();
    applications.forEach((a) => { if (a.filterGroup || a.categoryLabel) set.add(a.filterGroup || a.categoryLabel); });
    return [...set].sort();
  }, [applications]);

  // Loan type + date filters narrow the pool that both the status tab
  // counts and the table are drawn from; the status tab/filter itself is
  // applied on top of that, separately, so switching tabs doesn't reset
  // whatever loan type or date range is currently set.
  const loanAndDateFiltered = useMemo(() => {
    return applications
      .filter((a) => loanType === 'All' || (a.filterGroup || a.categoryLabel) === loanType)
      .filter((a) => isWithinRange(a.appliedAt, fromDate, toDate));
  }, [applications, loanType, fromDate, toDate]);

  const statusTabs = useMemo(() => {
    const count = (s) => loanAndDateFiltered.filter((a) => a.status === s).length;
    return [
      { key: 'All', label: 'All Applications', count: loanAndDateFiltered.length },
      { key: 'Pending', label: 'In Progress', count: count('Pending') },
      { key: 'Approved', label: 'Approved', count: count('Approved') },
      { key: 'Rejected', label: 'Rejected', count: count('Rejected') },
    ];
  }, [loanAndDateFiltered]);

  const visibleApplications = useMemo(() => {
    return loanAndDateFiltered
      .filter((a) => status === 'All' || a.status === status)
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
  }, [loanAndDateFiltered, status]);

  const handleReset = () => {
    setLoanType('All');
    setStatus('All');
    setFromDate('');
    setToDate('');
  };

  const handleUpdateStatus = (id, newStatus) => {
    updateApplicationStatus(id, newStatus);
  };

  return (
    <div className="flex flex-col gap-5">
      <ApplicationHeader onNewApplication={() => setIsNewAppOpen(true)} />

      <ApplicationCards applications={applications} />

      <ApplicationFilter
        loanTypeOptions={loanTypeOptions}
        loanType={loanType}
        status={status}
        statusOptions={STATUS_OPTIONS}
        fromDate={fromDate}
        toDate={toDate}
        onLoanTypeChange={setLoanType}
        onStatusChange={setStatus}
        onApplyDates={({ from, to }) => { setFromDate(from); setToDate(to); }}
        onReset={handleReset}
      />

      <ApplicationsList
        applications={visibleApplications}
        statusTabs={statusTabs}
        status={status}
        onStatusChange={setStatus}
        onUpdateStatus={handleUpdateStatus}
      />

      {isNewAppOpen && (
        <NewApplicationModal onClose={() => setIsNewAppOpen(false)} />
      )}
    </div>
  );
}