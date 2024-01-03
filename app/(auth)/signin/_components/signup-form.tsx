"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { signIn } from "next-auth/react";
import { registerUser } from "../_actions";
import { useState } from "react";
import { toast } from "sonner";

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
export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: zod.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const result = await registerUser(values);
      if (result) {
        await signIn("credentials", {
          email: values.email,
          password: values.password,
          callbackUrl: "/",
        });
      }
    } catch (error) {
      toast(`${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-sm text-gray-500 text-center">
          sign up using social media
        </h2>
        <Button
          className="w-full py-6 flex items-center gap-x-4 text-base"
          variant="outline"
        >
          <Image src="/icons/google.svg" width={24} height={24} alt="google" />
          Sign Up with Google
        </Button>
      </div>
      <Separator />
      <div className="flex flex-col space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading}
              type="submit"
              className="w-full py-6 flex items-center gap-x-4 text-base"
            >
              Sign Up
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
