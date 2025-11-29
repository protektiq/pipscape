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
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{
          background: 'linear-gradient(to bottom right, rgba(176, 224, 230, 0.3), rgba(140, 120, 175, 0.3))',
        }}
      >
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
                className="px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 touch-manipulation text-white"
                style={{
                  backgroundColor: 'rgb(170, 135, 205)', // lilac
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(190, 155, 225)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(170, 135, 205)';
                }}
                aria-label="How to play"
              >
                How to Play
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleDifficultySelect('easy')}
                className="px-6 py-4 rounded-lg font-semibold text-lg transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 touch-manipulation text-white"
                style={{
                  backgroundColor: 'rgb(125, 155, 125)', // sage
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(145, 175, 145)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(125, 155, 125)';
                }}
                aria-label="Start easy puzzle"
              >
                Easy
              </button>
              <button
                onClick={() => handleDifficultySelect('medium')}
                className="px-6 py-4 rounded-lg font-semibold text-lg transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 touch-manipulation text-white"
                style={{
                  backgroundColor: 'rgb(240, 160, 60)', // amber
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(255, 180, 80)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(240, 160, 60)';
                }}
                aria-label="Start medium puzzle"
              >
                Medium
              </button>
              <button
                onClick={() => handleDifficultySelect('hard')}
                className="px-6 py-4 rounded-lg font-semibold text-lg transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 touch-manipulation text-white"
                style={{
                  backgroundColor: 'rgb(255, 140, 110)', // coral
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(255, 160, 135)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(255, 140, 110)';
                }}
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



