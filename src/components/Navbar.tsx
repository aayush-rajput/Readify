import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleScrollTop = () => {
    window.scrollTo(0, 0);
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-slate-100 border border-slate-200 sticky top-2 z-50 w-[calc(100%-2rem)] max-w-7xl mx-auto rounded-full shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={handleScrollTop}>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Readify
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to={user ? "/courses" : "/login"} onClick={() => window.scrollTo(0, 0)}>
              <Button variant="ghost">Courses</Button>
            </Link>

            {user ? (
              <>
                <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => window.scrollTo(0, 0)}>
                  <Button variant="ghost">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/profile" onClick={() => window.scrollTo(0, 0)}>
                  <Button variant="ghost">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => window.scrollTo(0, 0)}>
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register" onClick={() => window.scrollTo(0, 0)}>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200"
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              <Link to={user ? "/courses" : "/login"} onClick={handleScrollTop}>
                <Button variant="ghost" className="w-full justify-start">
                  Courses
                </Button>
              </Link>

              {user ? (
                <>
                  <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} onClick={handleScrollTop}>
                    <Button variant="ghost" className="w-full justify-start">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/profile" onClick={handleScrollTop}>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start" onClick={() => { handleSignOut(); setIsOpen(false); }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={handleScrollTop}>
                    <Button variant="ghost" className="w-full justify-start">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={handleScrollTop}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
