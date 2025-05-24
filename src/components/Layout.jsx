import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useAuth } from '../hooks/useAuth';

const navigation = [
  { name: 'Home', href: '/', resource: null },
  { name: 'Admin', href: '/admin', resource: 'admin' },
  { name: 'Departments', href: '/departments', resource: 'departments' },
  { name: 'Projects', href: '/projects', resource: 'projects' },
  { name: 'Resources', href: '/resources', resource: 'resources' },
  { name: 'Schedule', href: '/schedule', resource: 'schedule' },
  { name: 'Forum', href: '/forum', resource: 'forum' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Layout({ children }) {
  const location = useLocation();
  const { isSignedIn, can, getRoleDisplayName } = useAuth();

  const filteredNavigation = navigation.filter(item => 
    !item.resource || can(item.resource, 'view')
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Disclosure as="nav" className="bg-white shadow-sm">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/" className="text-xl font-bold text-indigo-600">
                      Platform
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {filteredNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          location.pathname === item.href
                            ? 'border-indigo-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                          'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  {isSignedIn ? (
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {getRoleDisplayName()}
                      </span>
                      <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            userButtonAvatarBox: "w-8 h-8"
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <SignInButton mode="modal">
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Sign in
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Sign up
                        </button>
                      </SignUpButton>
                    </div>
                  )}
                  <div className="-mr-2 flex items-center sm:hidden">
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {filteredNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={classNames(
                      location.pathname === item.href
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700',
                      'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                    )}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              {!isSignedIn && (
                <div className="border-t border-gray-200 pb-3 pt-4">
                  <div className="space-y-1">
                    <SignInButton mode="modal">
                      <Disclosure.Button
                        as="button"
                        className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                      >
                        Sign in
                      </Disclosure.Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Disclosure.Button
                        as="button"
                        className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                      >
                        Sign up
                      </Disclosure.Button>
                    </SignUpButton>
                  </div>
                </div>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main className="py-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
} 