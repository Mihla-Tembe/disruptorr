"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";

import { getProfileAction, updateProfileAction } from "@/actions/profile";

const ProfileSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    newPassword: z.string().optional(),
    confirmNewPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      const wantsChange = Boolean(data.newPassword || data.confirmNewPassword);
      if (!wantsChange) return true;
      const next = String(data.newPassword ?? "");
      const confirm = String(data.confirmNewPassword ?? "");
      if (next.length < 8) return false;
      return next === confirm;
    },
    {
      message: "Passwords must match and be at least 8 characters",
      path: ["confirmNewPassword"],
    },
  );

type Values = z.infer<typeof ProfileSchema>;

export function ProfileForm() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [avatarKeyId, setAvatarKeyId] = React.useState<string | null>(null);
  const [emailState, setEmailState] = React.useState<string>("");
  const [avatar, setAvatar] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onTouched",
  });
  const inputClasses =
    "h-11 rounded-none border border-black/20 bg-[#cfd8d5] px-3 text-sm text-black placeholder:text-black/60 focus-visible:border-[#1b74ff] focus-visible:ring-4 focus-visible:ring-[#1b74ff]/40 focus-visible:ring-offset-0 dark:h-12 dark:border-[#1d4c39] dark:bg-[#04211a] dark:text-white dark:placeholder:text-white/60 dark:focus-visible:border-[#66ffa3] dark:focus-visible:ring-2 dark:focus-visible:ring-[#66ffa3]/40";
  const labelClasses = "text-sm font-semibold text-black dark:text-white";
  const buttonBase =
    "h-11 rounded-none px-7 text-sm font-semibold transition-colors";

  // We infer user id for avatar storage key from JWT via a tiny fetch to profile (payload.sub)
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await getProfileAction();
      if (mounted) {
        if (res.ok) {
          form.reset({
            firstName: res.profile.firstName,
            lastName: res.profile.lastName,
            email: res.profile.email,
            newPassword: "",
            confirmNewPassword: "",
          });
          setEmailState(res.profile.email);
          const key = avatarKey(res.profile.email);
          setAvatarKeyId(key);
          setAvatar(localStorage.getItem(key));
        } else {
          toast({ description: res.error, variant: "error" });
        }
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [form, toast]);

  function avatarKey(email: string) {
    return `disruptor.profile.avatar.${email.toLowerCase()}`;
  }

  function onFileChange(file: File) {
    if (!file) return;
    const allowed = ["image/png", "image/jpeg", "image/gif"];
    if (!allowed.includes(file.type)) {
      toast({ description: "Unsupported file type", variant: "error" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ description: "Image must be under 2MB", variant: "error" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result ?? "");
      setAvatar(dataUrl);
      if (avatarKeyId) localStorage.setItem(avatarKeyId, dataUrl);
      window.dispatchEvent(
        new CustomEvent("profile:avatar", { detail: { src: dataUrl } }),
      );
      toast({ description: "Image updated", variant: "success" });
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(values: Values) {
    const prevEmail = emailState;
    const res = await updateProfileAction({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      newPassword: values.newPassword || undefined,
      confirmNewPassword: values.confirmNewPassword || undefined,
    });
    if (!res.ok) {
      toast({ description: res.error, variant: "error" });
    } else {
      toast({ description: "Profile saved", variant: "success" });
      // migrate avatar key if email changed
      if (prevEmail.toLowerCase() !== values.email.toLowerCase()) {
        const oldKey = avatarKey(prevEmail);
        const newKey = avatarKey(values.email);
        const dataUrl = localStorage.getItem(oldKey);
        if (dataUrl) {
          localStorage.setItem(newKey, dataUrl);
          localStorage.removeItem(oldKey);
          setAvatarKeyId(newKey);
          setAvatar(dataUrl);
          window.dispatchEvent(
            new CustomEvent("profile:avatar", { detail: { src: dataUrl } }),
          );
        } else {
          setAvatarKeyId(newKey);
          setAvatar(localStorage.getItem(newKey));
          window.dispatchEvent(
            new CustomEvent("profile:avatar", {
              detail: { src: localStorage.getItem(newKey) },
            }),
          );
        }
        setEmailState(values.email);
      }
      form.reset({ ...values, newPassword: "", confirmNewPassword: "" });
    }
  }

  async function onRemoveImage() {
    if (avatarKeyId) localStorage.removeItem(avatarKeyId);
    setAvatar(null);
    window.dispatchEvent(
      new CustomEvent("profile:avatar", { detail: { src: null } }),
    );
    toast({ description: "Image removed", variant: "success" });
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="w-full max-w-4xl space-y-10 px-6 py-10 text-black md:px-10 dark:rounded-2xl dark:border dark:border-white/10 dark:bg-[#031611]/90 dark:text-white dark:shadow-[0_25px_70px_-45px_rgba(102,255,163,0.6)]">
      <div className="space-y-2">
        <h1 className="space-grotesk text-[2.25rem] font-bold leading-tight text-black md:text-[2.5rem] dark:text-[#66ffa3]">
          Account Settings
        </h1>
        <p className="text-sm text-black/70 dark:text-white/70">
          Update your profile, preferences, and security settings here.
        </p>
      </div>

      <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:gap-8">
        <Avatar className="h-[96px] w-[96px] rounded-full border-[3px] border-black bg-white dark:border-[#66ffa3] dark:bg-[#04271f]">
          {avatar ? <AvatarImage src={avatar} alt="Avatar" /> : null}
          <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-white text-black dark:bg-[#04271f] dark:text-[#66ffa3]">
            <Image
              src="/icons/user.svg"
              alt="Default user avatar"
              width={36}
              height={40}
              className="h-10 w-auto"
            />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3.5">
            <input
              ref={fileInputRef}
              id="avatarInput"
              type="file"
              accept="image/png,image/jpeg,image/gif"
              className="hidden"
              disabled={loading || isSubmitting}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileChange(file);
              }}
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`${buttonBase} border border-black bg-white text-black hover:bg-black hover:text-white disabled:bg-white disabled:text-black/40 dark:border-[#66ffa3] dark:bg-transparent dark:text-[#66ffa3] dark:hover:bg-[#66ffa3]/10 dark:disabled:border-white/10 dark:disabled:text-white/40`}
              disabled={loading || isSubmitting}
            >
              Change Image
            </Button>
            <Button
              type="button"
              onClick={onRemoveImage}
              className={`${buttonBase} border border-black bg-black text-white hover:bg-black/80 disabled:bg-black/30 disabled:text-white/70 dark:border-white/20 dark:bg-[#041912] dark:hover:bg-white/10 dark:disabled:border-white/10 dark:disabled:text-white/40`}
              disabled={!avatar || loading || isSubmitting}
            >
              Remove Image
            </Button>
          </div>
          <p className="text-xs text-black/60 dark:text-white/60">
            We support PNGs, JPEGs and GIFs under 2MB.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John"
                      className={inputClasses}
                      disabled={loading || isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      className={inputClasses}
                      disabled={loading || isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClasses}>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="doe@gmail.com"
                    className={inputClasses}
                    disabled={loading || isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-5">
            <h2 className="space-grotesk text-xl font-semibold text-black dark:text-[#66ffa3]">
              Password
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormField
                name="newPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className={inputClasses}
                        disabled={loading || isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="confirmNewPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>
                      Confirm New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className={inputClasses}
                        disabled={loading || isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="h-11 w-44 rounded-none border border-black bg-black text-sm font-semibold tracking-[0.08em] text-white hover:bg-black/80 disabled:bg-black/30 disabled:text-white/70 dark:border-[#66ffa3] dark:bg-[#66ffa3] dark:text-[#05271b] dark:hover:bg-[#4cf18c] dark:disabled:border-white/10 dark:disabled:bg-white/10 dark:disabled:text-white/40"
              disabled={loading || isSubmitting}
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
