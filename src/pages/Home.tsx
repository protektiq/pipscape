import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    navigate(`/play/${difficulty}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">PIPSCAPE</h1>
        <p className="text-xl text-gray-700 mb-8">
          Domino-based logic puzzles
        </p>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Choose Difficulty
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleDifficultySelect('easy')}
              className="px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-lg transition-colors shadow-md hover:shadow-lg"
            >
              Easy
            </button>
            <button
              onClick={() => handleDifficultySelect('medium')}
              className="px-6 py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold text-lg transition-colors shadow-md hover:shadow-lg"
            >
              Medium
            </button>
            <button
              onClick={() => handleDifficultySelect('hard')}
              className="px-6 py-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-lg transition-colors shadow-md hover:shadow-lg"
            >
              Hard
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-8">
            Click a difficulty to generate and play a new puzzle
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;



