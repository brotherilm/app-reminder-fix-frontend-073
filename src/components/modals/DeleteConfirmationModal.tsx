// Modal Component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="border-4 border-yellow-300 p-6 rounded-lg shadow-xl w-96 bg-black">
        <h2 className="text-xl font-bold mb-4 text-center">Konfirmasi Hapus</h2>
        <p className="mb-6 text-center">
          Apakah Anda yakin ingin menghapus airdrop ini?
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-yellow-300 border border-yellow-300"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-yellow-300 text-black rounded hover:bg-yellow-400"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
