import { description, title } from "@/lib/metadata";
import { generateMetadata } from "@/lib/farcaster-embed";
import DinoMatchingGame from "@/components/dino-matching-game";

export { generateMetadata };

export default function Home() {
  // NEVER write anything here, only use this page to import components
  return (
    <main className="flex flex-col gap-3 place-items-center place-content-center px-4 grow">
      <span className="text-2xl">{title}</span>
      <span className="text-muted-foreground">{description}</span>
      <DinoMatchingGame />
    </main>
  );
  <style jsx>{`
    .rotate-y-180 { transform: rotateY(180deg); }
    .backface-visibility-hidden { backface-visibility: hidden; }
  `}</style>
}
