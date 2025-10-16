import Square from "./Square";

interface GridProps {
  currentFlashIndex: number;
  onSquareClick: (index: number) => void;
  disabled: boolean;
}

const Grid = ({
  currentFlashIndex,
  onSquareClick,
  disabled,
}: GridProps) => {
  const gridSize = 5;
  const totalSquares = gridSize * gridSize;

  return (
    <div className="inline-block p-10 bg-grid-bg rounded-2xl border-2 border-grid-border shadow-2xl">
      <div className="grid grid-cols-5 gap-5 w-full" style={{ maxWidth: '700px' }}>
        {Array.from({ length: totalSquares }).map((_, index) => (
          <Square
            key={index}
            isFlashing={currentFlashIndex === index}
            onClick={() => onSquareClick(index)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default Grid;
