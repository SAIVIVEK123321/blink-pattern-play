import { useState, useEffect } from "react";
import Grid from "./Grid";
import LevelInfo from "./LevelInfo";
import FeedbackDisplay from "./FeedbackDisplay";
import { levels, getFlashingIndices } from "../utils/gameRules";

type GamePhase = "instructions" | "watching" | "selecting" | "feedback" | "complete";

const GameController = () => {
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [phase, setPhase] = useState<GamePhase>("instructions");
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [correctIndices, setCorrectIndices] = useState<number[]>([]);
  const [incorrectIndices, setIncorrectIndices] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);

  const currentLevel = levels.find((l) => l.id === currentLevelId)!;
  const flashingIndices = getFlashingIndices(currentLevelId);

  // Handle flashing phase timer
  useEffect(() => {
    if (phase === "watching") {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setPhase("selecting");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [phase]);

  const startLevel = () => {
    setPhase("watching");
    setSelectedIndices([]);
    setCorrectIndices([]);
    setIncorrectIndices([]);
    setShowHint(false);
    setTimeLeft(10);
  };

  const handleSquareClick = (index: number) => {
    if (phase !== "selecting") return;

    setSelectedIndices((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const handleSubmit = () => {
    // Determine which selections are correct and incorrect
    const correct = selectedIndices.filter((i) => flashingIndices.includes(i));
    const incorrect = selectedIndices.filter((i) => !flashingIndices.includes(i));
    const missed = flashingIndices.filter((i) => !selectedIndices.includes(i));

    setCorrectIndices(correct);
    setIncorrectIndices([...incorrect, ...missed]);

    // Check if all selections are correct and no squares were missed
    const isCorrect = correct.length === flashingIndices.length && incorrect.length === 0;

    if (isCorrect) {
      setScore((prev) => prev + 100);
      setPhase("feedback");
    } else {
      setPhase("feedback");
    }
  };

  const handleNextLevel = () => {
    if (currentLevelId < levels.length) {
      setCurrentLevelId((prev) => prev + 1);
      setPhase("instructions");
    } else {
      setPhase("complete");
    }
  };

  const handleRetry = () => {
    startLevel();
  };

  const isCorrect =
    correctIndices.length === flashingIndices.length && incorrectIndices.length === 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Pattern Decoder
          </h1>
          <p className="text-muted-foreground text-lg">
            Observe. Memorize. Decode the pattern.
          </p>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Level:</span>
              <span className="text-primary font-bold text-lg">{currentLevelId} / {levels.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Score:</span>
              <span className="text-secondary font-bold text-lg">{score}</span>
            </div>
          </div>
        </div>

        {/* Level Info */}
        {(phase === "instructions" || phase === "watching") && (
          <LevelInfo
            level={currentLevel}
            phase={phase}
            timeLeft={timeLeft}
            onStart={startLevel}
          />
        )}

        {/* Grid */}
        <div className="flex justify-center mb-6">
          <Grid
            flashingIndices={phase === "watching" ? flashingIndices : []}
            selectedIndices={selectedIndices}
            correctIndices={correctIndices}
            incorrectIndices={incorrectIndices}
            showFeedback={phase === "feedback"}
            onSquareClick={handleSquareClick}
            disabled={phase !== "selecting"}
          />
        </div>

        {/* Selection Controls */}
        {phase === "selecting" && (
          <div className="text-center space-y-4 animate-fade-in">
            <p className="text-lg text-foreground">
              Select the squares that were flashing
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleSubmit}
                disabled={selectedIndices.length === 0}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-6 py-3 bg-muted text-muted-foreground rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-all"
              >
                {showHint ? "Hide" : "Show"} Hint
              </button>
            </div>
            {showHint && (
              <p className="text-accent text-sm animate-fade-in">
                💡 {currentLevel.hint}
              </p>
            )}
          </div>
        )}

        {/* Feedback */}
        {phase === "feedback" && (
          <FeedbackDisplay
            isCorrect={isCorrect}
            correctCount={correctIndices.length}
            totalCount={flashingIndices.length}
            onNext={handleNextLevel}
            onRetry={handleRetry}
            isLastLevel={currentLevelId === levels.length}
          />
        )}

        {/* Game Complete */}
        {phase === "complete" && (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-primary">Congratulations!</h2>
            <p className="text-xl text-foreground">
              You've completed all levels!
            </p>
            <p className="text-2xl font-bold text-secondary">
              Final Score: {score}
            </p>
            <button
              onClick={() => {
                setCurrentLevelId(1);
                setPhase("instructions");
                setScore(0);
              }}
              className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold shadow-lg shadow-secondary/30 hover:shadow-secondary/50 transition-all"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameController;
