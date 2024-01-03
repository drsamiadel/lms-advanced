"use client";
import { User } from "@prisma/client";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updatePassword } from "../_actions";

interface ProfileFormProps {
  initialData: User | null;
}

const formSchema = zod
  .object({
    oldPassword: zod.string().min(8),
    newPassword: zod.string().min(8),
    confirmPassword: zod.string().min(8),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
    }
  });

export default function SecurityForm({ initialData: user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: zod.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const user = await updatePassword(values);
      toast("Password updated successfully");
      router.refresh();
    } catch (error) {
      toast((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="flex flex-col gap-y-2 mt-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-slate-700">Old password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Old password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-slate-700">New password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="New password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-slate-700">
                  Confirm password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isLoading}
            className="self-end w-min py-4 px-6 flex items-center gap-x-4 text-base"
          >
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
}
