import { motion } from "framer-motion";
import Image from "next/image";

interface HeroHeaderProps {
  title: string;
  description: string;
  image?: string; // Optional image prop
}

const HeroHeader = ({ title, description, image }: HeroHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative py-20 px-4 sm:px-6 lg:px-8 ${image ? "" : "bg-[#feee00]"}`}
      style={image ? { minHeight: 320 } : {}}
    >
      {image && (
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-center absolute inset-0 w-full h-full z-0"
          priority
        />
      )}
      {/* Ultra Overlay for readability */}
      {image && (
        <div className="absolute inset-0 z-10 bg-black/80 backdrop-blur-sm" />
      )}
      <div className={`max-w-7xl mx-auto text-center relative z-20 flex flex-col items-center justify-center ${image ? "text-white" : "text-gray-900"}`}>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-2xl tracking-tight">
          {title}
        </h1>
        <p className="text-2xl md:text-3xl font-semibold opacity-95 max-w-2xl mx-auto drop-shadow-xl">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default HeroHeader;
