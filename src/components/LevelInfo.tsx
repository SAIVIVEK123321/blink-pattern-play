interface LevelInfoProps {
  level: {
    id: number;
    name: string;
    description: string;
    sequenceLength: number;
  };
  phase: string;
  onStart: () => void;
}

const LevelInfo = ({ level, phase, onStart }: LevelInfoProps) => {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <div className="bg-card border-2 border-border rounded-xl p-6 shadow-lg max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-2">
          Level {level.id}: {level.name}
        </h2>
        <p className="text-foreground mb-4">{level.description}</p>
        <p className="text-sm text-muted-foreground mb-6">
          Sequence Length: <span className="text-secondary font-bold">{level.sequenceLength}</span>
        </p>

        {phase === "instructions" && (
          <button
            onClick={onStart}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105"
          >
            Start Level
          </button>
        )}
      </div>
    </div>
  );
};

export default LevelInfo;
