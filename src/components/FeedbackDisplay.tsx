interface FeedbackDisplayProps {
  isCorrect: boolean;
  correctCount: number;
  totalCount: number;
  onNext: () => void;
  onRetry: () => void;
  isLastLevel: boolean;
}

const FeedbackDisplay = ({
  isCorrect,
  correctCount,
  totalCount,
  onNext,
  onRetry,
  isLastLevel,
}: FeedbackDisplayProps) => {
  return (
    <div className="text-center space-y-6 animate-fade-in">
      {isCorrect ? (
        <>
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-3xl font-bold text-success">Perfect!</h2>
          <p className="text-lg text-foreground">
            You correctly identified all {totalCount} squares!
          </p>
          <button
            onClick={onNext}
            className="px-8 py-3 bg-success text-success-foreground rounded-lg font-semibold shadow-lg shadow-success/30 hover:shadow-success/50 transition-all"
          >
            {isLastLevel ? "Complete Game" : "Next Level"}
          </button>
        </>
      ) : (
        <>
          <div className="text-6xl mb-4">🤔</div>
          <h2 className="text-3xl font-bold text-error">Not Quite</h2>
          <p className="text-lg text-foreground">
            You found {correctCount} out of {totalCount} squares
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onRetry}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
            >
              Try Again
            </button>
            <button
              onClick={onNext}
              className="px-8 py-3 bg-muted text-muted-foreground rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-all"
            >
              Skip Level
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FeedbackDisplay;
