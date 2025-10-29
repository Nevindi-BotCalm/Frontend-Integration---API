import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useUserStore } from '@/store/userStore';
import { UserForm } from './UserForm';
import { UserTable } from './UserTable';
import { UserNotifications } from './UserNotifications';
import { UserDeleteDialog } from './UserDeleteDialog';
import { UserViewDialog } from './UserViewDialog';
import { BulkActions } from './BulkActions';
import { UndoNotification } from './UndoNotification';

export default function AddUserTable() {
  const { users, addUser, updateUser, deleteUser } = useUserStore();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  
  // Notification states
  const [success, setSuccess] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [deleteMessage, setDeleteMessage] = useState<string>('');
  const [showNotification, setShowNotification] = useState(false);
  const [showDeleteNotification, setShowDeleteNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [showUndoNotification, setShowUndoNotification] = useState(false);
  const [undoCountdown, setUndoCountdown] = useState(5);
  const [deletedUser, setDeletedUser] = useState<any>(null);
  const [deletedUserIndex, setDeletedUserIndex] = useState<number | null>(null);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setDialogOpen(true);
  };

  const handleDelete = (index: number) => {
    setUserToDelete(index);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete !== null) {
      const userToDeleteData = users[userToDelete];
      setDeletedUser(userToDeleteData);
      setDeletedUserIndex(userToDelete);
      
      deleteUser(userToDelete);
      setDeleteMessage('User deleted successfully!');
      setShowDeleteNotification(true);
      setShowUndoNotification(true);
      setUndoCountdown(5);
      
      setTimeout(() => {
        setShowDeleteNotification(false);
        setDeleteMessage('');
      }, 3000);
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleView = (index: number) => {
    setViewingUser(users[index]);
    setViewDialogOpen(true);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(users.map((_, index) => index)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectUser = (index: number, checked: boolean) => {
    const newSelected = new Set(selectedUsers);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedUsers(newSelected);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedUsers.size} users?`)) {
      const count = selectedUsers.size;
      selectedUsers.forEach(index => deleteUser(index));
      setSelectedUsers(new Set());
      setDeleteMessage(`${count} users deleted successfully!`);
      setShowDeleteNotification(true);
      
      setTimeout(() => {
        setShowDeleteNotification(false);
        setDeleteMessage('');
      }, 3000);
    }
  };

  const handleCopyEmails = () => {
    navigator.clipboard.writeText(
      Array.from(selectedUsers).map(index => users[index].email).join(', ')
    );
  };

  const handleFormSubmit = (userData: any) => {
    if (editingIndex !== null) {
      updateUser(editingIndex, userData);
      setEditingIndex(null);
    } else {
      addUser(userData);
    }
  };

  const handleSuccess = (message: string) => {
    setSuccess(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setSuccess('');
    }, 3000);
  };

  const handleError = (message: string) => {
    setError(message);
    setShowErrorNotification(true);
    setTimeout(() => {
      setShowErrorNotification(false);
      setError('');
    }, 3000);
  };

  // Undo countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showUndoNotification && undoCountdown > 0) {
      timer = setTimeout(() => {
        setUndoCountdown(prev => prev - 1);
      }, 1000);
    } else if (undoCountdown === 0) {
      setShowUndoNotification(false);
      setDeletedUser(null);
      setDeletedUserIndex(null);
    }
    return () => clearTimeout(timer);
  }, [showUndoNotification, undoCountdown]);

  const handleUndo = () => {
    if (deletedUser && deletedUserIndex !== null) {
      addUser(deletedUser);
      setShowUndoNotification(false);
      setDeletedUser(null);
      setDeletedUserIndex(null);
      setSuccess('User restored successfully!');
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        setSuccess('');
      }, 3000);
    }
  };

  const handleUndoDismiss = () => {
    setShowUndoNotification(false);
    setDeletedUser(null);
    setDeletedUserIndex(null);
  };

  const editingUser = editingIndex !== null ? users[editingIndex] : undefined;

  return (
    <div className="min-h-screen relative">
      <UserNotifications
        showSuccess={showNotification}
        successMessage={success}
        showDelete={showDeleteNotification}
        deleteMessage={deleteMessage}
        showError={showErrorNotification}
        errorMessage={error}
      />
      
      <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-sm">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-6">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-800">
            <Users className="h-6 w-6 text-black" />
            Manualy Added User Directory
          </h2>
        </div>

        <div className="flex items-center gap-4 p-6">
          <Button className="" onClick={() => setDialogOpen(true)}>
            + Add New User
          </Button>
          
          <BulkActions
            selectedUsers={selectedUsers}
            users={users}
            onBulkDelete={handleBulkDelete}
            onCopyEmails={handleCopyEmails}
          />
        </div>
        
        <div className="mt-6 px-6">
          <UserTable
            users={users}
            selectedUsers={selectedUsers}
            sortConfig={sortConfig}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onSelectAll={handleSelectAll}
            onSelectUser={handleSelectUser}
            onSort={handleSort}
          />
        </div>
      </div>

      <UserForm
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (open) {
            setSuccess('');
            setError('');
          }
        }}
        editingUser={editingUser}
        onSubmit={handleFormSubmit}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      <UserDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />

      <UserViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        user={viewingUser}
      />

      <UndoNotification
        show={showUndoNotification}
        message={`Deleted user: ${deletedUser?.name || 'User'}`}
        countdown={undoCountdown}
        onUndo={handleUndo}
        onDismiss={handleUndoDismiss}
      />
    </div>
  );
}