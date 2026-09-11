import React, { useEffect, useMemo, useState } from 'react';
import {
  getBanks, saveBank, toggleBankStatus,
  getBranches, saveBranch, deleteBranch,
  BANK_CHANGE_EVENT, BRANCH_CHANGE_EVENT,
} from '../shared/services/banksService';
import BankHeader from '../shared/components/Banks/Bank_Header';
import BankCards from '../shared/components/Banks/Bank_Cards';
import BankFilter from '../shared/components/Banks/Bank_Filter';
import BanksList from '../shared/components/Banks/Banks_List';
import BankFormModal from '../shared/components/Banks/Bank_Form_Model';
import BankBranchModal from '../shared/components/Banks/Bank_Branch_Modal';

export default function BanksPage() {
  const [banks, setBanks] = useState(() => getBanks());
  const [branches, setBranches] = useState(() => getBranches());
  const [bankType, setBankType] = useState('All');
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [tab, setTab] = useState('All');

  // undefined = modal closed, null = "add new", object = "edit this one" —
  // two separate targets since "Add Bank" and "Add Branch Manager" are
  // different forms, saving to different stores.
  const [bankFormTarget, setBankFormTarget] = useState(undefined);
  const [branchFormTarget, setBranchFormTarget] = useState(undefined);

  useEffect(() => {
    const refreshBanks = () => setBanks(getBanks());
    const refreshBranches = () => setBranches(getBranches());
    window.addEventListener(BANK_CHANGE_EVENT, refreshBanks);
    window.addEventListener(BRANCH_CHANGE_EVENT, refreshBranches);
    window.addEventListener('storage', refreshBanks);
    window.addEventListener('storage', refreshBranches);
    return () => {
      window.removeEventListener(BANK_CHANGE_EVENT, refreshBanks);
      window.removeEventListener(BRANCH_CHANGE_EVENT, refreshBranches);
      window.removeEventListener('storage', refreshBanks);
      window.removeEventListener('storage', refreshBranches);
    };
  }, []);

  // Every table row is a branch, joined with its parent bank for name,
  // logo and active/inactive status — a branch has no status of its own,
  // it follows whichever bank it belongs to. A branch whose bank was
  // deleted still shows (using its own saved bankName) rather than
  // vanishing silently.
  const rows = useMemo(() => {
    return branches.map((br) => {
      const bank = banks.find((b) => b.id === br.bankId);
      return {
        id: br.id,
        bankId: br.bankId,
        name: bank?.name || br.bankName || 'Unknown Bank',
        shortName: bank?.shortName,
        logo: bank?.logo || null,
        status: bank?.status || 'Inactive',
        bankType: br.bankType,
        ifscCode: br.ifscCode,
        branchName: br.branchName,
        shortDescription: br.shortDescription,
        managers: br.managers || [],
        phone: br.managers?.[0]?.phone || '',
        createdAt: br.createdAt,
      };
    });
  }, [branches, banks]);

  // Bank type + search narrow the pool that both the status-tab counts
  // and the table are drawn from; the tab/status filter itself is applied
  // on top of that, separately, so switching tabs doesn't reset whatever
  // bank type or search is currently set.
  const typeAndSearchMatched = useMemo(() => {
    const q = appliedSearch.trim().toLowerCase();
    return rows.filter((r) => {
      if (bankType !== 'All' && r.bankType !== bankType) return false;
      if (q && !(
        r.name.toLowerCase().includes(q) ||
        (r.ifscCode || '').toLowerCase().includes(q) ||
        (r.branchName || '').toLowerCase().includes(q)
      )) return false;
      return true;
    });
  }, [rows, bankType, appliedSearch]);

  const allCount = typeAndSearchMatched.length;
  const activeCount = typeAndSearchMatched.filter((r) => r.status === 'Active').length;
  const inactiveCount = typeAndSearchMatched.filter((r) => r.status === 'Inactive').length;

  const visibleRows = useMemo(() => {
    return typeAndSearchMatched
      .filter((r) => tab === 'All' || r.status === tab)
      .filter((r) => status === 'All' || r.status === status)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [typeAndSearchMatched, tab, status]);

  const handleReset = () => {
    setBankType('All');
    setStatus('All');
    setSearch('');
    setAppliedSearch('');
    setTab('All');
  };

  const handleSaveBank = (data) => {
    setBanks(saveBank(data));
    setBankFormTarget(undefined);
  };

  const handleSaveBranch = (data) => {
    setBranches(saveBranch(data));
    setBranchFormTarget(undefined);
  };

  // Editing a row means editing its branch (type/IFSC/branch name/
  // managers) — pull the real branch record (with its full managers
  // array), not the flattened row, so the form has everything to edit.
  const handleEditRow = (row) => {
    const branch = branches.find((b) => b.id === row.id);
    setBranchFormTarget(branch || null);
  };

  // Status lives on the bank, so toggling it here toggles the bank
  // itself — every branch under that bank reflects the change.
  const handleToggleStatus = (row) => setBanks(toggleBankStatus(row.bankId));

  // Deleting a row removes just that branch, not the whole bank (a bank
  // can have other branches).
  const handleDeleteRow = (row) => setBranches(deleteBranch(row.id));

  return (
    <div className="flex flex-col gap-5">
      <BankHeader onAddNew={() => setBankFormTarget(null)} onAddManager={() => setBranchFormTarget(null)} />

      <BankCards banks={rows} />

      <BankFilter
        bankType={bankType}
        status={status}
        search={search}
        onBankTypeChange={setBankType}
        onStatusChange={setStatus}
        onSearchChange={setSearch}
        onApply={() => setAppliedSearch(search)}
        onReset={handleReset}
      />

      <BanksList
        banks={visibleRows}
        allCount={allCount}
        activeCount={activeCount}
        inactiveCount={inactiveCount}
        tab={tab}
        onTabChange={setTab}
        onEdit={handleEditRow}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteRow}
      />

      {bankFormTarget !== undefined && (
        <BankFormModal initial={bankFormTarget} onClose={() => setBankFormTarget(undefined)} onSave={handleSaveBank} />
      )}
      {branchFormTarget !== undefined && (
        <BankBranchModal initial={branchFormTarget} onClose={() => setBranchFormTarget(undefined)} onSave={handleSaveBranch} />
      )}
    </div>
  );
}