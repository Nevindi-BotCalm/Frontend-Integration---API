import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/store/userStore';

interface BulkActionsProps {
  selectedUsers: Set<number>;
  users: User[];
  onBulkDelete: () => void;
  onCopyEmails: () => void;
}

export function BulkActions({
  selectedUsers,
  onBulkDelete,
  onCopyEmails,
}: BulkActionsProps) {
  if (selectedUsers.size === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Bulk Actions ({selectedUsers.size})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onBulkDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Selected
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCopyEmails}>Copy Emails</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
