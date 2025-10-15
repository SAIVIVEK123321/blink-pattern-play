interface SquareProps {
  isFlashing: boolean;
  isSelected: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  showFeedback: boolean;
  onClick: () => void;
  disabled: boolean;
}

const Square = ({
  isFlashing,
  isSelected,
  isCorrect,
  isIncorrect,
  showFeedback,
  onClick,
  disabled,
}: SquareProps) => {
  // Determine the square's visual state
  const getSquareClass = () => {
    if (showFeedback) {
      if (isCorrect) return "bg-square-correct border-square-correct shadow-lg shadow-success/30";
      if (isIncorrect) return "bg-square-incorrect border-square-incorrect shadow-lg shadow-error/30";
    }
    
    if (isFlashing) return "animate-pulse-glow";
    if (isSelected) return "bg-square-selected border-square-selected shadow-lg shadow-secondary/30";
    
    return "bg-square-inactive border-grid-border hover:border-primary/50 hover:shadow-md hover:shadow-primary/20";
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isFlashing}
      className={`
        aspect-square rounded-lg border-2 
        transition-all duration-300 
        ${getSquareClass()}
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        ${showFeedback && "animate-success"}
      `}
      aria-label="Grid square"
    />
  );
};

export default Square;
