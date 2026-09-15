// import React, { useEffect, useRef, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
//   Menu, X, Search, Bell, ChevronDown, LogOut, Settings,
//   ExternalLink, FileText, Inbox,
// } from 'lucide-react';
// import { getSession, getApplications, logoutUser } from '../../utils/auth';

// // Same brand tokens as Sidebar.jsx / the borrower-facing pages.
// const NAVY = '#132261';
// const BLUE = '#2f76fb';
// const SLATE = '#757e9e';
// const TEXT = '#242938';
// const BORDER = '#e7e9f2';
// const FONT = "'Poppins', sans-serif";

// // Turns the current route into a heading, so the topbar tells the admin
// // where they are without needing a separate breadcrumb component.
// const PAGE_TITLES = {
//   '/admin': 'Dashboard',
//   '/admin/applications': 'Applications',
//   '/admin/borrowers': 'Borrowers',
//   '/admin/schemes': 'Loan Schemes',
//   '/admin/repayments': 'Repayments',
//   '/admin/reports': 'Reports',
//   '/admin/settings': 'Settings',
// };

// function timeAgo(iso) {
//   const diffMs = Date.now() - new Date(iso).getTime();
//   const mins = Math.floor(diffMs / 60000);
//   if (mins < 1) return 'just now';
//   if (mins < 60) return `${mins}m ago`;
//   const hours = Math.floor(mins / 60);
//   if (hours < 24) return `${hours}h ago`;
//   return `${Math.floor(hours / 24)}d ago`;
// }

// export default function Topbar({ toggleSidebar, isSidebarOpen }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const admin = getSession();

//   const [query, setQuery] = useState('');
//   const [notifOpen, setNotifOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [pending, setPending] = useState([]);
//   const notifRef = useRef(null);
//   const profileRef = useRef(null);

//   // Notifications are the real pending-review queue, not placeholder
//   // content — the same source Sidebar's badge count reads from.
//   useEffect(() => {
//     const refresh = () => {
//       const list = getApplications()
//         .filter((a) => a.status === 'Pending')
//         .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
//         .slice(0, 5);
//       setPending(list);
//     };
//     refresh();
//     window.addEventListener('applicationschange', refresh);
//     return () => window.removeEventListener('applicationschange', refresh);
//   }, []);

//   // Close either dropdown on an outside click.
//   useEffect(() => {
//     const onClick = (e) => {
//       if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
//       if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
//     };
//     document.addEventListener('mousedown', onClick);
//     return () => document.removeEventListener('mousedown', onClick);
//   }, []);

//   const pageTitle = PAGE_TITLES[location.pathname] || 'Admin';

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (!query.trim()) return;
//     navigate(`/admin/applications?q=${encodeURIComponent(query.trim())}`);
//   };

//   const handleLogout = () => {
//     setProfileOpen(false);
//     logoutUser();
//     navigate('/login');
//   };

//   const initials = admin?.fullName
//     ? admin.fullName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
//     : 'AD';

//   return (
//     <header
//       className="fixed inset-x-0 top-0 z-50 flex h-16 items-center gap-3 bg-white px-4 lg:px-6"
//       style={{ fontFamily: FONT, borderBottom: `1px solid ${BORDER}` }}
//     >
//       <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');`}</style>

//       {/* Sidebar toggle — same control drives mobile open/close and
//           desktop expand/collapse (Adminmain uses one boolean for both). */}
//       <button
//         onClick={toggleSidebar}
//         className="rounded-lg p-2 transition-colors hover:bg-[#f5f6fb]"
//         style={{ color: TEXT }}
//         aria-label={isSidebarOpen ? 'Collapse menu' : 'Expand menu'}
//         aria-expanded={isSidebarOpen}
//       >
//         {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
//       </button>

//       <h1 className="hidden shrink-0 text-[16px] font-bold sm:block" style={{ color: TEXT }}>
//         {pageTitle}
//       </h1>

