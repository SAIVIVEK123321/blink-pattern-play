import Square from "./Square";

interface GridProps {
  flashingSquares: number[];
  userSelection: number[];
  correctSquares: number[];
  incorrectSquares: number[];
  onSquareClick: (index: number) => void;
  phase: string;
}

const Grid = ({
  flashingSquares,
  userSelection,
  correctSquares,
  incorrectSquares,
  onSquareClick,
  phase,
}: GridProps) => {
  const gridSize = 5;
  const totalSquares = gridSize * gridSize;

  return (
    <div className="inline-block p-10 bg-grid-bg rounded-2xl border-2 border-grid-border shadow-2xl">
      <div className="grid grid-cols-5 gap-5 w-full" style={{ maxWidth: '700px' }}>
        {Array.from({ length: totalSquares }).map((_, index) => {
          const isFlashing = flashingSquares.includes(index);
          const isSelected = userSelection.includes(index);
          const isCorrect = correctSquares.includes(index);
          const isIncorrect = incorrectSquares.includes(index);
          
          return (
            <Square
              key={index}
              isFlashing={isFlashing}
              isSelected={isSelected}
              isCorrect={isCorrect}
              isIncorrect={isIncorrect}
              onClick={() => onSquareClick(index)}
              disabled={phase !== "selecting"}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Grid;
