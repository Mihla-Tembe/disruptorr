import type React from "react";
import Image from "next/image";
import MainBg from "@/public/main-bg.jpg";
import PatternBg from "@/public/pattern-bg.png";
import Logo from "@/public/disruptor-logo.svg";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-primary text-white lg:flex-row">
      <Image
        src={PatternBg}
        alt=""
        fill
        priority
        aria-hidden
        className="absolute inset-0 -z-20 object-cover opacity-70 pointer-events-none"
      />
      {/* Left side - Hero Image */}
      <div className="relative z-10 w-full h-[320px] sm:h-[400px] lg:h-auto lg:w-1/2">
        <Image
          src={MainBg}
          alt="Silhouette running along illuminated steps"
          fill
          priority
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none bottom-0"
        />
        <div className="relative z-10 flex h-full flex-col justify-center gap-6 px-6 py-10 sm:px-10 lg:px-16 lg:py-16">
          <p className="max-w-md text-base sm:text-xl text-white/85 leading-relaxed">
            Your gateway to dynamic visualisations, powered by{" "}
            <span className="text-[#6BE9A0]">embedded AI</span> that delivers
            the insight, precision, and agility needed to drive smarter
            decisions and sustainable growth across the{" "}
            <span className="text-[#6BE9A0]">media ecosystem</span>.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="relative z-10 flex w-full items-center justify-center px-6 py-12 sm:px-10 lg:w-1/2 lg:px-16">
        <div
          className="absolute inset-0 -z-10 bg-[#0f4d46]/90 backdrop-blur-sm"
          aria-hidden
        />
        <div className="w-full max-w-sm">
          <div className="mb-12 flex justify-center">
            <Image
              src={Logo}
              alt="Disruptor"
              width={160}
              height={48}
              priority
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
