'use client';

import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="w-full bg-orizon-primary py-4 flex items-center justify-center">
      {/* Orizon Icon */}
      <div className="flex items-center justify-center">
        <Image
          src="/icon.png"
          alt="Orizon Logo"
          width={50}
          height={50}
          className="object-contain"
        />
      </div>
    </footer>
  );
};

export default Footer;
