"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, ShoppingCart, User, LogIn } from "lucide-react";
import logo from '@/assets/logo.png'
import { useQuery } from "@tanstack/react-query";
import { getBanners } from "@/app/server/banners";
const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
  };

  const query = useQuery({ queryKey : ["banners"], queryFn: getBanners});
console.log(query);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Image src={logo} alt="Texnoprom" className="h-20 w-auto" />
            <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-700">
              Каталог
            </button>
          </div>

          <form
            onSubmit={handleSearch}
            className="w-full md:w-auto md:flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Поиск товаров"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 md:block hidden md:flex"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <button type="submit" className="hidden">
                Search
              </button>{" "}
            </div>
          </form>

          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-red-600"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                0
              </span>
            </Link>
            <Link
              href="/profile"
              className="p-2 text-gray-600 hover:text-red-600"
            >
              <User size={20} />
            </Link>
            <Link
              href="/login"
              className="p-2 text-gray-600 hover:text-red-600"
            >
              <LogIn size={20} />
            </Link>
          </div>
        </div>

        <div className="hidden md:flex justify-center space-x-8 py-2 border-t border-gray-100">
          {query.data?.map((banner: any) => (
            <Link
              key={banner.id}
              href={banner.link}
              className="text-gray-600 hover:text-red-600"
            >
              {banner.title}
            </Link>
          ))}
        </div>

        <div className="md:hidden py-2">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 hover:text-red-600"
          >
            ☰
          </button>
          {isMenuOpen && (
            <div className="absolute top-16 left-0 w-full bg-white shadow-md">
              <Link
                href="/cart"
                className="block p-2 text-gray-600 hover:text-red-600"
              >
                Корзина
              </Link>
              <Link
                href="/profile"
                className="block p-2 text-gray-600 hover:text-red-600"
              >
                Профиль
              </Link>
              <Link
                href="/login"
                className="block p-2 text-gray-600 hover:text-red-600"
              >
                Вход
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
