"use client";
import { User, UserInfo } from "@prisma/client";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, CheckIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { countries } from "@/data/countries";
import { updateProfile } from "../_actions";

interface ProfileFormProps {
  initialData:
    | (User & {
        userInfo: UserInfo | null;
      })
    | null;
}

const formSchema = zod.object({
  name: zod.string().min(1, "Name is required").max(50, "Name is too long"),
  email: zod.string().email().min(1, "Email is required"),
  birthdate: zod.date(),
  country: zod.string(),
});

export default function ProfileForm({ initialData: user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      birthdate: user?.userInfo?.birthdate ?? undefined,
      country: user?.userInfo?.country ?? "",
    },
  });

  async function onSubmit(values: zod.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await updateProfile(values);
      toast("Profile updated successfully");
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
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-slate-700">Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-slate-700">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-slate-700">Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          <span>{field.value.toLocaleDateString()}</span>
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Your date of birth is used to calculate your age.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-slate-700">Country</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? countries.find(
                              (country) => country.code === field.value
                            )?.name
                          : "Select country"}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search country..."
                        className="h-9"
                      />
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup className="max-h-40 overflow-y-auto">
                        {countries.map((country) => (
                          <CommandItem
                            value={country.name}
                            key={country.code}
                            onSelect={() => {
                              form.setValue("country", country.code);
                            }}
                          >
                            {country.name}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                country.code === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
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
