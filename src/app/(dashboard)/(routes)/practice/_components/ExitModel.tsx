import { Button } from "@/components/newFlow/ui/buttons";
import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-80">
        <h2 className="text-lg font-semibold mb-4">
          Are you sure you want to exit?
        </h2>
        <div className="flex justify-end gap-3 mt-10">
          <Button variant="secondary" onClick={onClose} className="py-2 px-4">
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm} className="py-2 px-4">
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
