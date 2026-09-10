// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//   LayoutDashboard, FileText, Users, Landmark, Wallet,
//   BarChart3, Settings, LogOut, X,
// } from 'lucide-react';
// import { getSession, getApplications, logoutUser } from '../../utils/auth';

// // Brand tokens — matches Loanschema.jsx / Register.jsx / Myapplications.jsx
// // so the admin side reads as the same product, not a bolted-on template.
// const NAVY = '#132261';
// const BLUE = '#2f76fb';
// const BLUE_TINT = '#eaf1fe';
// const SLATE = '#757e9e';
// const TEXT = '#242938';
// const BORDER = '#e7e9f2';
// const FONT = "'Poppins', sans-serif";

// // What an admin actually does on a loan platform: work the applications
// // queue, manage the people (borrowers) and products (schemes) behind it,
// // track money movement, and check on how the business is doing overall.
// // Each entry's `match` decides which URLs count as "this section active",
// // so a nested route like /admin/applications/APP-123 still highlights
// // "Applications" rather than showing nothing selected.
// const NAV_ITEMS = [
//   { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, match: (p) => p === '/admin' },
//   { label: 'Applications', path: '/admin/applications', icon: FileText, match: (p) => p.startsWith('/admin/applications'), countKey: 'pending' },
//   { label: 'Borrowers', path: '/admin/borrowers', icon: Users, match: (p) => p.startsWith('/admin/borrowers') },
//   { label: 'Loan Schemes', path: '/admin/schemes', icon: Landmark, match: (p) => p.startsWith('/admin/schemes') },
//   { label: 'Repayments', path: '/admin/repayments', icon: Wallet, match: (p) => p.startsWith('/admin/repayments') },
//   { label: 'Reports', path: '/admin/reports', icon: BarChart3, match: (p) => p.startsWith('/admin/reports') },
//   { label: 'Settings', path: '/admin/settings', icon: Settings, match: (p) => p.startsWith('/admin/settings') },
// ];

// export default function Sidebar({ isOpen, onClose }) {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [pendingCount, setPendingCount] = useState(0);
//   const admin = getSession();

//   // The "Applications" nav item carries a live count of what actually
//   // needs an admin's attention right now — not a decorative badge.
//   // Recomputed whenever a borrower submits a new application.
//   useEffect(() => {
//     const refreshCount = () => {
//       const count = getApplications().filter((a) => a.status === 'Pending').length;
//       setPendingCount(count);
//     };
//     refreshCount();
//     window.addEventListener('applicationschange', refreshCount);
//     return () => window.removeEventListener('applicationschange', refreshCount);
//   }, []);

//   const handleNav = (path) => {
//     navigate(path);
//     onClose();
//   };

//   const handleLogout = () => {
//     logoutUser();
//     navigate('/login');
//     onClose();
//   };

//   const initials = admin?.fullName
//     ? admin.fullName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
//     : 'AD';

//   return (
//     <>
//       <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');`}</style>

//       {/* Backdrop — mobile only, closes the sidebar on outside tap */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 z-30 bg-[#132261]/40 lg:hidden"
//           onClick={onClose}
//           aria-hidden="true"
//         />
//       )}

//       <aside
//         className={`fixed left-0 top-16 bottom-0 z-40 flex w-64 flex-col bg-white transition-all duration-300 ${
//           isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-[72px]'
//         }`}
//         style={{ fontFamily: FONT, borderRight: `1px solid ${BORDER}` }}
//       >
//         {/* Mobile-only close button */}
//         <button
//           onClick={onClose}
//           className="absolute right-3 top-3 rounded-lg p-1.5 lg:hidden"
//           style={{ color: SLATE }}
//           aria-label="Close menu"
//         >
//           <X size={18} />
//         </button>

//         <nav className="flex-1 overflow-y-auto px-3 py-5">
//           <ul className="flex flex-col gap-1">
//             {NAV_ITEMS.map((item) => {
//               const active = item.match(location.pathname);
//               const Icon = item.icon;
//               const badge = item.countKey === 'pending' && pendingCount > 0 ? pendingCount : null;

//               return (
//                 <li key={item.path}>
//                   <button
//                     onClick={() => handleNav(item.path)}
//                     title={!isOpen ? item.label : undefined}
//                     className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition-colors ${
//                       !isOpen ? 'lg:justify-center lg:px-0' : ''
//                     }`}
//                     style={{
//                       color: active ? BLUE : TEXT,
//                       background: active ? BLUE_TINT : 'transparent',
//                     }}
//                     onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#f5f6fb'; }}
//                     onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
//                   >
//                     {active && (
//                       <span
//                         className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full"
//                         style={{ background: BLUE }}
//                       />
//                     )}
//                     <Icon size={18} strokeWidth={2} className="shrink-0" />
//                     <span className={!isOpen ? 'lg:hidden' : ''}>{item.label}</span>

//                     {badge && (
//                       <span
//                         className={`ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[11px] font-bold text-white ${
//                           !isOpen ? 'lg:absolute lg:-right-1 lg:-top-1 lg:ml-0' : ''
//                         }`}
//                         style={{ background: '#e0532c' }}
//                       >
//                         {badge}
//                       </span>
//                     )}
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         {/* Signed-in admin + logout — always reachable, icon-only when collapsed */}
//         <div className="border-t px-3 py-4" style={{ borderColor: BORDER }}>
//           <div className={`flex items-center gap-2.5 rounded-xl px-2 py-2 ${!isOpen ? 'lg:justify-center lg:px-0' : ''}`}>
//             <div
//               className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
//               style={{ background: `linear-gradient(135deg, ${BLUE}, ${NAVY})` }}
//             >
//               {initials}
//             </div>
//             <div className={`min-w-0 flex-1 ${!isOpen ? 'lg:hidden' : ''}`}>
//               <p className="truncate text-[13px] font-semibold" style={{ color: TEXT }}>
//                 {admin?.fullName || 'Admin'}
//               </p>
//               <p className="truncate text-[11px]" style={{ color: SLATE }}>Administrator</p>
//             </div>
//           </div>

