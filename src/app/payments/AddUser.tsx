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

'use client';

import { useState } from 'react';
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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

{/* Add User Table */}
export default function AddUserTable() {
  const { users, addUser, updateUser, deleteUser } = useUserStore();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('User');
  const [department, setDepartment] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date>();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
{/* Add User Dialog */}
  const userSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    role: z.string().min(1, 'Role is required'),
    department: z.string().min(1, 'Department is required'),
    phone: z.string().min(10, 'Phone must be at least 10 characters'),
    startDate: z.date(),
  });
{/* Users Table */}
  const handleEdit = (index: number) => {
    const user = users[index];
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setDepartment(user.department);
    setPhone(user.phone);
    setIsActive(user.isActive);
    setStartDate(new Date(user.startDate));
    setEditingIndex(index);
    setDialogOpen(true);
  };

  const handleDelete = (index: number) => {
    deleteUser(index);
  };

  const handleSubmit = (closeDialog: () => void) => {
    if (!startDate) {
      setError('Start date is required');
      setSuccess('');
      return;
    }
{/* Error handling */}
    try {
      userSchema.parse({
        name,
        email,
        role,
        department,
        phone,
        startDate,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.issues[0].message);
        setSuccess('');
        return;
      }
    }

    const userData = {
      name,
      email,
      role,
      department,
      phone,
      isActive,
      startDate: startDate ? format(startDate, 'yyyy-MM-dd') : '',
    };

    if (editingIndex !== null) {
      updateUser(editingIndex, userData);
      setEditingIndex(null);
    } else {
      addUser(userData);
    }
    setName('');
    setEmail('');
    setRole('User');
    setDepartment('');
    setPhone('');
    setIsActive(true);
    setStartDate(undefined);
    setError('');
    setSuccess(
      editingIndex !== null
        ? 'User updated successfully!'
        : 'User added successfully!'
    );
    setDialogOpen(false);
    closeDialog();
  }

  return (
    <div className="min-h-screen">
      {/* Add User Dialog */}
      <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-sm">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add User</Button>
          </DialogTrigger>
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
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input
                    placeholder="user@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Developer">Developer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Department</Label>
                  <Select value={department} onValueChange={setDepartment}>
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
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    placeholder="+1 (555) 123-4567"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-9 w-full justify-start px-3 text-left text-sm font-normal"
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {startDate
                          ? format(startDate, 'MMM dd, yyyy')
                          : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                      {/* shadcn Calendar */}
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="rounded-md border-0 p-0"
                        classNames={{
                          months:
                            'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                          month: 'space-y-4',
                          caption:
                            'flex justify-center pt-1 relative items-center',
                          caption_label: 'text-sm font-medium',
                          nav: 'space-x-1 flex items-center',
                          nav_button:
                            'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                          nav_button_previous: 'absolute left-1',
                          nav_button_next: 'absolute right-1',
                          table: 'w-full border-collapse space-y-1',
                          head_row: 'flex',
                          head_cell:
                            'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
                          row: 'flex w-full mt-2',
                          cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                          day: 'h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md',
                          day_selected:
                            'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                          day_today: 'bg-accent text-accent-foreground',
                          day_outside: 'text-muted-foreground opacity-50',
                          day_disabled: 'text-muted-foreground opacity-50',
                          day_range_middle:
                            'aria-selected:bg-accent aria-selected:text-accent-foreground',
                          day_hidden: 'invisible',
                        }}
                      />
                    </PopoverContent>
                  </Popover>
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
              <DialogClose asChild>
                <Button onClick={() => handleSubmit(() => {})}>
                  {editingIndex !== null ? 'Update' : 'Submit'}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Users Table */}
        <div className="mt-6 px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
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
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
