import { Modal } from "../../components/ui/Modal";
import { Icon } from "../../components/common/Icon";

interface WhiteboardPlaceholderProps {
  open: boolean;
  onClose: () => void;
}

export function WhiteboardPlaceholder({ open, onClose }: WhiteboardPlaceholderProps) {
  return (
    <Modal open={open} onClose={onClose} title="Whiteboard" icon="draw" maxWidth="max-w-3xl">
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon name="draw" className="text-[32px]" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-on-surface mb-1.5">Whiteboard coming soon</h3>
          <p className="text-sm text-on-surface-variant max-w-sm">
            A shared drawing canvas for live problem-solving is on the roadmap for the SAT Sharks classroom.
          </p>
        </div>
      </div>
    </Modal>
  );
}
