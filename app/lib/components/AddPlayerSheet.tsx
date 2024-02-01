"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGameActions } from "@/store/GameProvider";
import { FC, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMedia, useToggle } from "react-use";

const AddPlayerSheet: FC = () => {
  const [open, toggleOpen] = useToggle(false);
  const isDesktop = useMedia("(min-width: 768px)", true);
  const form = useForm<{ firstName: string }>({
    resolver: (data) => {
      if (!data.firstName?.trim()) {
        return {
          values: {},
          errors: {
            firstName: {
              type: "required",
              message: "Player name is required",
            },
          },
        };
      }
      if (data.firstName.length > 16) {
        return {
          values: {},
          errors: {
            firstName: {
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

  const onSubmit = useCallback(
    (data: { firstName: string }) => {
      addPlayer(data.firstName);
      toggleOpen(false);
      form.reset();
    },
    [addPlayer, toggleOpen, form]
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={toggleOpen}>
        <DialogTrigger asChild>
          <Button>Add player</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] px-6 pb-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col justify-start items-start"
            >
              <DialogHeader>
                <DialogTitle>Add new Player</DialogTitle>
              </DialogHeader>
              <FormField
                control={form.control}
                name="firstName"
                defaultValue=""
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Player name"
                        className="mb-4 mt-6"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="w-full">
                <Button type="submit" className="ml-auto">
                  Add
                </Button>
              </DialogFooter>
            </form>
          </Form>
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
        className="flex flex-col gap-5 border-slate-700 shadow-md"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col justify-start items-start"
          >
            <SheetHeader>
              <SheetTitle>Add new player</SheetTitle>
            </SheetHeader>
            <FormField
              control={form.control}
              name="firstName"
              defaultValue=""
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Player name"
                      className="mb-4 mt-6"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="w-full">
              <Button type="submit" className="ml-auto">
                Add
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default AddPlayerSheet;