//       {/* Search — the fastest path to a specific applicant or loan ID */}
//       <form onSubmit={handleSearch} className="mx-1 hidden max-w-md flex-1 md:block">
//         <div
//           className="flex items-center gap-2 rounded-full px-3.5 py-2"
//           style={{ background: '#f5f6fb' }}
//         >
//           <Search size={15} style={{ color: SLATE }} />
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             type="text"
//             placeholder="Search applications, borrowers, loan ID…"
//             className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#9aa1b8]"
//             style={{ color: TEXT }}
//           />
//         </div>
//       </form>

//       <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
//         {/* Jump back to what borrowers actually see */}
//         <button
//           onClick={() => window.open('/', '_blank', 'noopener,noreferrer')}
//           className="hidden items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition-colors hover:bg-[#f5f6fb] lg:flex"
//           style={{ color: SLATE }}
//         >
//           <ExternalLink size={14} />
//           View site
//         </button>

//         {/* Notifications — the live pending-applications queue */}
//         <div className="relative" ref={notifRef}>
//           <button
//             onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
//             className="relative rounded-full p-2 transition-colors hover:bg-[#f5f6fb]"
//             style={{ color: TEXT }}
//             aria-label="Notifications"
//           >
//             <Bell size={19} />
//             {pending.length > 0 && (
//               <span
//                 className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
//                 style={{ background: '#e0532c' }}
//               >
//                 {pending.length}
//               </span>
//             )}
//           </button>

//           {notifOpen && (
//             <div
//               className="absolute right-0 top-[calc(100%+10px)] w-80 overflow-hidden rounded-2xl border bg-white shadow-[0_16px_40px_rgba(19,34,97,0.14)]"
//               style={{ borderColor: BORDER, zIndex: 60 }}
//             >
//               <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: BORDER }}>
//                 <p className="text-[13px] font-bold" style={{ color: TEXT }}>Pending review</p>
//                 {pending.length > 0 && (
//                   <span className="text-[11.5px] font-semibold" style={{ color: BLUE }}>
//                     {pending.length} new
//                   </span>
//                 )}
//               </div>

//               {pending.length === 0 ? (
//                 <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
//                   <Inbox size={22} style={{ color: SLATE }} />
//                   <p className="text-[12.5px]" style={{ color: SLATE }}>Nothing waiting on review right now.</p>
//                 </div>
//               ) : (
//                 <ul className="max-h-72 overflow-y-auto">
//                   {pending.map((app) => (
//                     <li key={app.id}>
//                       <button
//                         onClick={() => { setNotifOpen(false); navigate(`/admin/applications/${app.id}`); }}
//                         className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#f5f6fb]"
//                       >
//                         <div
//                           className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
//                           style={{ background: '#eaf1fe', color: BLUE }}
//                         >
//                           <FileText size={14} />
//                         </div>
//                         <div className="min-w-0 flex-1">
//                           <p className="truncate text-[12.5px] font-semibold" style={{ color: TEXT }}>
//                             {app.name || app.email} — {app.schemeTitle || 'Loan application'}
//                           </p>
//                           <p className="text-[11.5px]" style={{ color: SLATE }}>{timeAgo(app.appliedAt)}</p>
//                         </div>
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               )}

//               <button
//                 onClick={() => { setNotifOpen(false); navigate('/admin/applications'); }}
//                 className="block w-full border-t py-2.5 text-center text-[12.5px] font-semibold transition-colors hover:bg-[#f5f6fb]"
//                 style={{ borderColor: BORDER, color: BLUE }}
//               >
//                 View all applications
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Admin identity + account menu */}
//         <div className="relative" ref={profileRef}>
//           <button
//             onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
//             className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-[#f5f6fb]"
//           >
//             <div
//               className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold text-white"
//               style={{ background: `linear-gradient(135deg, ${BLUE}, ${NAVY})` }}
//             >
//               {initials}
//             </div>
//             <span className="hidden text-[13px] font-semibold sm:block" style={{ color: TEXT }}>
//               {admin?.fullName ? admin.fullName.split(' ')[0] : 'Admin'}
//             </span>
//             <ChevronDown
//               size={14}
//               style={{ color: SLATE, transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
//             />
//           </button>

