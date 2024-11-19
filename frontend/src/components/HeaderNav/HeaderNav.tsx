import React from 'react';
import logo from '../../assets/Logo.png';

const HeaderNav: React.FC = () => {
  return (
    <nav className="flex items-center justify-between px-4 py-6 bg-primaryColour">
      <div className="bg-primaryColour">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-14" />
        </div>
      </div>
    </nav>
  );
};

export default HeaderNav;
