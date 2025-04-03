import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="bg-sidebar flex w-full flex-col items-center justify-around gap-3 border-t border-neutral-200 px-2 py-12 md:px-8">
      <div className="flex w-full flex-row items-center justify-between px-4 md:px-8">
        <Image
          src={"/images/triptales_full.png"}
          width={400}
          height={400}
          className="h-auto w-[125px] md:w-[200px]"
          alt="TripTales Logo"
        />
        <div></div>
      </div>
      <div className="flex w-full flex-row items-center justify-between border-t border-t-neutral-400/60 pt-3">
        <p className="text-left text-xs md:text-sm">
          &copy; 2025 TripTales. All rights reserved.
        </p>
        <p className="text-right text-xs md:text-sm">
          Made with ❤️ by the TripTales Team
        </p>
      </div>
    </footer>
  );
};

export default Footer;
