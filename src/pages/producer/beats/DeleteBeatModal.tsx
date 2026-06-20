import { AlertTriangle } from "lucide-react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

interface DeleteBeatModalProps {
  isOpen: boolean;
  onClose: () => void;
  beatTitle: string;
  onConfirm: () => void;
}

export const DeleteBeatModal = ({ isOpen, onClose, beatTitle, onConfirm }: DeleteBeatModalProps) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Beat?"
      description={
        <p className="leading-relaxed">
          Are you sure you want to delete <span className="font-semibold text-foreground">"{beatTitle}"</span>? This action cannot be undone and will permanently remove this track and its licensing terms from your public catalog.
        </p>
      }
      confirmLabel="Delete Track"
      cancelLabel="Cancel"
      onConfirm={onConfirm}
      icon={AlertTriangle}
      variant="danger"
    />
  );
};

