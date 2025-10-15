interface SquareProps {
  isFlashing: boolean;
  onClick: () => void;
  disabled: boolean;
}

const Square = ({
  isFlashing,
  onClick,
  disabled,
}: SquareProps) => {
  const getSquareClass = () => {
    if (isFlashing) return "animate-pulse-glow scale-105";
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
