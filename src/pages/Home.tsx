import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HowToPlayModal from '../components/HowToPlayModal';

const Home = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    navigate(`/play/${difficulty}`);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">PIPSCAPE</h1>
          <p className="text-xl text-gray-700 mb-8">
            Domino-based logic puzzles
          </p>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Choose Difficulty
              </h2>
              <button
                onClick={handleOpenModal}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-manipulation"
                aria-label="How to play"
              >
                How to Play
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleDifficultySelect('easy')}
                className="px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-lg transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 touch-manipulation"
                aria-label="Start easy puzzle"
              >
                Easy
              </button>
              <button
                onClick={() => handleDifficultySelect('medium')}
                className="px-6 py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold text-lg transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 touch-manipulation"
                aria-label="Start medium puzzle"
              >
                Medium
              </button>
              <button
                onClick={() => handleDifficultySelect('hard')}
                className="px-6 py-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-lg transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 touch-manipulation"
                aria-label="Start hard puzzle"
              >
                Hard
              </button>
            </div>

            <p className="text-sm text-gray-600 mt-8">
              Click a difficulty to generate and play a new puzzle
            </p>
          </div>

          <p className="text-sm text-gray-600 mt-6">
            Puzzle by{' '}
            <a
              href="https://www.linkedin.com/in/lvcarlosja/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              aria-label="Visit Carlos Almeyda's LinkedIn profile"
            >
              Carlos Almeyda
            </a>
          </p>
        </div>
      </div>
      <HowToPlayModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default Home;



