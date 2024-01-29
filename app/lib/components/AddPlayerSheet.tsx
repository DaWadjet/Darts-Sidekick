"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGameActions } from "@/store/GameProvider";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { useMedia, useToggle } from "react-use";

const AddPlayerSheet: FC = () => {
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<{ nickname: string }>({
    resolver: (data) => {
      if (!data.nickname?.trim()) {
        return {
          values: {},
          errors: {
            nickname: {
              type: "required",
              message: "Player name is required",
            },
          },
        };
      }
      if (data.nickname.length > 16) {
        return {
          values: {},
          errors: {
            nickname: {
              type: "maxLength",
              message: "Player name is too long",
            },
          },
        };
      }
      return {
        values: data,
        errors: {},
      };
    },
  });
  const addPlayer = useGameActions().addPlayer;

  const [open, toggleOpen] = useToggle(false);
  const isDesktop = useMedia("(min-width: 768px)", true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={toggleOpen}>
        <DialogTrigger asChild>
          <Button>Add player</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] flex flex-col justify-start items-start px-6 pb-8 gap-4">
          <DialogHeader>
            <DialogTitle>Add new Player</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Player name"
            className="w-full"
            {...register("nickname")}
            autoFocus
          />
          <DialogFooter className="flex items-start justify-between w-full">
            {!!errors.nickname ? (
              <span className="text-red-600 text-base leading-none">
                {errors.nickname.message}
              </span>
            ) : (
              <div />
            )}
            <DialogClose asChild>
              <Button
                className="self-end"
                onClick={handleSubmit((data) => {
                  addPlayer(data.nickname);
                  toggleOpen(false);
                  resetField("nickname");
                })}
              >
                Add
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={toggleOpen}>
      <SheetTrigger asChild>
        <Button onClick={toggleOpen}>Add player</Button>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="flex flex-col gap-5  rounded-b-md shadow-md"
      >
        <SheetHeader>
          <SheetTitle>Add new player</SheetTitle>
        </SheetHeader>
        <Input placeholder="Player name" {...register("nickname")} />

        <SheetFooter className="flex items-start flex-row justify-between w-full">
          {!!errors.nickname ? (
            <span className="text-red-600 text-base leading-none">
              {errors.nickname.message}
            </span>
          ) : (
            <div />
          )}
          <SheetClose asChild>
            <Button
              type="button"
              onClick={handleSubmit((data) => {
                addPlayer(data.nickname);
                resetField("nickname");
                toggleOpen(false);
              })}
            >
              Add
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AddPlayerSheet;
