
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Premium Car Insurance",
    price: 299.99,
    description: "Full coverage for your vehicle with 24/7 roadside assistance",
    image: "https://img.icons8.com/ios-glyphs/100/car--v1.png",
  },
  {
    id: 2,
    name: "Basic Car Insurance",
    price: 149.99,
    description: "Essential coverage for your daily commute",
    image: "https://img.icons8.com/ios-glyphs/100/car--v1.png",
  },
  {
    id: 3,
    name: "Family Car Insurance",
    price: 399.99,
    description: "Comprehensive coverage for multiple vehicles",
    image: "https://img.icons8.com/ios-glyphs/100/car--v1.png",
  },
  {
    id: 4,
    name: "Sport Car Insurance",
    price: 499.99,
    description: "Specialized coverage for high-performance vehicles",
    image: "https://img.icons8.com/ios-glyphs/100/car--v1.png",
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [purchasedProducts, setPurchasedProducts] = useState<number[]>([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const handlePurchase = (productId: number) => {
    if (purchasedProducts.includes(productId)) {
      toast.error("You already own this insurance policy!");
      return;
    }

    setPurchasedProducts([...purchasedProducts, productId]);
    toast.success("Insurance policy purchased successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Insurance Products</h1>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-24 w-24 dark:invert"
                  />
                </div>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-center">
                  ${product.price.toFixed(2)}
                  <span className="text-sm text-muted-foreground">/month</span>
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handlePurchase(product.id)}
                  disabled={purchasedProducts.includes(product.id)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {purchasedProducts.includes(product.id) ? "Purchased" : "Buy Now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
