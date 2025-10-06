import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import './App.css';
import Vendors from './pages/Vendors';
import Mappings from './pages/Mappings';
import AuditLog from './pages/AuditLog';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';

// PUBLIC_INTERFACE
function App() {
  /** Root application with router and layout. Routes:
   *  - /vendors
   *  - /vendors/:vendorId/mappings
   *  - /audit
   */
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <Sidebar />
        <main className="main">
          <div className="card section">
            <div className="page-title">Vendor Parameter Mapping</div>
            <div className="helper">Ocean Professional UI • Standardize vendor parameters with confidence.</div>
          </div>
          <div className="card">
            <Routes>
              <Route path="/" element={<Navigate to="/vendors" replace />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/vendors/:vendorId/mappings" element={<Mappings />} />
              <Route path="/audit" element={<AuditLog />} />
              <Route path="*" element={
                <div className="section">
                  <h3>Not found</h3>
                  <p>Try navigating:</p>
                  <div className="nav" style={{flexDirection: 'row'}}>
                    <NavLink to="/vendors" className="btn">Vendors</NavLink>
                    <NavLink to="/audit" className="btn ghost">Audit</NavLink>
                  </div>
                </div>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
