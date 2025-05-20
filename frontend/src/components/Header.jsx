import React, { useState } from 'react';
import { Globe, Menu, X, MapPin, BookOpen, Users, Bell, Search } from 'lucide-react';

const AbroadAppHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <header className="w-full bg-gradient-to-r from-[#0E0E34] to-[#252E8A] text-[#F7F6F7] shadow-lg">
      {/* Top navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <Globe className="h-8 w-8 text-[#5A7FC8]" />
                <span className="ml-2 text-xl font-bold">EduJourney</span>
              </div>
            </div>
          </div>



          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button onClick={toggleMenu} className="p-2 rounded-md text-[#F7F6F7] hover:bg-[#5A7FC8]/20 transition duration-150">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      

      {/* Mobile navigation menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0E0E34] border-t border-[#5A7FC8]/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#destinations" className="flex items-center text-[#F7F6F7] hover:bg-[#5A7FC8]/20 block px-3 py-2 rounded-md text-base font-medium">
              <MapPin className="mr-2 h-5 w-5" />
              Destinations
            </a>
            <a href="#courses" className="flex items-center text-[#F7F6F7] hover:bg-[#5A7FC8]/20 block px-3 py-2 rounded-md text-base font-medium">
              <BookOpen className="mr-2 h-5 w-5" />
              Courses
            </a>
            <a href="#community" className="flex items-center text-[#F7F6F7] hover:bg-[#5A7FC8]/20 block px-3 py-2 rounded-md text-base font-medium">
              <Users className="mr-2 h-5 w-5" />
              Community
            </a>
          </div>
          <div className="pt-4 pb-3 border-t border-[#5A7FC8]/20">
            <div className="flex items-center justify-between px-5">
              <button className="p-2 rounded-full text-[#F7F6F7] hover:bg-[#5A7FC8]/20">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full text-[#F7F6F7] hover:bg-[#5A7FC8]/20">
                <Bell className="h-5 w-5" />
              </button>
              <button className="w-full ml-4 px-4 py-2 rounded-md bg-[#9A4D87] text-white hover:bg-[#9A4D87]/80 font-medium">
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Optional: Hero banner section below header */}
      
    </header>
  );
};

export default AbroadAppHeader;