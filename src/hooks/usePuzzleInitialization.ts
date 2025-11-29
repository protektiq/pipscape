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

    // If no difficulty in URL, redirect to include it
    if (!difficulty) {
      console.log(`[usePuzzleInitialization] No difficulty in URL, redirecting to /play/${targetDifficulty}`);
      navigate(`/play/${targetDifficulty}`, { replace: true });
      return;
    }

    const puzzle = currentPuzzleRef.current;
    const puzzleId = puzzle?.id || null;

    // Only generate if:
    // 1. We don't have a puzzle at all (no persisted puzzle), OR
    // 2. The current puzzle's difficulty doesn't match the URL difficulty, AND
    // 3. We haven't already generated for this difficulty in this session
    // 
    // IMPORTANT: Generate new puzzle when difficulty changes, even if persisted puzzle exists
    const difficultyMismatch = puzzle && puzzle.difficulty !== targetDifficulty;
    const shouldGenerate =
      (!puzzle || difficultyMismatch) && // Generate if no puzzle OR difficulty mismatch
      lastRequestedDifficulty.current !== targetDifficulty;
    
    console.log(`[usePuzzleInitialization] Difficulty check:`, {
      urlDifficulty: difficulty,
      targetDifficulty,
      currentPuzzleDifficulty: puzzle?.difficulty,
      difficultyMismatch,
      lastRequested: lastRequestedDifficulty.current,
      shouldGenerate,
    });

    if (shouldGenerate) {
      console.log(`[usePuzzleInitialization] Generating puzzle for ${targetDifficulty}`, {
        lastRequested: lastRequestedDifficulty.current,
        hasPuzzle: !!puzzle,
        puzzleId,
        lastPuzzleId: lastPuzzleId.current,
        currentPuzzleDifficulty: puzzle?.difficulty,
        urlDifficulty: difficulty,
      });
      
      lastRequestedDifficulty.current = targetDifficulty;
      // Don't set lastPuzzleId yet - wait until puzzle is generated
      
      // If difficulty mismatch, clear the old puzzle first by setting it to null
      // This ensures the UI doesn't show the wrong puzzle while generating
      if (difficultyMismatch && puzzle) {
        console.log(`[usePuzzleInitialization] Clearing puzzle with difficulty ${puzzle.difficulty} before generating ${targetDifficulty}`);
        // We can't directly set the puzzle to null here, but the generatePuzzle will replace it
      }
      
      // Generate IMMEDIATELY - no delays, no deferring
      void generatePuzzleRef.current(targetDifficulty).then(() => {
        // Update puzzle ID after successful generation
        const newPuzzle = currentPuzzleRef.current;
        if (newPuzzle) {
          lastPuzzleId.current = newPuzzle.id;
          console.log(`[usePuzzleInitialization] Puzzle generated successfully:`, {
            id: newPuzzle.id,
            difficulty: newPuzzle.difficulty,
            targetDifficulty,
          });
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
        urlDifficulty: difficulty,
      });
    }
    // Only depend on URL params, not currentPuzzle to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, id, navigate]);
};

