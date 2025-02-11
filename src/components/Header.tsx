import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { userService } from '@/services/apiService';

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token'); // Check if user is logged in
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchUser = async () => {
        try {
          const userData = await userService.getUserProfile();
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
      fetchUser();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    toast('Are you sure you want to log out?', {
      action: {
        label: 'Yes',
        onClick: () => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          toast.success('Logged out successfully!');
          navigate('/login');
        },
      },
      cancel: {
        label: 'No',
        onClick: () => {},
      },
    });
  };

  return (
    <header className="bg-white shadow-sm fixed w-full z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">InsurePro</span>
          </div>
          <nav className="hidden md:flex space-x-8 justify-center flex-grow">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/products')}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Products
            </button>
            <button
              onClick={() => navigate('/my-policies')}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              My Policy
            </button>
          </nav>
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-gray-600">Hi, {user.name}!</span>
              )}
              <Button
                onClick={handleLogout}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
