import React from 'react';
import { Outlet} from 'react-router-dom';
import { Footer } from './Footer';
import { Navbar } from './Navigation';


const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white font-sans">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;