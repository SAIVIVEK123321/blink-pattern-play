import { useState, useEffect, useCallback } from "react";
import Grid from "./Grid";
import LevelInfo from "./LevelInfo";
import FeedbackDisplay from "./FeedbackDisplay";
import ThemeToggle from "./ThemeToggle";
import { levels, generateSequence } from "../utils/gameRules";
import { sounds } from "../utils/sounds";
import { Clock } from "lucide-react";

type GamePhase = "instructions" | "watching" | "playing" | "feedback" | "complete";

const GameController = () => {
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [phase, setPhase] = useState<GamePhase>("instructions");
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [currentFlashIndex, setCurrentFlashIndex] = useState(-1);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [currentPlaybackIndex, setCurrentPlaybackIndex] = useState(0);
  const [levelStartTime, setLevelStartTime] = useState<number>(0);
  const [levelTime, setLevelTime] = useState(0);

  const currentLevel = levels.find((l) => l.id === currentLevelId)!;

  // Timer effect
  useEffect(() => {
    if (phase === "playing") {
      const interval = setInterval(() => {
        setLevelTime(Math.floor((Date.now() - levelStartTime) / 1000));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [phase, levelStartTime]);

  // Play sequence animation
  useEffect(() => {
    if (phase === "watching" && sequence.length > 0) {
      if (currentPlaybackIndex < sequence.length) {
        const timer = setTimeout(() => {
          setCurrentFlashIndex(sequence[currentPlaybackIndex]);
          
          const flashOffTimer = setTimeout(() => {
            setCurrentFlashIndex(-1);
            setCurrentPlaybackIndex((prev) => prev + 1);
          }, currentLevel.speed);

          return () => clearTimeout(flashOffTimer);
        }, currentLevel.speed + 200);

        return () => clearTimeout(timer);
      } else {
        // Sequence complete, let user play
        const timer = setTimeout(() => {
          setPhase("playing");
          setLevelStartTime(Date.now());
          setLevelTime(0);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [phase, currentPlaybackIndex, sequence, currentLevel.speed]);

  const startLevel = useCallback(() => {
    const newSequence = generateSequence(currentLevelId);
    setSequence(newSequence);
    setUserSequence([]);
    setCurrentFlashIndex(-1);
    setCurrentPlaybackIndex(0);
    setShowFeedback(false);
    setPhase("watching");
  }, [currentLevelId]);

  const handleSquareClick = useCallback((index: number) => {
    if (phase !== "playing") return;

    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    // Flash the clicked square
    setCurrentFlashIndex(index);
    setTimeout(() => setCurrentFlashIndex(-1), 200);

    // Play click sound
    sounds.playClick();

    // Check if this click is correct
    if (sequence[newUserSequence.length - 1] !== index) {
      // Wrong click - immediate feedback
      sounds.playWrong();
      setIsCorrect(false);
      setShowFeedback(true);
      setPhase("feedback");
      return;
    }

    // Check if sequence is complete
    if (newUserSequence.length === sequence.length) {
      // Complete and correct!
      sounds.playCorrect();
      setIsCorrect(true);
      setShowFeedback(true);
      setScore((prev) => prev + 100 * currentLevelId);
      setPhase("feedback");
    }
  }, [phase, userSequence, sequence, currentLevelId]);


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
            Sequence Memory
          </h1>
          <p className="text-muted-foreground text-lg">
            Watch. Remember. Repeat the sequence.
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
            {phase === "playing" && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-accent font-bold text-lg">{levelTime}s</span>
              </div>
            )}
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
              Watch carefully...
            </p>
          </div>
        )}

        {/* Grid */}
        <div className="flex justify-center mb-6">
          <Grid
            currentFlashIndex={currentFlashIndex}
            onSquareClick={handleSquareClick}
            disabled={phase !== "playing"}
          />
        </div>

        {/* Playing Instructions */}
        {phase === "playing" && (
          <div className="text-center space-y-4 animate-fade-in">
            <p className="text-lg text-foreground">
              Your turn! Repeat the sequence
            </p>
            <div className="text-sm text-muted-foreground">
              Progress: {userSequence.length} / {sequence.length}
            </div>
          </div>
        )}

        {/* Feedback */}
        {showFeedback && phase === "feedback" && (
          <FeedbackDisplay
            isCorrect={isCorrect}
            sequenceLength={sequence.length}
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
