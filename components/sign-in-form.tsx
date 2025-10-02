"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, type SignInValues } from "@/types";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/supabase"; // Supabase sign-in function
import { useSearchParams } from "next/navigation";

import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SignInForm({
   onSubmitAction,
}: {
  onSubmitAction?: (values: SignInValues) => Promise<void> | void;
}) {
   const form = useForm<SignInValues>({
      resolver: zodResolver(SignInSchema),
      defaultValues: {
         email: "",
         password: "",
      },
      mode: "onTouched",
   });

   const [submitting, setSubmitting] = React.useState(false);
   const router = useRouter();
   const searchParams = useSearchParams();
   const next = (searchParams as URLSearchParams).get("next") ?? "/dashboard";

   async function handleSubmit(values: SignInValues) {
      try {
         setSubmitting(true);
         const res = onSubmitAction
         ? await onSubmitAction(values)
         : await signIn(values.email, values.password);

         if (res) {
            router.push(next);
         }
      } catch (error) {
         console.error("Sign in failed:", error);
         // Optionally show error to user
      } finally {
         setSubmitting(false);
      }
   }

   return (
      <div className="text-white">
         <div className="mb-10 text-center space-y-2">
            <h1 className="text-2xl font-semibold text-[#6BE9A0]">
               Fuel For Growth!
            </h1>
            <p className="text-md text-white/80">
               Sign in to lead the next big impact
            </p>
         </div>

         <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
               <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="sr-only">Email</FormLabel>
                        <FormControl>
                           <Input
                              placeholder="Enter your email"
                              type="email"
                              className="h-12 rounded-none border border-white/15 bg-[#0B3F37] px-4 text-white placeholder:text-white/60 focus-visible:border-white focus-visible:ring-white/30"
                              autoComplete="email"
                              {...field}
                           />
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
                        <FormLabel className="sr-only">Password</FormLabel>
                        <FormControl>
                           <Input
                              placeholder="Enter your password"
                              className="h-12 rounded-none border border-white/15 bg-[#0B3F37] px-4 text-white placeholder:text-white/60 focus-visible:border-white focus-visible:ring-white/30"
                              type="password"
                              autoComplete="current-password"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <Button
                  type="submit"
                  className="h-12 w-full cursor-pointer rounded-none bg-white text-base font-semibold text-[#0B3F37] shadow-[0_15px_45px_-25px_rgba(224,181,255,0.9)] transition-colors duration-200 hover:bg-[#E0B5FF] disabled:cursor-not-allowed disabled:bg-white/60 disabled:text-[#0B3F37]/60"
                  disabled={submitting}>
                  {submitting ? "Signing in…" : "Disrupt"}
               </Button>
            </form>
         </Form>

         <div className="mt-10 border-t border-white/15 pt-8 text-center text-sm text-white/80">
            <p>
               Don&apos;t have an account?{" "}
               <Link href="/signup" className="font-semibold text-[#6BE9A0] hover:underline">
                  Sign Up
               </Link>
            </p>
         </div>
      </div>
   );
}

export default SignInForm;
