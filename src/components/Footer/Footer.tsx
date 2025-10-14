import Image from "next/image";
import logo from '@/assets/logo1.svg'
export const Footer = () => {
  return (
    <div className="bg-black text-white shadow-md w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Image src={logo} alt="Texnoprom" className="h-20 w-auto" />{" "}
         
        </div>
      </div>
    </div>
  );
};
