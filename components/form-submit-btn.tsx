"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import React from "react";

type FormSubmitBtnProps = {
  children: React.ReactNode;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "success";
};

export default function FormSubmitBtn({
  children,
  className,
  variant,
  ...props
}: FormSubmitBtnProps) {
  const { pending } = useFormStatus();
  const router = useRouter();
  return (
    <Button
      {...props}
      className={`${className}`}
      type="submit"
      disabled={pending}
      variant={variant}
      onClick={(e) => {
        router.refresh();
      }}
    >
      {pending && <span className="loading loading-spinner" />}
      {children}
    </Button>
  );
}
