import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

export const BorderBeam = ({
  className,
  size = 50,
  duration = 6,
  delay = 0,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  borderWidth = 1.5,
  ...props
}) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] border-[1px] border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]",
        className
      )}
      {...props}
    >
      <motion.div
        className={cn(
          "absolute aspect-square bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent"
        )}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round calc(var(--radius) - 0px))`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
        }}
        initial={{ offsetDistance: "0%" }}
        animate={{
          offsetDistance: "100%",
        }}
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
          delay,
        }}
      />
    </div>
  );
};
