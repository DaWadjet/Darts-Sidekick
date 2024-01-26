import clsx from "clsx";
import { ClassNameValue, twMerge } from "tailwind-merge";

export const clsxm = (...args: ClassNameValue[]) => clsx(twMerge(...args));
