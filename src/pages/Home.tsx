
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-8 animate-fade-in">
        <div className="flex items-center justify-center mb-8">
          <Heart className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
          Insurance Made Simple w InsurePro
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Secure your future with our comprehensive insurance solutions
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link to="/login">
            <Button size="lg" variant="default">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button size="lg" variant="outline">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
