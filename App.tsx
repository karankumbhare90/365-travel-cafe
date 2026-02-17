import React from 'react';
import { Routes, Route, useLocation, BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Story from './pages/Story';
import Menu from './pages/Menu';
import Events from './pages/Events';
import Contact from './pages/Contact';
import Reservation from './pages/Reservation';

// Admin Imports
import AdminLayout from './pages/admin/AdminLayout';
import Login from './pages/admin/Login';
import ManageMenu from './pages/admin/ManageMenu';
import ManageReservations from './pages/admin/ManageReservations';
import ManageNewsletter from './pages/admin/ManageReservations';
import ManageContact from './pages/admin/ManageContacts';
import ManageGallery from './pages/admin/ManageGallery';
import ManageTestimonials from './pages/admin/ManageTestimonial';
import ManagePlans from './pages/admin/ManagePlans';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="story" element={<Story />} />
          <Route path="menu" element={<Menu />} />
          <Route path="events" element={<Events />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        <Route path="/reserve" element={<Reservation />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<ManageReservations />} /> {/* Default to reservations */}
          <Route path="reservations" element={<ManageReservations />} />
          <Route path="menu" element={<ManageMenu />} />
          <Route path="newsletter" element={<ManageNewsletter />} />
          <Route path="contacts" element={<ManageContact />} />
          <Route path="gallery" element={<ManageGallery />} />
          <Route path="testimonial" element={<ManageTestimonials />} />
          <Route path="events" element={<ManagePlans />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;