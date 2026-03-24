import { useEffect, useRef, useState } from "react";

interface TypewriterEffectProps {
  words: { text: string; className?: string }[];
  className?: string;
  cursorClassName?: string;
}

const TypewriterEffect = ({ words, className = "", cursorClassName = "" }: TypewriterEffectProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const fullText = words.map(w => w.text).join(" ");
    if (charIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      setDone(true);
    }
  }, [charIndex, done, words]);

  // Map displayed text back to styled spans
  const renderText = () => {
    let pos = 0;
    return words.map((word, i) => {
      const start = pos;
      const end = pos + word.text.length;
      pos = end + 1; // +1 for space
      const displayed = displayedText.slice(start, Math.min(end, displayedText.length));
      const space = i < words.length - 1 && displayedText.length > end ? " " : "";
      return (
        <span key={i} className={word.className}>
          {displayed}{space}
        </span>
      );
    });
  };

  return (
    <span className={className}>
      {renderText()}
      <span className={`inline-block w-[3px] h-[1em] ml-1 align-middle ${cursorClassName} ${done ? "animate-pulse" : ""}`}
        style={{ background: "#00D4FF" }}
      />
    </span>
  );
};

export default TypewriterEffect;