//           {profileOpen && (
//             <div
//               className="absolute right-0 top-[calc(100%+10px)] w-52 rounded-2xl border bg-white py-1.5 shadow-[0_16px_40px_rgba(19,34,97,0.14)]"
//               style={{ borderColor: BORDER, zIndex: 60 }}
//             >
//               <div className="border-b px-4 py-2.5" style={{ borderColor: BORDER }}>
//                 <p className="truncate text-[13px] font-semibold" style={{ color: TEXT }}>{admin?.fullName || 'Admin'}</p>
//                 <p className="truncate text-[11.5px]" style={{ color: SLATE }}>{admin?.email}</p>
//               </div>
//               <button
//                 onClick={() => { setProfileOpen(false); navigate('/admin/settings'); }}
//                 className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] font-semibold transition-colors hover:bg-[#f5f6fb]"
//                 style={{ color: TEXT }}
//               >
//                 <Settings size={16} style={{ color: BLUE }} />
//                 Settings
//               </button>
//               <button
//                 onClick={handleLogout}
//                 className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] font-semibold transition-colors hover:bg-[#fdf0ee]"
//                 style={{ color: '#c23b1f' }}
//               >
//                 <LogOut size={16} />
//                 Log out
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }


import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, Search, Bell, ChevronDown, LogOut, Settings,
  ExternalLink, FileText, Inbox,
} from 'lucide-react';
import { getSession, getApplications, logoutUser } from '../../utils/auth';

// Same brand tokens as Sidebar.jsx / the borrower-facing pages.
const NAVY = '#132261';
const BLUE = '#2f76fb';
const SLATE = '#757e9e';
const TEXT = '#242938';
const BORDER = '#e7e9f2';
const FONT = "'Poppins', sans-serif";

