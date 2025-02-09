import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart, LogOut, Home, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  reviews: Review[];
}

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Premium Health Insurance",
    price: 12000,
    description: "Complete health coverage with maximum claim amount of ₹10,00,000",
    image: "https://img.icons8.com/ios-glyphs/100/car--v1.png",
    reviews: [
      {
        id: 1,
        name: "Keshav Lohiya",
        rating: 5,
        comment: "Best health insurance I've ever had. The claim process was very smooth!",
        date: "2024-02-01"
      },
      {
        id: 2,
        name: "Harshit Joshi",
        rating: 4,
        comment: "Great coverage for the whole family. Highly recommended.",
        date: "2024-01-28"
      }
    ]
  },
  {
    id: 2,
    name: "Basic Health Insurance",
    price: 6000,
    description: "Essential health coverage with claim amount up to ₹10,00,000",
    image: "https://img.icons8.com/ios-glyphs/100/car--v1.png",
    reviews: [
      {
        id: 3,
        name: "Naina Wahi",
        rating: 5,
        comment: "Perfect for basic coverage. Very affordable!",
        date: "2024-02-03"
      }
    ]
  },
  // ... keep existing code (other products)
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [purchasedProducts, setPurchasedProducts] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [endDate, setEndDate] = useState<Date>();
  const [medicalHistory, setMedicalHistory] = useState("");
  const [age, setAge] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const handlePurchase = (product: Product) => {
    setSelectedProduct(product);
  };

  const confirmPurchase = () => {
    if (!selectedProduct || !endDate || !medicalHistory || !age) {
      toast.error("Please fill in all required information");
      return;
    }

    if (purchasedProducts.includes(selectedProduct.id)) {
      toast.error("You already own this insurance policy!");
      return;
    }

    setPurchasedProducts([...purchasedProducts, selectedProduct.id]);
    toast.success("Insurance policy purchase request sent successfully!");
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span className="font-medium">Home</span>
              </Link>
              <Link to="/policies" className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span className="font-medium">My Policies</span>
              </Link>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Insurance Products</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  ₹{product.price.toLocaleString('en-IN')}
                  <span className="text-sm text-muted-foreground">/year</span>
                </p>
                <div className="mt-4 space-y-2">
                  <h4 className="font-semibold">Customer Reviews</h4>
                  {product.reviews.map((review) => (
                    <div key={review.id} className="border-t pt-2">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">{review.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(review.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full" 
                      onClick={() => handlePurchase(product)}
                      disabled={purchasedProducts.includes(product.id)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {purchasedProducts.includes(product.id) ? "Pending Approval" : "Buy Now"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Purchase Insurance Policy</DialogTitle>
                      <DialogDescription>
                        Please provide the required information to proceed with the purchase.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="medical-history">Medical History</Label>
                        <Textarea
                          id="medical-history"
                          value={medicalHistory}
                          onChange={(e) => setMedicalHistory(e.target.value)}
                          placeholder="Please provide any relevant medical history..."
                        />
                      </div>
                      <div>
                        <Label>Policy End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <Calendar className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={confirmPurchase}>Confirm Purchase</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
