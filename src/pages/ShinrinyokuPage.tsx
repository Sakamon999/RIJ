export default function ShinrinyokuPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-light">ShinrinyokuPage</h1>
        <button onClick={onBack} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full">
          Back
        </button>
      </div>
    </div>
  );
}
