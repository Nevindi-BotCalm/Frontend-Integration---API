import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <Button
          asChild
          variant={location.pathname === '/' ? 'default' : 'outline'}
        >
          <Link to="/">User Table</Link>
        </Button>
        <Button
          asChild
          variant={location.pathname === '/add-user' ? 'default' : 'outline'}
        >
          <Link to="/add-user">Add User</Link>
        </Button>
      </div>
    </nav>
  );
}
