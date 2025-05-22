import React from 'react';

function AdminFooter() {
  return (
    <footer className="admin-footer">
      <p>&copy; {new Date().getFullYear()} Admin Panel.</p>
    </footer>
  );
}

export default AdminFooter;
