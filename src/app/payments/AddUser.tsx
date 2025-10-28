// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";

// import { Input } from "@/components/ui/input";

// interface User {
//   name: string;
//   email: string;
// }

// export default function AddUserTable() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [name, setName] = useState<string>("");
//   const [email, setEmail] = useState<string>("");

//   const handleSubmit = () => {
//     if (name && email) {
//       setUsers([...users, { name, email }]);
//       setName("");
//       setEmail("");
//     }
//   };

//   return (
//     <div className="p-4">
//       {/* Add User Dialog */}
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button>Add User</Button>
//         </DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Add New User</DialogTitle>
//             <DialogDescription>
//               Enter the details of the new user
//             </DialogDescription>
//           </DialogHeader>

//           <div className="grid gap-4 py-4">
//             <Input
//               placeholder="Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <Input
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <DialogFooter>
//             <Button onClick={handleSubmit}>Submit</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Users Table */}
//       <table className="w-full mt-6 border-collapse border border-gray-300">
//         <thead>
//           <tr>
//             <th className="border p-2">Name</th>
//             <th className="border p-2">Email</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user, index) => (
//             <tr key={index}>
//               <td className="border p-2">{user.name}</td>
//               <td className="border p-2">{user.email}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import { useState } from 'react';
import { Users, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/userStore';
import { z } from 'zod';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Edit,
  MoreHorizontal,
  ArrowUpDown,
  Eye,
} from 'lucide-react';
import { format } from 'date-fns';

