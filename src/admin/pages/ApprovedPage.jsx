import React, { useEffect, useMemo, useState } from 'react';
import { getApplications, updateApplicationStatus } from '../../utils/auth';
import ApprovedHeader from '../shared/components/Approved/Approved_Header';
import ApprovedCards from '../shared/components/Approved/Approved_Cards';
import ApprovedFilter from '../shared/components/Approved/Approved_Filter';
import ApprovedList from '../shared/components/Approved/Approved_List';

export default function ApprovedPage() {
  const [applications, setApplications] = useState(() => getApplications());
  const [loanType, setLoanType] = useState('All');
  const [loanScheme, setLoanScheme] = useState('All');
  const [bank, setBank] = useState('All');
  const [search, setSearch] = useState('');

  // Applications can change from another tab/route (the public Loan
  // Scheme page's "Apply Now" form) or from this page's own row-menu
  // revoke action, so keep the list live either way — same convention
  // as ApplicationsPage.jsx.
  useEffect(() => {
    const refresh = () => setApplications(getApplications());
    window.addEventListener('applicationschange', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('applicationschange', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  // This page only ever shows Approved-status rows — Approved_Filter's
  // dropdowns narrow within that set, they never widen back out to
  // Pending/Rejected.
  const approved = useMemo(() => applications.filter((a) => a.status === 'Approved'), [applications]);

  const loanTypeOptions = useMemo(() => {
    const set = new Set();
    approved.forEach((a) => { if (a.filterGroup || a.categoryLabel) set.add(a.filterGroup || a.categoryLabel); });
    return [...set].sort();
  }, [approved]);

  const schemeOptions = useMemo(() => {
    const set = new Set();
    approved.forEach((a) => { if (a.schemeTitle) set.add(a.schemeTitle); });
    return [...set].sort();
  }, [approved]);

  // `bank` isn't captured on submission today (the borrower-facing Apply
  // form only asks for scheme/amount/city), so this list is empty until
  // that field exists — the dropdown just won't offer any options yet,
  // which is honest rather than showing banks no approved row actually has.
  const bankOptions = useMemo(() => {
    const set = new Set();
    approved.forEach((a) => { if (a.bank) set.add(a.bank); });
    return [...set].sort();
  }, [approved]);

  const visibleApplications = useMemo(() => {
    const q = search.trim().toLowerCase();
    return approved
      .filter((a) => loanType === 'All' || (a.filterGroup || a.categoryLabel) === loanType)
      .filter((a) => loanScheme === 'All' || a.schemeTitle === loanScheme)
      .filter((a) => bank === 'All' || a.bank === bank)
      .filter((a) => {
        if (!q) return true;
        return (
          (a.id || '').toLowerCase().includes(q) ||
          (a.name || '').toLowerCase().includes(q) ||
          (a.phone || '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.statusUpdatedAt || b.appliedAt) - new Date(a.statusUpdatedAt || a.appliedAt));
  }, [approved, loanType, loanScheme, bank, search]);

  const handleReset = () => {
    setLoanType('All');
    setLoanScheme('All');
    setBank('All');
    setSearch('');
  };

  const handleUpdateStatus = (id, newStatus) => {
    updateApplicationStatus(id, newStatus);
  };

  const handleHeaderExport = () => {
    // Delegates to the same CSV export the table's own Export button
    // uses — triggered here via a synthetic click isn't worth the
    // indirection, so instead the header just re-runs the identical
    // "export what's currently visible" behavior directly.
    if (visibleApplications.length === 0) return;
    const headers = ['Application ID', 'Applicant Name', 'Loan Type', 'Loan Scheme', 'Bank', 'Approved Date', 'Loan Amount'];
    const csvCell = (value) => {
      const s = String(value ?? '');
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [headers.join(',')];
    visibleApplications.forEach((r) => {
      lines.push([
        r.id, r.name, r.filterGroup || r.categoryLabel, r.schemeTitle, r.bank || '—',
        r.statusUpdatedAt || r.appliedAt, r.amount,
      ].map(csvCell).join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `approved-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-5">
      <ApprovedHeader onExport={handleHeaderExport} />

      <ApprovedCards approved={approved} />

      <ApprovedFilter
        loanTypeOptions={loanTypeOptions}
        loanType={loanType}
        schemeOptions={schemeOptions}
        loanScheme={loanScheme}
        bankOptions={bankOptions}
        bank={bank}
        search={search}
        onLoanTypeChange={setLoanType}
        onLoanSchemeChange={setLoanScheme}
        onBankChange={setBank}
        onSearchChange={setSearch}
        onApply={() => {}}
        onReset={handleReset}
      />

      <ApprovedList
        applications={visibleApplications}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}