import Square from "./Square";

interface GridProps {
  flashingIndices: number[];
  selectedIndices: number[];
  correctIndices?: number[];
  incorrectIndices?: number[];
  showFeedback: boolean;
  onSquareClick: (index: number) => void;
  disabled: boolean;
}

const Grid = ({
  flashingIndices,
  selectedIndices,
  correctIndices = [],
  incorrectIndices = [],
  showFeedback,
  onSquareClick,
  disabled,
}: GridProps) => {
  const gridSize = 5;
  const totalSquares = gridSize * gridSize;

  return (
    <div className="inline-block p-6 bg-grid-bg rounded-2xl border-2 border-grid-border shadow-2xl">
      <div className="grid grid-cols-5 gap-3 w-full max-w-md">
        {Array.from({ length: totalSquares }).map((_, index) => (
          <Square
            key={index}
            isFlashing={flashingIndices.includes(index)}
            isSelected={selectedIndices.includes(index)}
            isCorrect={correctIndices.includes(index)}
            isIncorrect={incorrectIndices.includes(index)}
            showFeedback={showFeedback}
            onClick={() => onSquareClick(index)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default Grid;
