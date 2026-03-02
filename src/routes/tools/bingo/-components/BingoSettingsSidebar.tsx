import { useSetShowSidebar, useShowSidebar } from "~/stores/bingoStore";
import { createPortal } from "react-dom";
import { Fragment } from "react/jsx-runtime";
import { AnimatePresence, motion } from "motion/react";
import BingoSettingsSidebarContents from "./BingoSettingsSidebarContents";
import { useIsMounted } from "~/hooks/useIsMounted";

export default function BingoSettingsSidebar() {
  const isMounted = useIsMounted();
  const showSidebar = useShowSidebar();
  const setShowSidebar = useSetShowSidebar();

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {showSidebar && (
        <Fragment>
          <motion.div
            id="bingo-settings-backdrop"
            className="fixed inset-0 z-999 bg-black/60"
            onClick={() => setShowSidebar(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            id="bingo-settings-sidebar"
            className="fixed h-[100dvh] right-0 bg-neutral-900/95 shadow sm:w-md w-64 z-1000"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <BingoSettingsSidebarContents />
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>,
    document.body,
  );
}
