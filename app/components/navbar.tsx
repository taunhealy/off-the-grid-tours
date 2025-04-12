"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-semibold text-lg">Moto Tours</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/tours" className="text-gray-700 hover:text-gray-900">
              Tours
            </Link>
            <Link
              href="/motorcycles"
              className="text-gray-700 hover:text-gray-900"
            >
              Motorcycles
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900">
              Contact
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-gray-900"
            >
              Dashboard
            </Link>
          </div>

          {/* Sign In Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Link
                href="/auth/signin"
                className="w-full h-full flex items-center justify-center"
              >
                Sign In
              </Link>
            </Button>
            <Button variant="default" size="sm">
              <Link
                href="/auth/signin"
                className="w-full h-full flex items-center justify-center"
              >
                Sign Up
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              href="/tours"
              className="block text-gray-700 hover:text-gray-900 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Tours
            </Link>
            <Link
              href="/motorcycles"
              className="block text-gray-700 hover:text-gray-900 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Motorcycles
            </Link>
            <Link
              href="/about"
              className="block text-gray-700 hover:text-gray-900 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="block text-gray-700 hover:text-gray-900 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/dashboard"
              className="block text-gray-700 hover:text-gray-900 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <div className="flex space-x-4 pt-2">
              <Button variant="outline" size="sm">
                <Link
                  href="/auth/signin"
                  className="w-full h-full flex items-center justify-center"
                >
                  Sign In
                </Link>
              </Button>
              <Button variant="default" size="sm">
                <Link
                  href="/auth/signin"
                  className="w-full h-full flex items-center justify-center"
                >
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
