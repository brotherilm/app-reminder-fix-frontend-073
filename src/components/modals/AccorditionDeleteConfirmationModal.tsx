interface AccorditionDeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  accorditionLabel: string;
}

interface Accordition {
  _id: string; // Tambahkan _id ke tipe Accordition
  accorditionLabel: string;
}

const AccorditionDeleteConfirmationModal: React.FC<
  AccorditionDeleteConfirmationModalProps
> = ({ isOpen, onClose, onConfirm, accorditionLabel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 relative  border-2 border-yellow-300">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Delete Accordition
          </h3>
          <p className="text-gray-400 mb-6">
            Are you sure you want to delete "{accorditionLabel}"? This action
            cannot be undone.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 transition-colors"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccorditionDeleteConfirmationModal;
