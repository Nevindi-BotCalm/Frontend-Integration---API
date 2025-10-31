import { useQuery } from '@tanstack/react-query';
import { columns, User } from './columns';
import { DataTable } from './data-table';
import { Users } from 'lucide-react';

const getData = async (): Promise<User[]> =>
  (await (await fetch('https://dummyjson.com/users?limit=208')).json()).users;

export default function DemoPage() {
  const { data = [], isLoading, error } = useQuery({ queryKey: ['users'], queryFn: getData });

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 rounded-2xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-sm">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-6">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-800">
            <Users className="h-6 w-6 text-black" /> User Directory
          </h2>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
              <p className="mt-4 font-medium text-slate-600">Loading user data...</p>
            </div>
          ) : error ? (
            <p className="text-center py-20 font-medium text-red-600">Error loading data</p>
          ) : (
            <DataTable columns={columns} data={data} />
          )}
        </div>
      </div>
    </div>
  );
}
