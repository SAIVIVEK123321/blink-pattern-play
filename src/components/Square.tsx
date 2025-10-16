interface SquareProps {
  isFlashing: boolean;
  isSelected: boolean;
  isCorrect: boolean;
  isIncorrect: boolean;
  onClick: () => void;
  disabled: boolean;
}

const Square = ({
  isFlashing,
  isSelected,
  isCorrect,
  isIncorrect,
  onClick,
  disabled,
}: SquareProps) => {
  const getSquareClass = () => {
    // Feedback states (highest priority)
    if (isCorrect) return "bg-success border-success scale-105";
    if (isIncorrect) return "bg-error border-error scale-105";
    
    // Flashing state (during watch phase)
    if (isFlashing) return "animate-pulse-glow scale-105";
    
    // Selected state (during selection phase)
    if (isSelected) return "bg-primary/30 border-primary scale-105";
    
    // Default state
    return "bg-square-inactive border-grid-border hover:border-primary/50 hover:shadow-md hover:shadow-primary/20 hover:scale-105";
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        aspect-square rounded-lg border-2 
        transition-all duration-200
        ${getSquareClass()}
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
      `}
      aria-label="Grid square"
    />
  );
};

export default Square;
