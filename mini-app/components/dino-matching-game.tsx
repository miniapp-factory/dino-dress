"use client";

import { useEffect, useState } from "react";

interface Card {
  id: number;
  name: string;
  image: string;
}

export default function DinoMatchingGame() {
  // Define a set of dinosaur cards with matching pairs
  const baseCards: Omit<Card, "id">[] = [
    { name: "T-Rex", image: "/dino-trex.png" },
    { name: "Triceratops", image: "/dino-triceratops.png" },
    { name: "Stegosaurus", image: "/dino-stegosaurus.png" },
    { name: "Pterodactyl", image: "/dino-pterodactyl.png" },
    { name: "Velociraptor", image: "/dino-velociraptor.png" },
    { name: "Brachiosaurus", image: "/dino-brachiosaurus.png" },
    { name: "Ankylosaurus", image: "/dino-ankylosaurus.png" },
    { name: "Diplodocus", image: "/dino-diplodocus.png" },
  ];

  // Duplicate each card to create pairs and shuffle
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [win, setWin] = useState(false);

  const initCards = () => {
    const shuffled = [...baseCards, ...baseCards]
      .map((card, index) => ({ ...card, id: index }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
  };

  useEffect(() => {
    initCards();
  }, []);

  const handleClick = (index: number) => {
    if (flipped.includes(index) || matched.has(index) || flipped.length === 2) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    setMoves((prev) => prev + 1);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].name === cards[second].name) {
        // Match found
        setMatched((prev) => {
          const newSet = new Set([...prev, first, second]);
          if (newSet.size === cards.length) {
            setWin(true);
          }
          return newSet;
        });
        // Play a short sound
        const audio = new Audio("/yay.mp3");
        audio.play();
        setFlipped([]);
      } else {
        // Mismatch: flip back after a short delay
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  const restart = () => {
    initCards();
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setWin(false);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">Moves: {moves}</span>
          <button
            onClick={restart}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Restart
          </button>
        </div>
        {win && (
          <div className="text-2xl font-bold text-green-600">
            You win! 🎉
          </div>
        )}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`relative w-24 h-24 rounded-lg shadow-md cursor-pointer ${
                matched.has(index) ? "opacity-0 pointer-events-none" : ""
              }`}
              style={{ perspective: "1000px" }}
              onClick={() => handleClick(index)}
            >
              <div
                className={`absolute inset-0 rounded-lg transition-transform duration-300 backface-visibility-hidden`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Back side */}
                <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center backface-visibility-hidden">
                  <span className="text-2xl">🦕</span>
                </div>
                {/* Front side */}
                <div
                  className={`absolute inset-0 rounded-lg bg-white flex items-center justify-center transform ${
                    flipped.includes(index) ? "rotate-y-180" : ""
                  } backface-visibility-hidden`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-20 h-20 object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-visibility-hidden { backface-visibility: hidden; }
      `}</style>
    </>
  );
}
