import { Settings } from "lucide-react";
import { HTMLAttributes } from "react";
import { cn } from "~/lib/utils";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
} from "motion/react";
import { useSetShowSidebar, useShowSidebar } from "~/stores/bingoStore";

interface SidebarProps extends HTMLAttributes<HTMLButtonElement> { }

const DEFAULT_CIRCLE_SIZE = 60;
const HOVER_CIRCLE_SIZE = 36;
const PRIMARY_COLOR = "#CF9100";
const HOVER_COLOR = "#DFB777";

export default function BingoSettingsSidebarButton({
  className,
}: SidebarProps) {
  const showSidebar = useShowSidebar();
  const setShowSidebar = useSetShowSidebar();

  const iconRotate = useMotionValue(0);
  const iconControls = useAnimation();

  const circleRotate = useMotionValue(0);
  const circleControls = useAnimation();

  const handleHoverStart = () => {
    iconControls.start({
      rotate: [iconRotate.get(), iconRotate.get() + 360],
      scale: 1.15,
      color: HOVER_COLOR,
      transition: {
        rotate: { duration: 10, repeat: Infinity, ease: "linear" },
        scale: { duration: 0.2, ease: "easeOut" },
        color: { duration: 0.2, ease: "easeInOut" },
      },
    });

    circleControls.start({
      rotate: [circleRotate.get(), circleRotate.get() + 360],
      scale: HOVER_CIRCLE_SIZE / DEFAULT_CIRCLE_SIZE,
      borderColor: HOVER_COLOR,
      transition: {
        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
        scale: {
          duration: 0.1,
          ease: "easeOut",
        },
      },
    });
  };

  const handleHoverEnd = () => {
    iconControls.stop();
    iconControls.start({
      scale: 1,
      color: PRIMARY_COLOR,
      transition: {
        scale: { duration: 0.2, ease: "easeOut" },
        color: { duration: 0.2, ease: "easeInOut" },
      },
    });
    circleControls.stop();
    circleControls.start({
      scale: 1,
      borderColor: PRIMARY_COLOR,
      transition: {
        duration: 0.1,
        ease: "easeOut",
      },
    });
  };

  const handleTapStart = () => {
    iconControls.start({
      scale: 0.8,
      color: "#FFFFFF",
      transition: {
        duration: 0.1,
        ease: "easeInOut",
      },
    });

    circleControls.start({
      scale: 0.5,
      borderColor: "#FFFFFF",
      transition: {
        duration: 0.1,
        ease: "easeInOut",
      },
    });
  };

  return (
    <AnimatePresence>
      {!showSidebar && (
        <motion.button
          className={cn(
            "fixed right-0 sm:top-18 top-14 border-2 size-10 rounded-md bg-popover hover:cursor-pointer overflow-hidden z-50 cursor-pointer",
            className
          )}
          onClick={() => setShowSidebar(true)}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          onTapStart={handleTapStart}
        >
          <motion.div
            style={{
              color: PRIMARY_COLOR,
              width: DEFAULT_CIRCLE_SIZE,
              height: DEFAULT_CIRCLE_SIZE,
              rotate: circleRotate,
              willChange: "transform",
              borderStyle: "dashed",
              borderRadius: "calc(infinity * 1px)",
            }}
            animate={circleControls}
            className={`absolute bg-transparent border-2 border-[${HOVER_COLOR}] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-49`}
            initial={{}}
          />
          <motion.div
            className="w-full h-full p-auto cursor-pointer"
            style={{ rotate: iconRotate, color: PRIMARY_COLOR }}
            animate={iconControls}
          >
            <Settings className={`w-full h-full p-1.5 size-7 cursor-pointer`} />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
