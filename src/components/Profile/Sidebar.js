import React, { useState, useEffect } from "react";
import "../../App.css";
import { FaUser, FaListAlt, FaSignOutAlt, FaTimes, FaBars } from "react-icons/fa";


const Sidebar = ({ onButtonClick }) => {
 
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const sidebarClasses = `transition duration-500 dark:text-white sidebar fixed left-0 top-0 h-screen w-60 text-black transform transition-transform ${
    isSidebarVisible ? "translate-x-0 transition-transform duration-300 ease-in" : "-translate-x-full transition-transform duration-300 ease-out"
  }`;
  useEffect(() => {
  
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setSidebarVisible(screenWidth >= 640);
    };

    handleResize(); 

    
    window.addEventListener("resize", handleResize);

  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("userJWTToken");
    window.location.href = "/";
  };
 
  return (
    <>
      <div className="z-10">
      <FaBars onClick={toggleSidebar} className='mx-4 my-7 text-3xl absolute cursor-pointer sm:hidden block'/>
      <div className={sidebarClasses} >
        <div className='buttons p-4 mt-36  '>
          <FaTimes className='absolute top-4 right-4 text-3xl cursor-pointer sm:hidden block' onClick={toggleSidebar}/>
          <button className='flex items-center mb-8' onClick={() => onButtonClick("profile")}>
            <FaUser className='mr-2 ' />
            Profile
          </button>
          <button className='flex items-center mb-8' onClick={() => onButtonClick("predefinedTransactions")}>
            <FaListAlt className='mr-2' />
            Predefined Transactions
          </button>
          <button className='flex items-center mb-8' onClick={handleLogOut}>
            <FaSignOutAlt className='mr-2' />
            Logout
          </button>
        </div>
      </div>
      </div>
    </>
  );
};

export default Sidebar;
