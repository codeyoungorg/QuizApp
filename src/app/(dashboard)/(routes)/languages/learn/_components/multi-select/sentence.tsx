import { useDrop } from "react-dnd";
import { Word } from "./word";
import { useRef } from "react";

interface SentenceProps {
  words: string[];
  moveWord: (
    dragIndex: number,
    hoverIndex: number,
    fromArea: string,
    toArea: string
  ) => void;
}

export const Sentence: React.FC<SentenceProps> = ({ words, moveWord }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: "word",
    drop: (item: { index: number; area: string }, monitor) => {
      if (!monitor.didDrop()) {
        moveWord(item.index, words.length, item.area, "sentence");
      }
    },
  });

  drop(ref);

  return (
    <div
      ref={ref}
      className="min-h-[50px] p-2 border-b-2 border-b-[#A9C6C6] flex flex-wrap gap-4 items-center"
      aria-label="Sentence area. Drag words here to form a sentence."
    >
      {words.map((word, index) => (
        <Word
          key={`sentence-${word}-${index}`}
          word={word}
          index={index}
          moveWord={moveWord}
          area="sentence"
        />
      ))}
    </div>
  );
};
