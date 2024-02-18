"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { faDev } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useEffect } from "react";
import { useLocalStorage, useToggle } from "react-use";

const DisclaimerModal: FC = () => {
  const [isOpen, toggleOpen] = useToggle(false);
  const [hasSeenDisclaimer, setHasSeenDisclaimer] = useLocalStorage(
    "hasSeenDisclaimer",
    false
  );

  useEffect(() => {
    if (!hasSeenDisclaimer) {
      toggleOpen(true);
      setHasSeenDisclaimer(true);
    }
  }, [isOpen, toggleOpen, hasSeenDisclaimer, setHasSeenDisclaimer]);

  return (
    <AlertDialog open={isOpen} onOpenChange={toggleOpen}>
      <AlertDialogContent className="w-4/5">
        <AlertDialogHeader>
          <AlertDialogTitle>Quick Note📝</AlertDialogTitle>
          <AlertDialogDescription>
            This application is currently under development👩‍💻, and may contain
            bugs. If you find any, please report them through the top right
            <FontAwesomeIcon
              icon={faDev}
              size="xl"
              className="text-amber-600 px-1"
            />
            button
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Understood!</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DisclaimerModal;
