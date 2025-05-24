import { Link, useLocation } from 'react-router-dom';
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Public nav items for logged out users
  const publicNavItems = [
    { path: '/', label: 'Home' },
    { path: '/online-services', label: 'Online Services' },
    { path: '/about-raipur', label: 'About Raipur' },
    { path: '/complain', label: 'Complain' },
  ];

  // Full nav for logged in users
  const navItems = [
    { path: '/dashboard', label: 'Home' },
    { path: '/departments', label: 'Departments' },
    { path: '/schedule', label: 'Schedule' },
    { path: '/resources', label: 'Resources' },
    { path: '/reports', label: 'Reports' },
    { path: '/forum', label: 'Forum' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex flex-shrink-0 items-center">
            <span className="text-xl font-bold text-indigo-600">MIN</span>
          </div>

          {/* Center: Nav Buttons */}
          <div className="flex-1 flex justify-center">
            <SignedIn>
              <div className="hidden sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                      isActive(item.path)
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SignedIn>
            <SignedOut>
              <div className="hidden sm:flex sm:space-x-8">
                {publicNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                      isActive(item.path)
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SignedOut>
          </div>

          {/* Right: Auth/User */}
          <div className="flex items-center space-x-2">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-50">Login</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700">Sign Up</button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 