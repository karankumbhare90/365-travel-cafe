import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

import {
  RiAdminLine,
  RiGalleryLine,
} from 'react-icons/ri';

import {
  MdContacts,
  MdMarkEmailUnread,
  MdMenuBook,
} from 'react-icons/md';

import { HiOutlineCalendarDays } from 'react-icons/hi2';
import { IoLogOutOutline, IoMenu } from 'react-icons/io5';
import { IoClose } from 'react-icons/io5';
import { LuMessageSquareQuote } from 'react-icons/lu';

const AdminLayout: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // sidebar toggle state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {

    supabase.auth.getSession().then(({ data: { session } }) => {

      setSession(session);
      setLoading(false);

      if (!session) navigate('/admin/login');

    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {

      setSession(session);

      if (!session) navigate('/admin/login');

    });

    return () => subscription.unsubscribe();

  }, [navigate]);

  const handleLogout = async () => {

    await supabase.auth.signOut();
    navigate('/admin/login');

  };

  // close sidebar on navigation (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary">
        Loading...
      </div>
    );
  }

  if (!session) return null;

  const isActive = (path: string) =>
    location.pathname === path
      ? 'bg-primary text-background-dark font-bold'
      : 'text-gray-400 hover:bg-white/5 hover:text-white';

  return (

    <div className="w-full flex h-screen bg-background-dark text-white">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:relative z-50
          h-full w-64 bg-surface-darker border-r border-white/5
          flex flex-col transition-transform duration-300

          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >

        {/* HEADER */}
        <div className="p-6 flex items-center justify-between border-b border-white/5">

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-background-dark font-bold">
              A
            </div>
            <span className="font-bold">Admin Panel</span>
          </div>

          {/* CLOSE BUTTON MOBILE */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <IoClose size={22} />
          </button>

        </div>

        {/* NAV */}
        <nav className="flex-1 p-4 space-y-2">

          <Link
            to="/admin/reservations"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin/reservations')}`}
          >
            <RiAdminLine size={18} />
            Reservations
          </Link>

          <Link
            to="/admin/menu"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin/menu')}`}
          >
            <MdMenuBook size={18} />
            Menu Manager
          </Link>

          <Link
            to="/admin/events"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin/events')}`}
          >
            <HiOutlineCalendarDays size={18} />
            Events
          </Link>

          <Link
            to="/admin/newsletter"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin/newsletter')}`}
          >
            <MdMarkEmailUnread size={18} />
            Newsletter
          </Link>

          <Link
            to="/admin/contacts"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin/contacts')}`}
          >
            <MdContacts size={18} />
            Contacts
          </Link>
          <Link
            to="/admin/gallery"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin/gallery')}`}
          >
            <RiGalleryLine size={18} />
            Gallery
          </Link>
          <Link
            to="/admin/testimonial"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin/testimonial')}`}
          >
            <LuMessageSquareQuote size={18} />
            Testimonial
          </Link>

        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-white/5">

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300"
          >
            <IoLogOutOutline size={18} />
            Sign Out
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <div className="w-full flex-1 flex flex-col">

        {/* TOP BAR MOBILE */}
        <header className="lg:hidden flex items-center p-4 border-b border-white/5">

          <button
            onClick={() => setSidebarOpen(true)}
          >
            <IoMenu size={22} />
          </button>

          <span className="ml-4 font-bold">
            Admin Panel
          </span>

        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );

};

export default AdminLayout;