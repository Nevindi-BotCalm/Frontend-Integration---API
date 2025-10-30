import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Building,
  Users,
} from 'lucide-react';
import { User } from '@/store/userStore';

interface UserViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

const baseCard =
  'group flex items-center space-x-4 rounded-xl border-2 border-black bg-white p-4 transition-all duration-300 hover:shadow-lg';
const iconBox =
  'flex h-10 w-10 items-center justify-center rounded-lg bg-black transition-transform duration-300 group-hover:scale-110';
const label = 'text-xs font-semibold tracking-wider text-gray-500 uppercase';
const value = 'font-semibold text-black';

interface InfoItemProps {
  icon: React.ElementType;
  labelText: string;
  valueText: string;
}

function InfoItem({ icon: Icon, labelText, valueText }: InfoItemProps) {
  return (
    <div className={baseCard}>
      <div className={iconBox}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1">
        <p className={label}>{labelText}</p>
        <p className={value}>{valueText}</p>
      </div>
    </div>
  );
}

export function UserViewDialog({
  open,
  onOpenChange,
  user,
}: UserViewDialogProps) {
  if (!user || !open) return null;

  const infoItems = [
    { icon: Mail, labelText: 'Email', valueText: user.email },
    { icon: Phone, labelText: 'Phone', valueText: user.phone },
    { icon: Users, labelText: 'Gender', valueText: user.gender },
    { icon: Calendar, labelText: 'Birthday', valueText: user.startDate },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="relative mx-4 w-full max-w-md overflow-hidden rounded-3xl border-2 border-black bg-white shadow-[0_20px_70px_-10px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="relative overflow-hidden bg-black px-6 py-10 text-white">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl font-bold transition-all duration-300 hover:bg-white/20"
          >
            ×
          </button>
          <div className="relative z-10 flex items-center space-x-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg">
              <UserIcon className="h-10 w-10 text-black" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{user.name}</h2>
              <p className="mt-1 text-sm tracking-wide text-gray-300 uppercase">
                {user.department}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 bg-gradient-to-b from-gray-50 to-white p-6">
          {infoItems.map((item, index) => (
            <InfoItem
              key={index}
              icon={item.icon}
              labelText={item.labelText}
              valueText={item.valueText}
            />
          ))}

          {/* Status */}
          <div className={baseCard + ' justify-between'}>
            <div className="flex items-center space-x-4">
              <div className={iconBox}>
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className={label}>Status</p>
                <p className={value}>Account Status</p>
              </div>
            </div>
            <span
              className={`rounded-lg border-2 px-4 py-2 text-sm font-bold uppercase ${
                user.isActive
                  ? 'border-black bg-black text-white'
                  : 'border-black bg-white text-black'
              }`}
            >
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
