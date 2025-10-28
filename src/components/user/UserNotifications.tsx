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
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right-full">
          <CheckCircle className="h-5 w-5" />
          <span>{successMessage}</span>
        </div>
      )}
      
      {/* Delete Notification */}
      {showDelete && deleteMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right-full">
          <Trash2 className="h-5 w-5" />
          <span>{deleteMessage}</span>
        </div>
      )}
      
      {/* Error Notification */}
      {showError && errorMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right-full">
          <span>{errorMessage}</span>
        </div>
      )}
    </>
  );
}