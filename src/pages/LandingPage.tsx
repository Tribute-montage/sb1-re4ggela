import { useNavigate } from 'react-router-dom';
import { Users, Star, Clock } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { BRAND } from '../lib/theme/colors';

export function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = (type: 'client' | 'editor' | 'admin') => {
    switch (type) {
      case 'client':
        navigate('/dashboard');
        break;
      case 'editor':
        navigate('/editor');
        break;
      case 'admin':
        navigate('/admin');
        break;
    }
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="lg" />
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-indigo-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Preserve Memories Forever
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Create beautiful tribute montages to celebrate and remember your loved ones.
            </p>
          </div>
        </section>

        {/* Login Options Section */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Access Your Account
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Client Login */}
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Users className="h-12 w-12 mb-4" style={{ color: BRAND.green }} />
                <h3 className="text-xl font-semibold mb-2">Client Portal</h3>
                <p className="text-gray-600 mb-4">
                  Access your tribute projects and create new memories.
                </p>
                <button
                  onClick={() => handleLogin('client')}
                  style={{ borderColor: BRAND.green, color: BRAND.green }}
                  className="inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 w-full justify-center"
                >
                  Client Login
                </button>
              </div>

              {/* Editor Login */}
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Star className="h-12 w-12 mb-4" style={{ color: BRAND.blue }} />
                <h3 className="text-xl font-semibold mb-2">Editor Access</h3>
                <p className="text-gray-600 mb-4">
                  For video editors to manage and create tributes.
                </p>
                <button
                  onClick={() => handleLogin('editor')}
                  style={{ borderColor: BRAND.blue, color: BRAND.blue }}
                  className="inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 w-full justify-center"
                >
                  Editor Login
                </button>
              </div>

              {/* Admin Login */}
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Clock className="h-12 w-12 mb-4" style={{ color: BRAND.green }} />
                <h3 className="text-xl font-semibold mb-2">Admin Dashboard</h3>
                <p className="text-gray-600 mb-4">
                  System administration and management portal.
                </p>
                <button
                  onClick={() => handleLogin('admin')}
                  style={{ borderColor: BRAND.green, color: BRAND.green }}
                  className="inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 w-full justify-center"
                >
                  Admin Login
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Our Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2" style={{ color: BRAND.green }}>Easy to Use</h3>
                <p className="text-gray-600">
                  Simple interface for creating beautiful tributes
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2" style={{ color: BRAND.blue }}>Professional Quality</h3>
                <p className="text-gray-600">
                  High-quality video production and editing
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2" style={{ color: BRAND.green }}>Fast Delivery</h3>
                <p className="text-gray-600">
                  Quick turnaround times for your tributes
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Tribute Montage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}