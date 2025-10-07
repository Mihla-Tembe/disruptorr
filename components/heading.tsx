import { HeadingProps } from "@/types";
import React from "react";

export default function Heading({ title, description }: HeadingProps) {
  return (
    <div>
      <h1 className="space-grotesk text-primary text-xl md:text-3xl font-semibold tracking-wide dark:text-emerald-100">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 text-black text-md max-w-5xl dark:text-emerald-200">
          {description}
        </p>
      ) : null}
    </div>
  );
}