// Turns the current route into a heading, so the topbar tells the admin
// where they are without needing a separate breadcrumb component.
const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/dashboard/applications': 'Applications',
  '/dashboard/approved': 'Approved Applications',
  '/dashboard/registered-users': 'Registered Users',
  '/dashboard/schemes': 'Loan Schemes',
  '/dashboard/banks': 'Banks',
  '/dashboard/repayments': 'Repayments',
  '/dashboard/reports': 'Reports',
  '/dashboard/settings': 'Settings',
};

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function Topbar({ toggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = getSession();

  const [query, setQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [pending, setPending] = useState([]);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Notifications are the real pending-review queue, not placeholder
  // content — the same source Sidebar's badge count reads from.
  useEffect(() => {
    const refresh = () => {
      const list = getApplications()
        .filter((a) => a.status === 'Pending')
        .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
        .slice(0, 5);
      setPending(list);
    };
    refresh();
    window.addEventListener('applicationschange', refresh);
    return () => window.removeEventListener('applicationschange', refresh);
  }, []);

  // Close either dropdown on an outside click.
  useEffect(() => {
    const onClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const pageTitle = PAGE_TITLES[location.pathname] || 'Admin';

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/dashboard/applications?q=${encodeURIComponent(query.trim())}`);
  };

  const handleLogout = () => {
    setProfileOpen(false);
    logoutUser();
    navigate('/login');
  };

  const initials = admin?.fullName
    ? admin.fullName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'AD';

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex h-16 items-center gap-3 bg-white px-4 lg:px-6"
      style={{ fontFamily: FONT, borderBottom: `1px solid ${BORDER}` }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');`}</style>

      {/* Sidebar toggle — same control drives mobile open/close and
          desktop expand/collapse (Adminmain uses one boolean for both). */}
      <button
        onClick={toggleSidebar}
        className="rounded-lg p-2 transition-colors hover:bg-[#f5f6fb]"
        style={{ color: TEXT }}
        aria-label={isSidebarOpen ? 'Collapse menu' : 'Expand menu'}
        aria-expanded={isSidebarOpen}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <h1 className="hidden shrink-0 text-[16px] font-bold sm:block" style={{ color: TEXT }}>
        {pageTitle}
      </h1>

      {/* Search — the fastest path to a specific applicant or loan ID */}
      <form onSubmit={handleSearch} className="mx-1 hidden max-w-md flex-1 md:block">
        <div
          className="flex items-center gap-2 rounded-full px-3.5 py-2"
          style={{ background: '#f5f6fb' }}
        >
          <Search size={15} style={{ color: SLATE }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search applications, borrowers, loan ID…"
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#9aa1b8]"
            style={{ color: TEXT }}
          />
        </div>
      </form>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
        {/* Jump back to what borrowers actually see */}
        <button
          onClick={() => window.open('/', '_blank', 'noopener,noreferrer')}
          className="hidden items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition-colors hover:bg-[#f5f6fb] lg:flex"
          style={{ color: SLATE }}
        >
          <ExternalLink size={14} />
          View site
        </button>

        {/* Notifications — the live pending-applications queue */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
            className="relative rounded-full p-2 transition-colors hover:bg-[#f5f6fb]"
            style={{ color: TEXT }}
            aria-label="Notifications"
          >
            <Bell size={19} />
            {pending.length > 0 && (
              <span
                className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
                style={{ background: '#e0532c' }}
              >
                {pending.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 top-[calc(100%+10px)] w-80 overflow-hidden rounded-2xl border bg-white shadow-[0_16px_40px_rgba(19,34,97,0.14)]"
              style={{ borderColor: BORDER, zIndex: 60 }}
            >
              <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: BORDER }}>
                <p className="text-[13px] font-bold" style={{ color: TEXT }}>Pending review</p>
                {pending.length > 0 && (
                  <span className="text-[11.5px] font-semibold" style={{ color: BLUE }}>
                    {pending.length} new
                  </span>
                )}
              </div>

              {pending.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                  <Inbox size={22} style={{ color: SLATE }} />
                  <p className="text-[12.5px]" style={{ color: SLATE }}>Nothing waiting on review right now.</p>
                </div>
              ) : (
                <ul className="max-h-72 overflow-y-auto">
                  {pending.map((app) => (
                    <li key={app.id}>
                      <button
                        onClick={() => { setNotifOpen(false); navigate(`/dashboard/applications/${app.id}`); }}
                        className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#f5f6fb]"
                      >
                        <div
                          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                          style={{ background: '#eaf1fe', color: BLUE }}
                        >
                          <FileText size={14} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12.5px] font-semibold" style={{ color: TEXT }}>
                            {app.name || app.email} — {app.schemeTitle || 'Loan application'}
                          </p>
                          <p className="text-[11.5px]" style={{ color: SLATE }}>{timeAgo(app.appliedAt)}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => { setNotifOpen(false); navigate('/dashboard/applications'); }}
                className="block w-full border-t py-2.5 text-center text-[12.5px] font-semibold transition-colors hover:bg-[#f5f6fb]"
                style={{ borderColor: BORDER, color: BLUE }}
              >
                View all applications
              </button>
            </div>
          )}
        </div>

        {/* Admin identity + account menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-[#f5f6fb]"
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${BLUE}, ${NAVY})` }}
            >
              {initials}
            </div>
            <span className="hidden text-[13px] font-semibold sm:block" style={{ color: TEXT }}>
              {admin?.fullName ? admin.fullName.split(' ')[0] : 'Admin'}
            </span>
            <ChevronDown
              size={14}
              style={{ color: SLATE, transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            />
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 top-[calc(100%+10px)] w-52 rounded-2xl border bg-white py-1.5 shadow-[0_16px_40px_rgba(19,34,97,0.14)]"
              style={{ borderColor: BORDER, zIndex: 60 }}
            >
              <div className="border-b px-4 py-2.5" style={{ borderColor: BORDER }}>
                <p className="truncate text-[13px] font-semibold" style={{ color: TEXT }}>{admin?.fullName || 'Admin'}</p>
                <p className="truncate text-[11.5px]" style={{ color: SLATE }}>{admin?.email}</p>
              </div>
              <button
                onClick={() => { setProfileOpen(false); navigate('/dashboard/settings'); }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] font-semibold transition-colors hover:bg-[#f5f6fb]"
                style={{ color: TEXT }}
              >
                <Settings size={16} style={{ color: BLUE }} />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] font-semibold transition-colors hover:bg-[#fdf0ee]"
                style={{ color: '#c23b1f' }}
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}