import React from 'react';
import './Navbar.css'

function Navbar() {
  const handleSearch = (event) => {
    // Implement search functionality here
    console.log("Searching for:", event.target.value);
  };

  return (
    <div className="navbar">
      <div className="logo">Product Train</div>
      <nav>
        <ul>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search by title..." 
          onChange={handleSearch}
        />
      </div>
    </div>
  );
}

export default Navbar;
