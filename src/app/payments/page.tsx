import { useQuery } from '@tanstack/react-query';
import { columns, User } from './columns';
import { DataTable } from './data-table';
import { Users, Database } from 'lucide-react';

async function getData(): Promise<User[]> {
  const response = await fetch('https://dummyjson.com/users?limit=208');
  const data = await response.json();
  return data.users;
}

export default function DemoPage() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getData,
  });
// const [data, setData] = useState<User[]>([]);
// const [loading, setLoading] = useState(true);

// useEffect(() => {
//   getData().then((users) => {
//     setData(users);
//     setLoading(false);
//   });
// }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-sm mt-20">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-10 h-72 w-72 rounded-full  opacity-30"></div>
        <div className="animate-blob animation-delay-2000 absolute top-40 right-10 h-72 w-72 rounded-full bg-purple-200 opacity-30 mix-blend-multiply blur-xl filter"></div>
        <div className="animate-blob animation-delay-4000 absolute -bottom-8 left-1/2 h-72 w-72 rounded-full bg-pink-200 opacity-30 mix-blend-multiply blur-xl filter"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="mb-4 flex items-center gap-3">
            <Database className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>
      {/* Data Table Section */}
      <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-sm mt-[-180px]">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-6">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-800">
            <Users className="h-6 w-6 text-black" />
            User Directory
          </h2>
        </div>

        <div className="p-6 px-12">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
              <p className="mt-4 font-medium text-slate-600">
                Loading user data...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-red-600 font-medium">Error loading data</p>
            </div>
          ) : (
            <DataTable columns={columns} data={data} />
          )}
        </div>
      </div>
    </div>
  );
}
