import { useState, useEffect, useCallback } from "react";
import Grid from "./Grid";
import LevelInfo from "./LevelInfo";
import FeedbackDisplay from "./FeedbackDisplay";
import ThemeToggle from "./ThemeToggle";
import { levels, generateSequence } from "../utils/gameRules";
import { sounds } from "../utils/sounds";
import { Clock } from "lucide-react";

type GamePhase = "instructions" | "watching" | "selecting" | "feedback" | "complete";

const GameController = () => {
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [phase, setPhase] = useState<GamePhase>("instructions");
  const [pattern, setPattern] = useState<number[]>([]); // The correct pattern
  const [userSelection, setUserSelection] = useState<number[]>([]); // User's selected squares
  const [flashingSquares, setFlashingSquares] = useState<number[]>([]); // Currently flashing squares
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [watchTime, setWatchTime] = useState(0);
  const [correctSquares, setCorrectSquares] = useState<number[]>([]);
  const [incorrectSquares, setIncorrectSquares] = useState<number[]>([]);

  const currentLevel = levels.find((l) => l.id === currentLevelId)!;

  // Watch phase timer - flash for 10 seconds
  useEffect(() => {
    if (phase === "watching") {
      const startTime = Date.now();
      
      // Flash on/off every 500ms
      const flashInterval = setInterval(() => {
        setFlashingSquares(prev => prev.length > 0 ? [] : pattern);
      }, 500);

      // Update watch time
      const timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setWatchTime(elapsed);
        
        if (elapsed >= 10) {
          clearInterval(flashInterval);
          clearInterval(timerInterval);
          setFlashingSquares([]);
          setPhase("selecting");
        }
      }, 100);

      return () => {
        clearInterval(flashInterval);
        clearInterval(timerInterval);
      };
    }
  }, [phase, pattern]);


  const startLevel = useCallback(() => {
    const newPattern = generateSequence(currentLevelId);
    setPattern(newPattern);
    setUserSelection([]);
    setFlashingSquares([]);
    setShowFeedback(false);
    setWatchTime(0);
    setCorrectSquares([]);
    setIncorrectSquares([]);
    setPhase("watching");
  }, [currentLevelId]);

  const handleSquareClick = useCallback((index: number) => {
    if (phase !== "selecting") return;

    setUserSelection(prev => {
      if (prev.includes(index)) {
        // Deselect
        return prev.filter(i => i !== index);
      } else {
        // Select
        sounds.playClick();
        return [...prev, index];
      }
    });
  }, [phase]);

  const handleSubmit = useCallback(() => {
    // Check user's selection against the pattern
    const correct: number[] = [];
    const incorrect: number[] = [];
    
    userSelection.forEach(index => {
      if (pattern.includes(index)) {
        correct.push(index);
      } else {
        incorrect.push(index);
      }
    });

    // Check if all pattern squares were selected
    const allCorrect = correct.length === pattern.length && incorrect.length === 0;
    
    setCorrectSquares(correct);
    setIncorrectSquares(incorrect);
    setIsCorrect(allCorrect);
    setShowFeedback(true);
    setPhase("feedback");

    if (allCorrect) {
      sounds.playCorrect();
      setScore(prev => prev + 100 * currentLevelId);
    } else {
      sounds.playWrong();
    }
  }, [userSelection, pattern, currentLevelId]);


  const handleNextLevel = () => {
    if (currentLevelId < levels.length) {
      setCurrentLevelId((prev) => prev + 1);
      setPhase("instructions");
    } else {
      setPhase("complete");
    }
  };

  const handleRetry = useCallback(() => {
    startLevel();
  }, [startLevel]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ThemeToggle />
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Pattern Decoder
          </h1>
          <p className="text-muted-foreground text-lg">
            Watch the pattern. Decode the rule. Select the squares.
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
        {phase === "instructions" && (
          <LevelInfo
            level={currentLevel}
            phase={phase}
            onStart={startLevel}
          />
        )}
        
        {phase === "watching" && (
          <div className="text-center mb-6 animate-fade-in">
            <p className="text-xl text-foreground font-semibold">
              Watch the pattern carefully... ({10 - watchTime}s remaining)
            </p>
          </div>
        )}

        {/* Grid */}
        <div className="flex justify-center mb-6">
          <Grid
            flashingSquares={flashingSquares}
            userSelection={userSelection}
            correctSquares={correctSquares}
            incorrectSquares={incorrectSquares}
            onSquareClick={handleSquareClick}
            phase={phase}
          />
        </div>

        {/* Selecting Instructions */}
        {phase === "selecting" && (
          <div className="text-center space-y-4 animate-fade-in">
            <p className="text-lg text-foreground">
              Select the squares that were flashing
            </p>
            <div className="text-sm text-muted-foreground">
              Selected: {userSelection.length} square{userSelection.length !== 1 ? 's' : ''}
            </div>
            <button
              onClick={handleSubmit}
              disabled={userSelection.length === 0}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          </div>
        )}

        {/* Feedback */}
        {showFeedback && phase === "feedback" && (
          <FeedbackDisplay
            isCorrect={isCorrect}
            correctCount={correctSquares.length}
            totalPattern={pattern.length}
            incorrectCount={incorrectSquares.length}
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