//           <button
//             onClick={handleLogout}
//             title={!isOpen ? 'Log out' : undefined}
//             className={`mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-[#fdf0ee] ${
//               !isOpen ? 'lg:justify-center lg:px-0' : ''
//             }`}
//             style={{ color: '#c23b1f' }}
//           >
//             <LogOut size={17} className="shrink-0" />
//             <span className={!isOpen ? 'lg:hidden' : ''}>Log out</span>
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }



import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Users, Landmark, Wallet,
  BarChart3, Settings, LogOut, X,
} from 'lucide-react';
import { getSession, getApplications, logoutUser } from '../../utils/auth';

// Brand tokens — matches Loanschema.jsx / Register.jsx / Myapplications.jsx
// so the admin side reads as the same product, not a bolted-on template.
const NAVY = '#132261';
const BLUE = '#2f76fb';
const BLUE_TINT = '#eaf1fe';
const SLATE = '#757e9e';
const TEXT = '#242938';
const BORDER = '#e7e9f2';
const FONT = "'Poppins', sans-serif";

// What an admin actually does on a loan platform: work the applications
// queue, manage the people (borrowers) and products (schemes) behind it,
// track money movement, and check on how the business is doing overall.
// Each entry's `match` decides which URLs count as "this section active",
// so a nested route like /admin/applications/APP-123 still highlights
// "Applications" rather than showing nothing selected.
const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, match: (p) => p === '/dashboard' },
  { label: 'Applications', path: '/dashboard/applications', icon: FileText, match: (p) => p.startsWith('/dashboard/applications'), countKey: 'pending' },
  { label: 'Borrowers', path: '/dashboard/borrowers', icon: Users, match: (p) => p.startsWith('/dashboard/borrowers') },
  { label: 'Loan Schemes', path: '/dashboard/schemes', icon: Landmark, match: (p) => p.startsWith('/dashboard/schemes') },
  { label: 'Repayments', path: '/dashboard/repayments', icon: Wallet, match: (p) => p.startsWith('/dashboard/repayments') },
  { label: 'Reports', path: '/dashboard/reports', icon: BarChart3, match: (p) => p.startsWith('/dashboard/reports') },
  { label: 'Settings', path: '/dashboard/settings', icon: Settings, match: (p) => p.startsWith('/dashboard/settings') },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);
  const admin = getSession();

  // The "Applications" nav item carries a live count of what actually
  // needs an admin's attention right now — not a decorative badge.
  // Recomputed whenever a borrower submits a new application.
  useEffect(() => {
    const refreshCount = () => {
      const count = getApplications().filter((a) => a.status === 'Pending').length;
      setPendingCount(count);
    };
    refreshCount();
    window.addEventListener('applicationschange', refreshCount);
    return () => window.removeEventListener('applicationschange', refreshCount);
  }, []);

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
    onClose();
  };

  const initials = admin?.fullName
    ? admin.fullName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'AD';

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');`}</style>

      {/* Backdrop — mobile only, closes the sidebar on outside tap */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-[#132261]/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-16 bottom-0 z-40 flex w-64 flex-col bg-white transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-[72px]'
        }`}
        style={{ fontFamily: FONT, borderRight: `1px solid ${BORDER}` }}
      >
        {/* Mobile-only close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1.5 lg:hidden"
          style={{ color: SLATE }}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = item.match(location.pathname);
              const Icon = item.icon;
              const badge = item.countKey === 'pending' && pendingCount > 0 ? pendingCount : null;

              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNav(item.path)}
                    title={!isOpen ? item.label : undefined}
                    className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition-colors ${
                      !isOpen ? 'lg:justify-center lg:px-0' : ''
                    }`}
                    style={{
                      color: active ? BLUE : TEXT,
                      background: active ? BLUE_TINT : 'transparent',
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#f5f6fb'; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {active && (
                      <span
                        className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full"
                        style={{ background: BLUE }}
                      />
                    )}
                    <Icon size={18} strokeWidth={2} className="shrink-0" />
                    <span className={!isOpen ? 'lg:hidden' : ''}>{item.label}</span>

                    {badge && (
                      <span
                        className={`ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[11px] font-bold text-white ${
                          !isOpen ? 'lg:absolute lg:-right-1 lg:-top-1 lg:ml-0' : ''
                        }`}
                        style={{ background: '#e0532c' }}
                      >
                        {badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Signed-in admin + logout — always reachable, icon-only when collapsed */}
        <div className="border-t px-3 py-4" style={{ borderColor: BORDER }}>
          <div className={`flex items-center gap-2.5 rounded-xl px-2 py-2 ${!isOpen ? 'lg:justify-center lg:px-0' : ''}`}>
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${BLUE}, ${NAVY})` }}
            >
              {initials}
            </div>
            <div className={`min-w-0 flex-1 ${!isOpen ? 'lg:hidden' : ''}`}>
              <p className="truncate text-[13px] font-semibold" style={{ color: TEXT }}>
                {admin?.fullName || 'Admin'}
              </p>
              <p className="truncate text-[11px]" style={{ color: SLATE }}>Administrator</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title={!isOpen ? 'Log out' : undefined}
            className={`mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-[#fdf0ee] ${
              !isOpen ? 'lg:justify-center lg:px-0' : ''
            }`}
            style={{ color: '#c23b1f' }}
          >
            <LogOut size={17} className="shrink-0" />
            <span className={!isOpen ? 'lg:hidden' : ''}>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}