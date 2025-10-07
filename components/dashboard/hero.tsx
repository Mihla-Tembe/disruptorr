import { HERO_TITLE, HERO_SUBTITLE } from "@/constants";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[560px] w-full items-center justify-center overflow-hidden bg-black text-white px-6 md:min-h-[520px]">
      <video
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source
          src="/Disruptor_30_Seconder_Website_Video.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
      <div className="relative z-10 w-full max-w-3xl text-center">
        <div className="mx-auto max-w-2xl rounded-xl p-8">
          <h1 className="space-grotesk text-5xl font-semibold tracking-wide text-white md:text-4xl">
            {HERO_TITLE}
          </h1>
          <p className="mt-4 text-md text-white/85 md:text-lg">
            {HERO_SUBTITLE}
          </p>
        </div>
      </div>
    </section>
  );
}
