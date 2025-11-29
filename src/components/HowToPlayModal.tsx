import { useEffect, useRef } from 'react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowToPlayModal = ({ isOpen, onClose }: HowToPlayModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus the close button when modal opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 0);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2
            id="modal-title"
            className="text-2xl font-bold text-gray-900"
          >
            How to Play
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            onKeyDown={handleKeyDown}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1 transition-colors"
            aria-label="Close modal"
            tabIndex={0}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div id="modal-description" className="px-6 py-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Objective
              </h3>
              <p className="text-gray-700">
                Place dominoes on the grid to satisfy all region rules. Each domino covers two adjacent cells, and each region has a constraint that must be satisfied (sum constraints or value equality/difference constraints).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Instructions
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Place dominoes on the grid to satisfy all region rules.</li>
                <li>Each domino covers two adjacent cells (horizontally or vertically).</li>
                <li>
                  Each region has a constraint that must be satisfied: sum ≥ value, sum ≤ value, all values equal, or all values different.
                </li>
                <li>Use all available dominoes exactly once.</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How to Play
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Select a domino from the tray on the right.</li>
                <li>Click on the first cell where you want to place the domino.</li>
                <li>Click on an adjacent cell (horizontally or vertically) to complete the placement.</li>
                <li>Use the "Check Solution" button to verify your progress.</li>
                <li>Remove a placed domino by clicking on it.</li>
              </ol>
            </div>

            <div 
              className="rounded-lg p-4"
              style={{
                backgroundColor: 'rgba(110, 160, 180, 0.3)', // sky
                border: '1px solid rgba(70, 135, 175, 0.4)',
              }}
            >
              <p 
                className="text-sm"
                style={{
                  color: 'rgb(30, 120, 150)',
                }}
              >
                <strong>Tip:</strong> Look at the region rules and constraints. Each colored region has a rule badge showing one of four constraint types: sum ≥ value (sum must be greater than or equal to), sum ≤ value (sum must be less than or equal to), all values equal (all domino values in the region must match), or all values different (all domino values in the region must be unique).
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            onKeyDown={handleKeyDown}
            className="px-6 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 touch-manipulation text-white"
            style={{
              backgroundColor: 'rgb(110, 160, 180)', // sky
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(130, 180, 200)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(110, 160, 180)';
            }}
            aria-label="Close modal"
            tabIndex={0}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowToPlayModal;

