"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SignUpSchema, type SignUpValues } from "@/types";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { signUp } from "@/lib/supabase"; // ✅ Supabase sign-up method

export function SignUpForm({
   onSubmitAction,
}: {
  onSubmitAction?: (values: SignUpValues) => Promise<void> | void;
}) {
  const form = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptedTerms: false,
    },
    mode: "onTouched",
  });

  const [submitting, setSubmitting] = React.useState(false);
  const router = useRouter();

  async function handleSubmit(values: SignUpValues) {
    try {
      setSubmitting(true);

      const res = onSubmitAction
      ? await onSubmitAction(values)
      : await signUp(values.email, values.password);

      if (res) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Sign up failed:", error);
      // Optionally show toast or error message
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="text-white">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-xl font-semibold text-[#6BE9A0]">Create Account</h1>
        <p className="text-sm text-white/80">
          Fill in your information to set up your account
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 text-white">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Full Name</FormLabel>
                <FormControl>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="h-12 rounded-none border border-white/15 bg-[#0B3F37] px-4 text-white placeholder:text-white/60 focus-visible:border-white focus-visible:ring-white/30"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="h-12 rounded-none border border-white/15 bg-[#0B3F37] px-4 text-white placeholder:text-white/60 focus-visible:border-white focus-visible:ring-white/30"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="h-12 rounded-none border border-white/15 bg-[#0B3F37] px-4 text-white placeholder:text-white/60 focus-visible:border-white focus-visible:ring-white/30"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="h-12 rounded-none border border-white/15 bg-[#0B3F37] px-4 text-white placeholder:text-white/60 focus-visible:border-white focus-visible:ring-white/30"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Terms Checkbox */}
          <FormField
            control={form.control}
            name="acceptedTerms"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(v: boolean) => field.onChange(Boolean(v))}
                      aria-label="Accept terms"
                      className="rounded-none border border-white/20 bg-[#0B3F37] data-[state=checked]:bg-white data-[state=checked]:text-[#0F4D46]"
                    />
                  </FormControl>
                  <div className="text-sm text-white/90">
                    I agree to the{" "}
                    <a href="/terms" className="underline">Terms</a>{" "}
                    and{" "}
                    <a href="/privacy" className="underline">Privacy Policy</a>.
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="h-12 w-full cursor-pointer rounded-none bg-white text-base font-semibold text-[#0F4D46] shadow-[0_15px_45px_-25px_rgba(224,181,255,0.9)] transition-colors duration-200 hover:bg-[#E0B5FF] disabled:cursor-not-allowed disabled:bg-white/60 disabled:text-[#0F4D46]/60"
            disabled={submitting}>
            {submitting ? "Creating Account…" : "Create Account"}
          </Button>
        </form>
      </Form>

      <div className="mt-10 border-t border-white/15 pt-8 text-center text-sm text-white/80">
        <p>
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-[#6BE9A0] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
