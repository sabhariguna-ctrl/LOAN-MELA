import React, { useEffect, useMemo, useState } from 'react';
import { getUsers, getApplications } from '../../utils/auth';
import RegisteredUserHeader from '../shared/components/Registerusers/Registereduser header';
import RegisteredUserCards from '../shared/components/Registerusers/Registereduser cards';
import RegisteredUserFilter from '../shared/components/Registerusers/Registereduser filter';
import RegisteredUsersList from '../shared/components/Registerusers/Registeredusers list';

export default function RegisteredUsersPage() {
  const [users, setUsers] = useState(() => getUsers());
  const [applications, setApplications] = useState(() => getApplications());
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All');
  const [hasApplications, setHasApplications] = useState('All');

  // A borrower registers from the public Register page (possibly in
  // another tab), and can apply for a loan afterwards — either of those
  // changes this list's contents or its "Applications" count, so stay
  // live on both events the same way ApplicationsPage does for its own
  // data.
  useEffect(() => {
    const refreshUsers = () => setUsers(getUsers());
    const refreshApplications = () => setApplications(getApplications());
    window.addEventListener('authchange', refreshUsers);
    window.addEventListener('storage', refreshUsers);
    window.addEventListener('storage', refreshApplications);
    window.addEventListener('applicationschange', refreshApplications);
    return () => {
      window.removeEventListener('authchange', refreshUsers);
      window.removeEventListener('storage', refreshUsers);
      window.removeEventListener('storage', refreshApplications);
      window.removeEventListener('applicationschange', refreshApplications);
    };
  }, []);

  const applicationCountByEmail = useMemo(() => {
    const counts = new Map();
    applications.forEach((a) => {
      const email = (a.userEmail || '').toLowerCase();
      if (!email) return;
      counts.set(email, (counts.get(email) || 0) + 1);
    });
    return counts;
  }, [applications]);

  const applicantEmails = useMemo(() => new Set(applicationCountByEmail.keys()), [applicationCountByEmail]);

  const enrichedUsers = useMemo(
    () => users.map((u) => ({ ...u, applicationCount: applicationCountByEmail.get((u.email || '').toLowerCase()) || 0 })),
    [users, applicationCountByEmail]
  );

  const cityOptions = useMemo(() => {
    const set = new Set();
    users.forEach((u) => { if (u.city) set.add(u.city); });
    return [...set].sort();
  }, [users]);

  const query = search.toLowerCase();
  const visibleBorrowers = useMemo(() => {
    return enrichedUsers
      .filter((u) => city === 'All' || u.city === city)
      .filter((u) => {
        if (hasApplications === 'All') return true;
        const applied = u.applicationCount > 0;
        return hasApplications === 'Yes' ? applied : !applied;
      })
      .filter((u) => {
        if (!query) return true;
        return (
          (u.fullName || '').toLowerCase().includes(query) ||
          (u.email || '').toLowerCase().includes(query) ||
          (u.mobile || '').toLowerCase().includes(query)
        );
      })
      .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
  }, [enrichedUsers, city, hasApplications, query]);

  const handleReset = () => {
    setSearch('');
    setCity('All');
    setHasApplications('All');
  };

  return (
    <div className="flex flex-col gap-5">
      <RegisteredUserHeader />

      <RegisteredUserCards users={users} applicantEmails={applicantEmails} />

      <RegisteredUserFilter
        search={search}
        onSearchChange={setSearch}
        city={city}
        cityOptions={cityOptions}
        onCityChange={setCity}
        hasApplications={hasApplications}
        onHasApplicationsChange={setHasApplications}
        onReset={handleReset}
      />

      <RegisteredUsersList borrowers={visibleBorrowers} />
    </div>
  );
}