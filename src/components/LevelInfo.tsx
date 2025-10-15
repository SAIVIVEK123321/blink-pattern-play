import { Level } from "../utils/gameRules";

interface LevelInfoProps {
  level: Level;
  phase: "instructions" | "watching";
  timeLeft: number;
  onStart: () => void;
}

const LevelInfo = ({ level, phase, timeLeft, onStart }: LevelInfoProps) => {
  if (phase === "instructions") {
    return (
      <div className="text-center mb-8 space-y-4 animate-fade-in">
        <h2 className="text-3xl font-bold text-primary">
          Level {level.id}: {level.name}
        </h2>
        <p className="text-lg text-foreground max-w-xl mx-auto">
          {level.description}
        </p>
        <div className="pt-4">
          <button
            onClick={onStart}
            className="px-10 py-4 bg-gradient-to-r from-primary to-secondary text-foreground rounded-lg font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all"
          >
            Start Level
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center mb-8 space-y-2 animate-fade-in">
      <h3 className="text-xl font-semibold text-primary">
        Observe the Pattern
      </h3>
      <div className="text-5xl font-bold text-secondary tabular-nums">
        {timeLeft}s
      </div>
      <p className="text-muted-foreground">Memorize which squares are flashing</p>
    </div>
  );
};

export default LevelInfo;
