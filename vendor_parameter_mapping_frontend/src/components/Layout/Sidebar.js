import React from 'react';
import { NavLink } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Sidebar() {
  /** Sidebar navigation links */
  return (
    <aside className="sidebar">
      <nav className="nav" aria-label="Primary">
        <NavLink to="/vendors" className={({ isActive }) => isActive ? 'active' : undefined}>
          Vendors
        </NavLink>
        <NavLink to="/audit" className={({ isActive }) => isActive ? 'active' : undefined}>
          Audit Log
        </NavLink>
      </nav>
    </aside>
  );
}
