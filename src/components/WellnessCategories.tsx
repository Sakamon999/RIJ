import React from 'react';

interface WellnessCategoriesProps {
  onTojiClick: () => void;
  onZenClick: () => void;
  onShinrinyokuClick: () => void;
  onShokuyojoClick: () => void;
  onMatsuriClick: () => void;
}

export default function WellnessCategories({
  onTojiClick,
  onZenClick,
  onShinrinyokuClick,
  onShokuyojoClick,
  onMatsuriClick
}: WellnessCategoriesProps) {
  return (
    <div className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-light text-white text-center mb-12">Wellness Pillars</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          <button onClick={onTojiClick} className="p-6 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
            <div className="text-xl font-light text-white mb-2">Toji</div>
            <div className="text-sm text-gray-400">Hot Springs</div>
          </button>
          <button onClick={onZenClick} className="p-6 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
            <div className="text-xl font-light text-white mb-2">Zen</div>
            <div className="text-sm text-gray-400">Meditation</div>
          </button>
          <button onClick={onShinrinyokuClick} className="p-6 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
            <div className="text-xl font-light text-white mb-2">Shinrinyoku</div>
            <div className="text-sm text-gray-400">Forest Bathing</div>
          </button>
          <button onClick={onShokuyojoClick} className="p-6 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
            <div className="text-xl font-light text-white mb-2">Shokuyojo</div>
            <div className="text-sm text-gray-400">Mindful Dining</div>
          </button>
          <button onClick={onMatsuriClick} className="p-6 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
            <div className="text-xl font-light text-white mb-2">Matsuri</div>
            <div className="text-sm text-gray-400">Festival</div>
          </button>
        </div>
      </div>
    </div>
  );
}
