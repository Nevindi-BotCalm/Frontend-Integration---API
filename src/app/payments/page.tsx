// import { useState, useEffect } from 'react';
// import { columns, User } from './columns';
// import { DataTable } from './data-table';

// async function getData(): Promise<User[]> {
//   const response = await fetch('https://dummyjson.com/users?limit=208');
//   const data = await response.json();
//   return data.users;
// }

// export default function DemoPage() {
//   const [data, setData] = useState<User[]>([]);

//   useEffect(() => {
//     getData().then(setData);
//   }, []);

//   return (
//     <div className="container mx-auto px-25 py-10">
//       <h1> Dummy Json - Users</h1>
//       <DataTable columns={columns} data={data} />
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { columns, User } from './columns';
import { DataTable } from './data-table';
import { Users, Database } from 'lucide-react';

async function getData(): Promise<User[]> {
  const response = await fetch('https://dummyjson.com/users?limit=208');
  const data = await response.json();
  return data.users;
}

export default function DemoPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData().then((users) => {
      setData(users);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-blob absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-200 opacity-30 mix-blend-multiply blur-xl filter"></div>
        <div className="animate-blob animation-delay-2000 absolute top-40 right-10 h-72 w-72 rounded-full bg-purple-200 opacity-30 mix-blend-multiply blur-xl filter"></div>
        <div className="animate-blob animation-delay-4000 absolute -bottom-8 left-1/2 h-72 w-72 rounded-full bg-pink-200 opacity-30 mix-blend-multiply blur-xl filter"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="mb-4 flex items-center gap-3">
        
              <Database className="h-8 w-8 text-white" />
            </div>

            <h1 className="text-5xl font-bold text-slate-800">
              User Dashboard
            </h1>
          </div>

          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                title: 'Total Users',
                value: loading ? '...' : data.length,
                icon: <Users className="h-6 w-6 text-blue-600" />,
                bgColor: 'bg-blue-100',
              },
              {
                title: 'Data Source',
                value: 'DummyJSON',
                icon: <Database className="h-6 w-6 text-indigo-600" />,
                bgColor: 'bg-indigo-100',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {item.title}
                    </p>
                    <p
                      className={`mt-1 ${item.title === 'Total Users' ? 'text-3xl' : 'text-xl'} font-bold text-slate-800`}
                    >
                      {item.value}
                    </p>
                  </div>
                  <div className={`rounded-xl ${item.bgColor} p-3`}>
                    {item.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Data Table Section */}
        <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-sm">
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-800">
              <Users className="h-6 w-6 text-blue-600" />
              User Directory
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Browse and manage all registered users
            </p>
          </div>

          <div className="p-6 px-12">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                <p className="mt-4 font-medium text-slate-600">
                  Loading user data...
                </p>
              </div>
            ) : (
              <DataTable columns={columns} data={data} />
            )}
          </div>
        </div>
      </div>

  );
}
