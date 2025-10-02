import { FeatureCard } from "./feature-card";
import { features } from "@/constants";

export function FeatureGrid() {
  return (
    <section className="grid gap-6 px-6 py-12 md:grid-cols-2 lg:grid-cols-4 md:px-12">
      {features.map((f) => (
        <FeatureCard key={f.title} feature={f} />
      ))}
    </section>
  );
}
