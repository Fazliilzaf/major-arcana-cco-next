import { motion } from "motion/react";

interface AnimatedSignatureLogoProps {
  src: string;
  alt: string;
  className?: string;
}

export function AnimatedSignatureLogo({ src, alt, className }: AnimatedSignatureLogoProps) {
  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: [0, -8, 0],
        opacity: 1
      }}
      transition={{
        y: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        },
        opacity: { 
          duration: 0.4 
        }
      }}
    />
  );
}