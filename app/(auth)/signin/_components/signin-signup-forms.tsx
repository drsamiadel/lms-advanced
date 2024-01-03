"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { signIn } from "next-auth/react";
import SigninForm from "./signin-form";
import SignupForm from "./signup-form";

const formSchema = zod.object({
  name: zod
    .string()
    .min(2, {
      message: "Name must be at least 2 characters",
    })
    .max(32, {
      message: "Name must be at most 32 characters",
    }),
  email: zod.string().email(),
  password: zod
    .string()
    .min(8, {
      message: "Password must be at least 8 characters",
    })
    .max(32, {
      message: "Password must be at most 32 characters",
    }),
});

export default function SignInSignUpForms() {
  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: zod.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <Tabs defaultValue="signin" className="w-[400px]">
      <TabsList className="w-full">
        <TabsTrigger className="w-full" value="signin">
          Sign In
        </TabsTrigger>
        <TabsTrigger className="w-full" value="signup">
          Sign Up
        </TabsTrigger>
      </TabsList>
      <TabsContent value="signin" className="border shadow-sm rounded-lg p-6">
        <SigninForm />
      </TabsContent>
      <TabsContent value="signup" className="border shadow-sm rounded-lg p-6">
        <SignupForm />
      </TabsContent>
    </Tabs>
  );
}
