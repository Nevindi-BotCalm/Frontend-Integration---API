import { Undo2, X } from 'lucide-react';

interface UndoNotificationProps {
  show: boolean;
  message: string;
  countdown: number;
  onUndo: () => void;
  onDismiss: () => void;
}

export function UndoNotification({
  show,
  message,
  countdown,
  onUndo,
  onDismiss,
}: UndoNotificationProps) {
  if (!show) return null;

  return (
    <div className="fixed right-4 bottom-4 left-4 z-50 flex justify-center">
      <div className="flex w-full max-w-md items-center gap-4 rounded-lg border border-gray-700 bg-gray-900 px-6 py-4 text-white shadow-2xl">
        <div className="flex-1">
          <p className="font-medium">{message}</p>
          <p className="text-sm text-gray-300">Auto-dismiss in {countdown}s</p>
        </div>

        <button
          onClick={onUndo}
          className="flex items-center gap-2 rounded bg-red-500 px-3 py-2 text-sm font-medium transition-colors hover:bg-red-900"
        >
          <Undo2 className="h-4 w-4" />
          Undo
        </button>

        <button
          onClick={onDismiss}
          className="text-gray-400 transition-colors hover:text-white"
          title="Dismiss notification"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
