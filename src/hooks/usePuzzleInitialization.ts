import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Puzzle } from '../types/puzzle';

interface UsePuzzleInitializationOptions {
  currentPuzzle: Puzzle | null;
  generatePuzzle: (difficulty: 'easy' | 'medium' | 'hard', seed?: string) => Promise<void>;
}

/**
 * Custom hook to handle puzzle initialization based on URL parameters
 * Handles difficulty selection and puzzle ID loading
 */
export const usePuzzleInitialization = ({
  currentPuzzle,
  generatePuzzle,
}: UsePuzzleInitializationOptions) => {
  const { difficulty, id } = useParams<{ difficulty?: string; id?: string }>();
  const navigate = useNavigate();
  const lastRequestedDifficulty = useRef<string | null>(null);
  const lastPuzzleId = useRef<string | null>(null);
  const generatePuzzleRef = useRef(generatePuzzle);
  const currentPuzzleRef = useRef(currentPuzzle);

  // Keep refs updated
  useEffect(() => {
    generatePuzzleRef.current = generatePuzzle;
  }, [generatePuzzle]);

  useEffect(() => {
    currentPuzzleRef.current = currentPuzzle;
  }, [currentPuzzle]);

  useEffect(() => {
    if (id) {
      // TODO: Load puzzle by ID (for future phases)
      // For now, if ID is provided but no puzzle, redirect to home
      const puzzle = currentPuzzleRef.current;
      if (!puzzle || puzzle.id !== id) {
        navigate('/');
      }
      return;
    }

    const targetDifficulty = difficulty
      ? (['easy', 'medium', 'hard'].includes(difficulty)
          ? (difficulty as 'easy' | 'medium' | 'hard')
          : 'medium')
      : 'medium';

    const puzzle = currentPuzzleRef.current;
    const puzzleId = puzzle?.id || null;

    // Only generate if:
    // 1. We haven't requested this difficulty yet, OR
    // 2. We don't have a puzzle, OR
    // 3. The current puzzle's difficulty doesn't match
    // AND we haven't already generated for this specific puzzle (if puzzle exists)
    const shouldGenerate =
      (lastRequestedDifficulty.current !== targetDifficulty ||
        !puzzle ||
        puzzle.difficulty !== targetDifficulty) &&
      (puzzleId === null || lastPuzzleId.current !== puzzleId);

    if (shouldGenerate) {
      console.log(`[usePuzzleInitialization] Generating puzzle for ${targetDifficulty}`, {
        lastRequested: lastRequestedDifficulty.current,
        hasPuzzle: !!puzzle,
        puzzleDifficulty: puzzle?.difficulty,
        puzzleId,
        lastPuzzleId: lastPuzzleId.current,
      });
      
      lastRequestedDifficulty.current = targetDifficulty;
      // Don't set lastPuzzleId yet - wait until puzzle is generated
      
      // Generate IMMEDIATELY - no delays, no deferring
      void generatePuzzleRef.current(targetDifficulty).then(() => {
        // Update puzzle ID after successful generation
        const newPuzzle = currentPuzzleRef.current;
        if (newPuzzle) {
          lastPuzzleId.current = newPuzzle.id;
        }
      }).catch((error) => {
        // Reset on error so user can retry
        console.error('[usePuzzleInitialization] Puzzle generation error:', error);
        lastRequestedDifficulty.current = null;
        lastPuzzleId.current = null;
      });
    } else {
      console.log(`[usePuzzleInitialization] Skipping generation for ${targetDifficulty}`, {
        lastRequested: lastRequestedDifficulty.current,
        hasPuzzle: !!puzzle,
        puzzleDifficulty: puzzle?.difficulty,
        puzzleId,
        lastPuzzleId: lastPuzzleId.current,
      });
    }
    // Only depend on URL params, not currentPuzzle to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, id, navigate]);
};