{
  /* User Table */
}
export default function AddUserTable() {
  const { users, addUser, updateUser, deleteUser } = useUserStore();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<any>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [gender, setGender] = useState<string>('Male');
  const [department, setDepartment] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [birthday, setBirthday] = useState<Date>();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showNotification, setShowNotification] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string>('');
  const [showDeleteNotification, setShowDeleteNotification] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  {
    /* Add User Dialog */
  }

  const validateField = (field: string, value: any) => {
    const schemas = {
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Please enter a valid email'),
      gender: z.string().min(1, 'Gender is required'),
      department: z.string().min(1, 'Department is required'),
      phone: z.string().min(10, 'Phone must be at least 10 characters'),
      birthday: z.date(),
    };

    try {
      schemas[field as keyof typeof schemas].parse(value);
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFieldErrors((prev) => ({
          ...prev,
          [field]: error.issues[0].message,
        }));
      }
    }
  };

  const userSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    gender: z.string().min(1, 'Gender is required'),
    department: z.string().min(1, 'Department is required'),
    phone: z.string().min(10, 'Phone must be at least 10 characters'),
    birthday: z.date(),
  });

  {
    /* Users Table */
  }

  const handleEdit = (index: number) => {
    const user = users[index];
    setName(user.name);
    setEmail(user.email);
    setGender(user.gender);
    setDepartment(user.department);
    setPhone(user.phone);
    setIsActive(user.isActive);
    setBirthday(new Date(user.startDate));
    setEditingIndex(index);
    setDialogOpen(true);
  };

  const handleDelete = (index: number) => {
    setUserToDelete(index);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete !== null) {
      deleteUser(userToDelete);
      setDeleteMessage('User deleted successfully!');
      setShowDeleteNotification(true);
      
      // Hide notification after 3 seconds
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

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aValue = a[key as keyof typeof a];
    const bValue = b[key as keyof typeof b];
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSubmit = () => {
    // Progressive validation - check fields in order
    if (!name || name.length < 2) {
      setError('Name is required and must be at least 2 characters');
      setSuccess('');
      return;
    }
    if (!email) {
      setError('Email is required');
      setSuccess('');
      return;
    }
    if (!z.string().email().safeParse(email).success) {
      setError('Please enter a valid email');
      setSuccess('');
      return;
    }
    if (!gender) {
      setError('Gender is required');
      setSuccess('');
      return;
    }
    if (!department) {
      setError('Department is required');
      setSuccess('');
      return;
    }
    if (!phone || phone.length < 10) {
      setError('Phone is required and must be at least 10 characters');
      setSuccess('');
      return;
    }
    if (!birthday) {
      setError('Birthday is required');
      setSuccess('');
      return;
    }

    // If validation passes, proceed with submission
    const userData = {
      name,
      email,
      gender,
      department,
      phone,
      isActive,
      startDate: birthday ? format(birthday, 'yyyy-MM-dd') : '',
    };

    if (editingIndex !== null) {
      updateUser(editingIndex, userData);
      setEditingIndex(null);
    } else {
      addUser(userData);
    }
    
    // Clear form and close dialog only on success
    setName('');
    setEmail('');
    setGender('Male');
    setDepartment('');
    setPhone('');
    setIsActive(true);
    setBirthday(undefined);
    setError('');
    setFieldErrors({});
    
    const successMessage = editingIndex !== null
      ? 'User updated successfully!'
      : 'User added successfully!';
    
    setSuccess(successMessage);
    setShowNotification(true);
    setDialogOpen(false);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
      setSuccess('');
    }, 3000);
  };

  return (
    <div className="min-h-screen relative">
      {/* Success Notification */}
      {showNotification && success && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right-full">
          <CheckCircle className="h-5 w-5" />
          <span>{success}</span>
        </div>
      )}
      
      {/* Delete Notification */}
      {showDeleteNotification && deleteMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right-full">
          <Trash2 className="h-5 w-5" />
          <span>{deleteMessage}</span>
        </div>
      )}
      {/* Add User Dialog */}
      <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-sm">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-6"></div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (open) {
            setSuccess('');
            setError('');
          }
        }}>
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-800">
              <Users className="h-6 w-6 text-black" />
              Manualy Added User Directory
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <DialogTrigger asChild>
              <Button className="ml-10">+ Add New User</Button>
            </DialogTrigger>
            
            {selectedUsers.size > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Bulk Actions ({selectedUsers.size})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    if (confirm(`Are you sure you want to delete ${selectedUsers.size} users?`)) {
                      const count = selectedUsers.size;
                      selectedUsers.forEach(index => deleteUser(index));
                      setSelectedUsers(new Set());
                      setDeleteMessage(`${count} users deleted successfully!`);
                      setShowDeleteNotification(true);
                      
                      // Hide notification after 3 seconds
                      setTimeout(() => {
                        setShowDeleteNotification(false);
                        setDeleteMessage('');
                      }, 3000);
                    }
                  }}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    navigator.clipboard.writeText(
                      Array.from(selectedUsers).map(index => users[index].email).join(', ')
                    );
                  }}>
                    Copy Emails
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingIndex !== null ? 'Edit User' : 'Add New User'}
              </DialogTitle>
              <DialogDescription>
                {editingIndex !== null
                  ? 'Update the user details'
                  : 'Enter the details of the new user'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      validateField('name', e.target.value);
                    }}
                  />
                  {fieldErrors.name && (
                    <p className="text-sm text-red-500">{fieldErrors.name}</p>
                  )}
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input
                    placeholder="user@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateField('email', e.target.value);
                    }}
                  />
                  {fieldErrors.email && (
                    <p className="text-sm text-red-500">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Gender</Label>
                  <Select
                    value={gender}
                    onValueChange={(value) => {
                      setGender(value);
                      validateField('gender', value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldErrors.gender && (
                    <p className="text-sm text-red-500">{fieldErrors.gender}</p>
                  )}
                </div>
                <div>
                  <Label>Department</Label>
                  <Select
                    value={department}
                    onValueChange={(value) => {
                      setDepartment(value);
                      validateField('department', value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="HR">Human Resources</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldErrors.department && (
                    <p className="text-sm text-red-500">
                      {fieldErrors.department}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    placeholder="+1 (555) 123-4567"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      validateField('phone', e.target.value);
                    }}
                  />
                  {fieldErrors.phone && (
                    <p className="text-sm text-red-500">{fieldErrors.phone}</p>
                  )}
                </div>
                <div>
                  <Label>Birthday</Label>
                  <Input
                    type="date"
                    value={birthday ? format(birthday, 'yyyy-MM-dd') : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : undefined;
                      setBirthday(date);
                      if (date) validateField('birthday', date);
                    }}
                  />
                  {fieldErrors.birthday && (
                    <p className="text-sm text-red-500">
                      {fieldErrors.birthday}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={isActive}
                  onCheckedChange={(checked) => setIsActive(checked as boolean)}
                />
                <Label htmlFor="active">Active User</Label>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && <p className="text-sm text-green-500">{success}</p>}
            </div>

            <DialogFooter>
              <Button onClick={handleSubmit}>
                {editingIndex !== null ? 'Update' : 'Submit'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View User Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {viewingUser && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name:</Label> {viewingUser.name}
                  </div>
                  <div>
                    <Label>Email:</Label> {viewingUser.email}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Gender:</Label> {viewingUser.gender}
                  </div>
                  <div>
                    <Label>Department:</Label> {viewingUser.department}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Phone:</Label> {viewingUser.phone}
                  </div>
                  <div>
                    <Label>Birthday:</Label> {viewingUser.startDate}
                  </div>
                </div>
                <div>
                  <Label>Status:</Label>{' '}
                  {viewingUser.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Yes, Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Users Table */}
        <div className="mt-6 px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedUsers.size === users.length && users.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('name')}
                    className="h-8 p-0 font-medium"
                  >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('email')}
                    className="h-8 p-0 font-medium"
                  >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('gender')}
                    className="h-8 p-0 font-medium"
                  >
                    Gender
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('department')}
                    className="h-8 p-0 font-medium"
                  >
                    Department
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Birthday</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.has(index)}
                      onCheckedChange={(checked) =>
                        handleSelectUser(index, checked as boolean)
                      }
                      aria-label="Select row"
                    />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>{user.startDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(index)}
                        className="h-8 px-2"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(index)}
                        className="h-8 px-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(index)}
                        className="h-8 px-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="text-muted-foreground mt-4 text-sm">
            {selectedUsers.size} of {users.length} users selected
          </div>
        </div>
      </div>
    </div>
  );
}
