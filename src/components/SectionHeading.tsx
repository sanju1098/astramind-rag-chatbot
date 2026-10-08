import { Reveal } from "./Reveal";

export function SectionHeading({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <Reveal className="mb-8 text-center md:mb-10">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
        {text}
      </p>
    </Reveal>
  );
}
