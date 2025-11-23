import { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { generatePuzzle } from '../engine/generator';
import type { Puzzle } from '../types/puzzle';
import { useState } from 'react';
import PrintLayout from '../components/PrintLayout';

const Print = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    try {
      const seed = searchParams.get('seed');
      const difficultyParam = searchParams.get('difficulty');
      const difficulty = (difficultyParam === 'easy' || difficultyParam === 'medium' || difficultyParam === 'hard')
        ? difficultyParam
        : 'medium';
      
      if (seed) {
        // Regenerate puzzle from seed
        const newPuzzle = generatePuzzle(difficulty, seed);
        if (newPuzzle) {
          setPuzzle(newPuzzle);
          setError(null);
        } else {
          setError('Failed to generate puzzle from seed');
        }
      } else {
        // Fallback: generate new puzzle
        const newPuzzle = generatePuzzle(difficulty);
        if (newPuzzle) {
          setPuzzle(newPuzzle);
          setError(null);
        } else {
          setError('Failed to generate puzzle');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
    }
  }, [id, searchParams, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Go back"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading puzzle...</p>
      </div>
    );
  }

  return (
    <>
      {/* Print controls - hidden when printing */}
      <div className="mb-6 print:hidden flex gap-4 fixed top-4 right-4 z-50">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Print puzzle"
        >
          Print Puzzle
        </button>
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          aria-label="Go back"
        >
          Back
        </button>
        <button
          onClick={handleGoHome}
          className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-lg font-semibold transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label="Go to homepage"
        >
          Home
        </button>
      </div>

      <PrintLayout puzzle={puzzle} />
    </>
  );
};

export default Print;
