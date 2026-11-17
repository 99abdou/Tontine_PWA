import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Coins,
  Users,
  CalendarDays,
  History,
  Bell,
  FileSpreadsheet,
  Settings,
  LogOut,
  Menu,
  X,
  CreditCard,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { Avatar } from '../ui/StatCard';
import clsx from 'clsx';
import { UserRole } from '../../types';
import { toast } from '../../stores/toastStore';

interface AppLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, role, switchRole, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  // Navigation items based on active role
  const organizerNav: NavItem[] = [
    { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Mes Tontines', href: '/tontines', icon: Coins },
    { name: 'Participantes', href: '/members', icon: Users },
    { name: 'Cotisations', href: '/contributions', icon: CreditCard },
    { name: 'Bénéficiaires & Tours', href: '/payouts', icon: CalendarDays },
    { name: 'Transactions', href: '/transactions', icon: History },
    { name: 'Notifications WhatsApp', href: '/notifications', icon: Bell, badge: 2 },
    { name: 'Rapports & Exports', href: '/reports', icon: FileSpreadsheet },
    { name: 'Paramètres', href: '/settings', icon: Settings },
  ];

  const participantNav: NavItem[] = [
    { name: 'Mon Espace', href: '/participant', icon: LayoutDashboard },
    { name: 'Mes Tontines', href: '/tontines', icon: Coins },
    { name: 'Mes Cotisations', href: '/contributions', icon: CreditCard },
    { name: 'Mon Calendrier', href: '/payouts', icon: CalendarDays },
    { name: 'Notifications', href: '/notifications', icon: Bell },
  ];

  const adminNav: NavItem[] = [
    { name: 'Plateforme Admin', href: '/admin', icon: ShieldCheck },
    { name: 'Toutes les Tontines', href: '/tontines', icon: Coins },
    { name: 'Utilisateurs', href: '/members', icon: Users },
    { name: 'Logs & Sécurité', href: '/transactions', icon: History },
  ];

  const navItems = role === 'organizer' ? organizerNav : role === 'participant' ? participantNav : adminNav;

  const handleRoleChange = (newRole: UserRole) => {
    switchRole(newRole);
    setRoleMenuOpen(false);
    const roleLabels = {
      organizer: 'Organisatrice (Fatou Sow)',
      participant: 'Participante (Aïssatou Diallo)',
      admin: 'Admin Général (Moussa Faye)',
    };
    toast.info('Mode démo basculé', `Vous êtes maintenant en vue ${roleLabels[newRole]}`);
    if (newRole === 'participant') {
      navigate('/participant');
    } else if (newRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-900 to-primary-700 flex items-center justify-center text-white font-black shadow-md shadow-primary-900/20">
                  <Coins className="w-5 h-5 text-amber-300" />
                </div>
                <div className="leading-tight">
                  <span className="text-lg font-black tracking-tight text-primary-950 block">TONTINE<span className="text-amber-600">PRO</span></span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-primary-700 block">Sénégal & Afrique</span>
                </div>
              </Link>
            </div>

            {/* Middle: Interactive Role Tester Pills */}
            <div className="hidden lg:flex items-center gap-1.5 bg-gray-100/80 p-1 rounded-xl border border-gray-200/60">
              <span className="text-[11px] font-bold text-gray-500 uppercase px-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Rôle démo :
              </span>
              <button
                onClick={() => handleRoleChange('organizer')}
                className={clsx(
                  'px-3 py-1 rounded-lg text-xs font-semibold transition-all',
                  role === 'organizer'
                    ? 'bg-primary-800 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                )}
              >
                Organisatrice
              </button>
              <button
                onClick={() => handleRoleChange('participant')}
                className={clsx(
                  'px-3 py-1 rounded-lg text-xs font-semibold transition-all',
                  role === 'participant'
                    ? 'bg-primary-800 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                )}
              >
                Participante
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={clsx(
                  'px-3 py-1 rounded-lg text-xs font-semibold transition-all',
                  role === 'admin'
                    ? 'bg-primary-800 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                )}
              >
                Admin
              </button>
            </div>

            {/* Right: Quick actions + User menu */}
            <div className="flex items-center gap-3">
              <Link
                to="/notifications"
                className="relative p-2 rounded-xl text-gray-500 hover:text-primary-800 hover:bg-primary-50 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </Link>

              {/* Profile button */}
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Avatar
                    src={user?.avatar}
                    name={user ? `${user.first_name} ${user.last_name}` : 'Utilisateur'}
                    size="sm"
                  />
                  <div className="hidden sm:block text-left text-xs leading-none">
                    <p className="font-bold text-gray-800">{user?.first_name} {user?.last_name}</p>
                    <p className="text-gray-500 text-[10px] capitalize mt-0.5">{role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
                </button>

                {roleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900">{user?.first_name} {user?.last_name}</p>
                      <p className="text-[11px] text-gray-500">{user?.phone}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-100 text-primary-800 uppercase">
                        {role}
                      </span>
                    </div>

                    <div className="px-2 py-1.5">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">
                        Changer de rôle (Test)
                      </p>
                      <button
                        onClick={() => handleRoleChange('organizer')}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>Organisatrice</span>
                        {role === 'organizer' && <CheckCircle2 className="w-3.5 h-3.5 text-primary-700" />}
                      </button>
                      <button
                        onClick={() => handleRoleChange('participant')}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>Participante</span>
                        {role === 'participant' && <CheckCircle2 className="w-3.5 h-3.5 text-primary-700" />}
                      </button>
                      <button
                        onClick={() => handleRoleChange('admin')}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>Admin Général</span>
                        {role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-primary-700" />}
                      </button>
                    </div>

                    <div className="border-t border-gray-100 pt-1 px-2">
                      <button
                        onClick={() => {
                          logout();
                          toast.warning('Déconnexion', 'Vous avez été déconnecté');
                          navigate('/login');
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 shrink-0">
          <div className="sticky top-24 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={clsx(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150',
                    isActive
                      ? 'bg-primary-800 text-white shadow-xs shadow-primary-900/10'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={clsx('w-4 h-4', isActive ? 'text-amber-300' : 'text-gray-400')} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={clsx(
                        'text-xs px-2 py-0.5 rounded-full font-bold',
                        isActive ? 'bg-amber-400 text-primary-950' : 'bg-primary-100 text-primary-800'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Senegal PWA Badge Card */}
            <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-primary-950 to-primary-900 text-white relative overflow-hidden">
              <div className="relative z-10">
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-primary-950 uppercase mb-2">
                  PWA Mobile Ready
                </span>
                <p className="text-xs font-bold text-black">Prêt pour Wave & Orange Money</p>
                <p className="text-[11px] text-primary-900 mt-1">
                  Installation rapide sur l'écran d'accueil sans passer par le store.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Slide-over Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-72 bg-white h-full p-5 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-800 flex items-center justify-center text-white font-bold">
                      <Coins className="w-4 h-4 text-amber-300" />
                    </div>
                    <span className="font-bold text-gray-900">TONTINE PRO</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg text-gray-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={clsx(
                          'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold',
                          isActive ? 'bg-primary-800 text-white' : 'text-gray-600 hover:bg-gray-100'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-400 text-primary-950">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <button
                  onClick={() => {
                    logout();
                    toast.warning('Déconnexion', 'Vous avez été déconnecté');
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 font-semibold"
                >
                  <LogOut className="w-4 h-4" /> Se déconnecter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0 pb-16 md:pb-6">{children}</main>
      </div>

      {/* Mobile Bottom Navigation Bar (PWA standard) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 px-2 py-1.5 flex justify-around items-center">
        <Link
          to={role === 'participant' ? '/participant' : '/dashboard'}
          className={clsx(
            'flex flex-col items-center py-1 px-3 text-[10px] font-semibold',
            location.pathname === '/dashboard' || location.pathname === '/participant'
              ? 'text-primary-800 font-bold'
              : 'text-gray-500'
          )}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Accueil</span>
        </Link>
        <Link
          to="/tontines"
          className={clsx(
            'flex flex-col items-center py-1 px-3 text-[10px] font-semibold',
            location.pathname.startsWith('/tontines') ? 'text-primary-800 font-bold' : 'text-gray-500'
          )}
        >
          <Coins className="w-5 h-5 mb-0.5" />
          <span>Tontines</span>
        </Link>
        <Link
          to="/contributions"
          className={clsx(
            'flex flex-col items-center py-1 px-3 text-[10px] font-semibold',
            location.pathname === '/contributions' ? 'text-primary-800 font-bold' : 'text-gray-500'
          )}
        >
          <CreditCard className="w-5 h-5 mb-0.5" />
          <span>Cotisations</span>
        </Link>
        <Link
          to="/payouts"
          className={clsx(
            'flex flex-col items-center py-1 px-3 text-[10px] font-semibold',
            location.pathname === '/payouts' ? 'text-primary-800 font-bold' : 'text-gray-500'
          )}
        >
          <CalendarDays className="w-5 h-5 mb-0.5" />
          <span>Tours</span>
        </Link>
        <Link
          to="/notifications"
          className={clsx(
            'flex flex-col items-center py-1 px-3 text-[10px] font-semibold relative',
            location.pathname === '/notifications' ? 'text-primary-800 font-bold' : 'text-gray-500'
          )}
        >
          <Bell className="w-5 h-5 mb-0.5" />
          <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-rose-500" />
          <span>Alertes</span>
        </Link>
      </nav>
    </div>
  );
};
