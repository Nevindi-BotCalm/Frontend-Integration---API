import { useState, useEffect, useMemo } from 'react';
import { SearchBox } from '@/components/ui/search-box';
import { Users } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useUserStore, User } from '@/store/userStore';
import { UserForm } from './UserForm';
import { UserNotifications } from './UserNotifications';
import { UserDeleteDialog } from './UserDeleteDialog';
import { UserViewDialog } from './UserViewDialog';
import { BulkActions } from './BulkActions';
import { UndoNotification } from './UndoNotification';
import { getColumns } from './columns';
import { DataTablePagination } from '@/components/DataTablePagination';

export default function AddUserTable() {
  const { users, addUser, updateUser, deleteUser } = useUserStore();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // Notification states
  const [success, setSuccess] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [deleteMessage, setDeleteMessage] = useState<string>('');
  const [showNotification, setShowNotification] = useState(false);
  const [showDeleteNotification, setShowDeleteNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [showUndoNotification, setShowUndoNotification] = useState(false);
  const [undoCountdown, setUndoCountdown] = useState(5);
  const [deletedUser, setDeletedUser] = useState<User | null>(null);
  const [deletedUserIndex, setDeletedUserIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchLoading, setSearchLoading] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

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

  const columns = useMemo(() => getColumns(handleEdit, handleDelete, handleView), []);

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    table.setGlobalFilter(searchTerm);
  }, [searchTerm, table]);

  const handleBulkDelete = () => {
    const selectedIndices = Object.keys(rowSelection).map(Number);
    if (
      confirm(`Are you sure you want to delete ${selectedIndices.length} users?`)
    ) {
      const count = selectedIndices.length;
      selectedIndices.forEach((index) => deleteUser(index));
      setRowSelection({});
      setDeleteMessage(`${count} users deleted successfully!`);
      setShowDeleteNotification(true);

      setTimeout(() => {
        setShowDeleteNotification(false);
        setDeleteMessage('');
      }, 3000);
    }
  };

  const handleCopyEmails = () => {
    const selectedIndices = Object.keys(rowSelection).map(Number);
    navigator.clipboard.writeText(
      selectedIndices
        .map((index) => users[index].email)
        .join(', ')
    );
  };

  const handleFormSubmit = (userData: User) => {
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
        setUndoCountdown((prev) => prev - 1);
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

  const handleSearchChange = (value: string) => {
    setSearchLoading(true);

    setTimeout(() => {
      setSearchTerm(value);
      setSearchLoading(false);
    }, 300);
  };

  return (
    <div className="relative min-h-screen">
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
            selectedUsers={new Set(Object.keys(rowSelection).map(Number))}
            users={users}
            onBulkDelete={handleBulkDelete}
            onCopyEmails={handleCopyEmails}
          />

          <div className="ml-auto w-72">
            <SearchBox
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearchChange}
              loading={searchLoading}
              className="w-full"
            />
          </div>
        </div>

        <div className="relative mt-6 px-6">
          {searchLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Loading size="sm" />
                <span className="text-muted-foreground text-sm">
                  Searching...
                </span>
              </div>
            </div>
          )}
          <div className="rounded-md border h-[calc(100vh-450px)] overflow-hidden overflow-y-auto">
            <Table className="relative">
              <TableHeader className="sticky top-0 z-10 bg-white">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="py-4">
            <DataTablePagination table={table} />
          </div>
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
