"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGameActions } from "@/store/GameProvider";
import { FC, useRef } from "react";
import { useMedia, useToggle } from "react-use";

const AddPlayerDrawer: FC = () => {
  const [open, toggleOpen] = useToggle(false);
  const isDesktop = useMedia("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={toggleOpen}>
        <DialogTrigger asChild>
          <Button>Add player drawer</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Dialog Desc</DialogDescription>
          </DialogHeader>
          <ProfileForm toggleOpen={toggleOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={toggleOpen}>
      <DrawerTrigger asChild>
        <Button>Add player drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add new player</DrawerTitle>
        </DrawerHeader>
        <ProfileForm className="px-4 pb-8" toggleOpen={toggleOpen} />
      </DrawerContent>
    </Drawer>
  );
};

const ProfileForm: FC<{ className?: string; toggleOpen: () => void }> = ({
  className,
  toggleOpen,
}) => {
  const newPlayerInputRef = useRef<HTMLInputElement>(null);
  const addPlayer = useGameActions().addPlayer;
  return (
    <form
      className={cn("flex flex-col justify-start items-start gap-4", className)}
    >
      <Input
        placeholder="Player name"
        className="text-base"
        ref={newPlayerInputRef}
        autoFocus
      />
      <Button
        type="button"
        className="self-end"
        onClick={() =>
          // TODO: add validation
          {
            newPlayerInputRef.current &&
              addPlayer(newPlayerInputRef.current.value);
            toggleOpen();
          }
        }
      >
        Add
      </Button>
    </form>
  );
};

export default AddPlayerDrawer;
