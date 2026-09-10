import React, { useEffect, useMemo, useState } from 'react';
import { getSchemes, saveScheme, toggleSchemeStatus, deleteScheme, SCHEME_CHANGE_EVENT } from '../shared/services/schemesService';
import SchemeHeader from '../shared/components/Schemes/Scheme_Header';
import SchemeCards from '../shared/components/Schemes/Scheme_Cards';
import SchemeFilter from '../shared/components/Schemes/Scheme_Filter';
import SchemesList from '../shared/components/Schemes/Schemes_List';
import SchemeFormModal from '../shared/components/Schemes/Scheme_Form_Modal';

export default function SchemesPage() {
  const [schemes, setSchemes] = useState(() => getSchemes());
  const [loanType, setLoanType] = useState('All');
  const [status, setStatus] = useState('All');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [tab, setTab] = useState('All');

  // undefined = modal closed, null = "add new", object = "edit this one"
  const [formTarget, setFormTarget] = useState(undefined);

  // Schemes can change from this page's own actions (add/edit/delete/
  // toggle), so keep local state in sync with the store either way.
  useEffect(() => {
    const refresh = () => setSchemes(getSchemes());
    window.addEventListener(SCHEME_CHANGE_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(SCHEME_CHANGE_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  // Loan type + category + search narrow the pool that both the
  // status-tab counts and the table are drawn from; the tab/status
  // filter itself is applied on top of that, separately, so switching
  // tabs doesn't reset whatever loan type or search is currently set.
  const loanAndFilterMatched = useMemo(() => {
    const q = appliedSearch.trim().toLowerCase();
    return schemes.filter((s) => {
      if (loanType !== 'All' && s.loanType !== loanType) return false;
      if (category !== 'All' && s.category !== category) return false;
      if (q && !(s.name.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [schemes, loanType, category, appliedSearch]);

  const allCount = loanAndFilterMatched.length;
  const activeCount = loanAndFilterMatched.filter((s) => s.status === 'Active').length;
  const inactiveCount = loanAndFilterMatched.filter((s) => s.status === 'Inactive').length;

  const visibleSchemes = useMemo(() => {
    return loanAndFilterMatched
      .filter((s) => tab === 'All' || s.status === tab)
      .filter((s) => status === 'All' || s.status === status)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [loanAndFilterMatched, tab, status]);

  const handleReset = () => {
    setLoanType('All');
    setStatus('All');
    setCategory('All');
    setSearch('');
    setAppliedSearch('');
    setTab('All');
  };

  const handleSave = (data) => {
    setSchemes(saveScheme(data));
    setFormTarget(undefined);
  };

  const handleToggleStatus = (scheme) => setSchemes(toggleSchemeStatus(scheme.id));
  const handleDelete = (scheme) => setSchemes(deleteScheme(scheme.id));

  return (
    <div className="flex flex-col gap-5">
      <SchemeHeader onAddNew={() => setFormTarget(null)} />

      <SchemeCards schemes={schemes} />

      <SchemeFilter
        loanType={loanType}
        status={status}
        category={category}
        search={search}
        onLoanTypeChange={setLoanType}
        onStatusChange={setStatus}
        onCategoryChange={setCategory}
        onSearchChange={setSearch}
        onApply={() => setAppliedSearch(search)}
        onReset={handleReset}
      />

      <SchemesList
        schemes={visibleSchemes}
        allCount={allCount}
        activeCount={activeCount}
        inactiveCount={inactiveCount}
        tab={tab}
        onTabChange={setTab}
        onEdit={(scheme) => setFormTarget(scheme)}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />

      {formTarget !== undefined && (
        <SchemeFormModal initial={formTarget} onClose={() => setFormTarget(undefined)} onSave={handleSave} />
      )}
    </div>
  );
}