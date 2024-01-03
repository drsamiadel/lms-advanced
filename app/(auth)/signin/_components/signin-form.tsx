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
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = zod.object({
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

export default function SigninForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: zod.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      }).then((response) => {
        const { ok, error } = response || {};
        if (ok) {
          toast("You have successfully signed in");
          router.push("/");
        } else {
          toast(error);
        }
      });
    } catch (error) {
      toast((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-sm text-gray-500 text-center">
          sign in using social media
        </h2>
        <Button
          className="w-full py-6 flex items-center gap-x-4 text-base"
          variant="outline"
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <Image src="/icons/google.svg" width={24} height={24} alt="google" />
          Sign In with Google
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
              className="w-full py-6 flex items-center gap-x-4 text-base"
            >
              Sign In
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
