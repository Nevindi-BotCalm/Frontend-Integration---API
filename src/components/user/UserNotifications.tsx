import { CheckCircle, Trash2 } from 'lucide-react';

interface UserNotificationsProps {
  showSuccess: boolean;
  successMessage: string;
  showDelete: boolean;
  deleteMessage: string;
  showError: boolean;
  errorMessage: string;
}

export function UserNotifications({
  showSuccess,
  successMessage,
  showDelete,
  deleteMessage,
  showError,
  errorMessage,
}: UserNotificationsProps) {
  return (
    <>
      {/* Success Notification */}
      {showSuccess && successMessage && (
        <div className="animate-in slide-in-from-right-full fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-green-500 px-4 py-3 text-white shadow-lg">
          <CheckCircle className="h-5 w-5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Delete Notification */}
      {showDelete && deleteMessage && (
        <div className="animate-in slide-in-from-right-full fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-white shadow-lg">
          <Trash2 className="h-5 w-5" />
          <span>{deleteMessage}</span>
        </div>
      )}

      {/* Error Notification */}
      {showError && errorMessage && (
        <div className="animate-in slide-in-from-right-full fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-white shadow-lg">
          <span>{errorMessage}</span>
        </div>
      )}
    </>
  );
}
