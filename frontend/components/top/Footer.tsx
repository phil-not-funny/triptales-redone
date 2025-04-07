import React from "react";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-gray-100 bg-gray-50 px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Top Section */}
        <div className="flex flex-col items-center justify-between gap-8 border-b border-gray-100 pb-8 md:flex-row">
          <div className="flex items-center gap-4">
            <Image
              src={"/images/triptales_full.png"}
              width={400}
              height={400}
              className="h-auto w-[125px] transition-transform duration-300 hover:scale-105 md:w-[200px]"
              alt="TripTales Logo"
            />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-600">TripTales</p>
              <p className="text-xs text-gray-500">Explore. Share. Connect.</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <a
              href="#"
              className="hover:text-primary-hover text-sm text-gray-600 transition-colors duration-200"
            >
              About
            </a>
            <a
              href="#"
              className="hover:text-primary-hover text-sm text-gray-600 transition-colors duration-200"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-primary-hover text-sm text-gray-600 transition-colors duration-200"
            >
              Terms
            </a>
            <a
              href="#"
              className="hover:text-primary-hover text-sm text-gray-600 transition-colors duration-200"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-gray-600 md:text-sm">
            &copy; 2025 TripTales. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <p className="text-xs text-gray-600 md:text-sm">
              Made with
              <span className="text-primary-hover mx-1 animate-pulse">❤️</span>
              by the TripTales Team
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              <a
                href="#"
                className="hover:text-primary-hover text-gray-500 transition-colors duration-200"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-primary-hover text-gray-500 transition-colors duration-200"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
