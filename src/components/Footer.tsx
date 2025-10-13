'use client';

import React from 'react';
import Image from 'next/image';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="w-full bg-orizon-primary py-4 flex items-center justify-center">
      {/* Orizon Icon */}
      <button 
        onClick={scrollToTop}
        className="flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
        aria-label="Scroll to top"
      >
        <Image
          src="/Icon.png"
          alt="Orizon Logo"
          width={50}
          height={50}
          className="object-contain"
        />
      </button>
    </footer>
  );
};

export default Footer;
