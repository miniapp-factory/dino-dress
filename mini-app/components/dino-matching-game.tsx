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

  useEffect(() => {
    const shuffled = [...baseCards, ...baseCards]
      .map((card, index) => ({ ...card, id: index }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, []);

  const handleClick = (index: number) => {
    if (flipped.includes(index) || matched.has(index) || flipped.length === 2) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].name === cards[second].name) {
        // Match found
        setMatched((prev) => new Set([...prev, first, second]));
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

  return (
    <div className="grid grid-cols-4 gap-4 mt-6">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className={`relative w-24 h-24 rounded-lg shadow-md cursor-pointer ${
            matched.has(index) ? "opacity-0 pointer-events-none" : ""
          }`}
          onClick={() => handleClick(index)}
        >
          <div
            className={`absolute inset-0 rounded-lg transition-transform duration-300 ${
              flipped.includes(index) ? "rotate-y-180" : ""
            }`}
          >
            {/* Back side */}
            <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🦕</span>
            </div>
            {/* Front side */}
            <div
              className={`absolute inset-0 rounded-lg bg-white flex items-center justify-center transform rotate-y-180`}
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
  );
}
