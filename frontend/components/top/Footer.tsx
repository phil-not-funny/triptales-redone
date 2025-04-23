import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="z-10 w-full border-t border-gray-100 bg-gray-50 px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Top Section */}
        <div className="flex flex-col items-center justify-between gap-8 border-b border-gray-100 pb-8 md:flex-row md:px-4">
          <div className="flex items-center gap-4">
            <Image
              src={"/images/triptales_full.png"}
              width={400}
              height={400}
              className="h-auto w-[125px] transition-transform duration-300 hover:scale-105 md:w-[200px]"
              alt="TripTales Logo"
              priority
            />
          </div>

          {/* Navigation Links */}
          <div className="flex flex-row flex-wrap justify-center gap-6 text-right md:flex-col md:gap-8">
            <Link
              href="#"
              className="hover:text-primary-hover text-sm text-gray-600 transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="#"
              className="hover:text-primary-hover text-sm text-gray-600 transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="hover:text-primary-hover text-sm text-gray-600 transition-colors duration-200"
            >
              Terms and Conditions
            </Link>
            <Link
              href="#"
              className="hover:text-primary-hover text-sm text-gray-600 transition-colors duration-200"
            >
              Contact
            </Link>
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
              <Link
                href="https://github.com/phil-not-funny/triptales-redone"
                target="_blank"
                className="hover:text-primary-hover text-gray-500 transition-colors duration-200"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.475 2 2 6.475 2 12c0 4.42 2.865 8.164 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.833.092-.647.35-1.088.636-1.338-2.22-.252-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.525-4.475-10-10-10z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <p className="text-gray-600 italic text-sm">
          Homepage Picture by{" "}
          <Link
            target="_blank"
            className="underline"
            href="https://unsplash.com/de/@neom?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
          >
            NEOM
          </Link>{" "}
          on{" "}
          <Link
            target="_blank"
            className="underline"
            href="https://unsplash.com/de/fotos/eine-person-die-auf-einem-felsigen-hugel-steht-gOqBe7ropxM?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
          >
            Unsplash
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
