"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// A floating tablet that carries a live demo on its screen.
// Framer Motion springs handle the 3D tilt; a slow loop keeps it breathing.
// On touch devices both are off — the demo itself is the show.
export default function DeviceFrame({ children }: { children: ReactNode }) {
  const [motionOn, setMotionOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(
      () =>
        setMotionOn(
          window.matchMedia("(pointer: fine)").matches &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        ),
      0,
    );
    return () => clearTimeout(t);
  }, []);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 140, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 140, damping: 18 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      className="device-float"
      animate={motionOn ? { y: [0, -12, 0] } : undefined}
      transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut" }}
    >
      <motion.div
        className="device"
        style={{ rotateX, rotateY, transformPerspective: 1100 }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <span className="device-cam" aria-hidden="true" />
        <div className="device-screen">{children}</div>
      </motion.div>
    </motion.div>
  );
}
