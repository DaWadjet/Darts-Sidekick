"use client";
import { vibrate } from "@/app/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { faDev } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";

const ReportIssueBanner: FC = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className="absolute top-1 right-1 overflow-clip size-10"
        onClick={vibrate}
        asChild
      >
        <FontAwesomeIcon icon={faDev} className="text-amber-600" />
      </AlertDialogTrigger>
      <AlertDialogContent className="w-4/5">
        <AlertDialogHeader>
          <AlertDialogTitle>Found a bug? 🐜</AlertDialogTitle>
          <AlertDialogDescription>
            Please open a new issue on GitHub and describe the bug in as much
            detail as possible. Try to include reproduction steps and
            screenshots to speed up the process! 🚀
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="button"
            onClick={() =>
              window.open(
                "https://github.com/DaWadjet/Darts-Sidekick/issues/new",
                "_blank"
              )
            }
          >
            Create Issue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReportIssueBanner;
