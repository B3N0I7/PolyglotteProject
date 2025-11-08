import React from 'react';
import Header from '../Header';
import Navbar from '../Navbar';
import Footer from '../Footer';
import './MainLayout.css';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="main-layout">
            <Header />
            <Navbar />
            <main className="main-content">
                <div className="main-content-container">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;