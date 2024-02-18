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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faDev } from "@fortawesome/free-brands-svg-icons";
import { FC } from "react";

const ReportIssueBanner: FC = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className="absolute top-0 right-0 overflow-clip size-14"
        onClick={vibrate}
        asChild
      >
        <div className="pl-3.5">
          <div
            className="rotate-[135deg] -mt-12 -mr-4 w-0 h-0 
  border-t-[50px] border-t-transparent
  border-r-[50px] border-r-orange-500
  border-b-[50px] border-b-transparent"
          ></div>
          <FontAwesomeIcon
            icon={faDev}
            className="absolute text-black/95 top-0 right-0 size-7"
          />
        </div>
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
