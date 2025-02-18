import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import Header from "@/components/Header";
import { productService } from "@/services/apiService"; // API calls for products
import { userService } from "@/services/apiService"; // API calls for purchasing policies
import LoadingSpinner from "@/components/LoadingSpinner";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState("");
  const [age, setAge] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  // **Fetch products from API on component mount**
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (error) {
        toast.error("Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  // **Handle policy purchase**
  const handlePurchase = async () => {
    if (!selectedProduct) {
      toast.error("Please select a product before purchasing");
      return;
    }

    const userId = localStorage.getItem('userId');
    console.log("Retrieved userId from localStorage:", userId); // Debug log
    if (!userId) {
      toast.error("User not logged in");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        productId: selectedProduct.id,
        startDate: new Date().toISOString().split("T")[0], // Today's date
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0], // 1 year from now
        userId: parseInt(userId, 10), // Convert userId to number
      };
      console.log("Payload:", payload); // Debug log

      const response = await userService.purchasePolicy(payload);

      if (response && response.id) { // Check if the response contains the policy details
        toast.success("Policy purchased successfully!");
        setSelectedProduct(null);
        navigate("/my-policies"); // Redirect to My Policies page
      } else {
        throw new Error("Failed to process the purchase");
      }
    } catch (error) {
      toast.error(error.message || "Failed to purchase policy");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {loading && <LoadingSpinner />}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Insurance Products</h1>

          {products.length === 0 ? (
            <p className="text-center text-gray-600">No insurance products available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <motion.div whileHover={{ scale: 1.05 }} key={product.id}>
                  <Card className="hover:shadow-lg">
                    <CardHeader>
                      <h2 className="text-xl font-semibold">{product.title}</h2>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{product.description}</p>
                      <div className="space-y-2">
                        <p className="flex items-center">
                          <span className="font-medium">Premium:</span>
                          <span className="ml-2">₹{product.premium}/year</span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium">Coverage Amount:</span>
                          <span className="ml-2">₹{product.coverage_amount}</span>
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => setSelectedProduct(product)}>
                        Buy Now
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {selectedProduct && (
  <Dialog open={true} onOpenChange={() => setSelectedProduct(null)}>
    <DialogContent>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <DialogHeader>
          <DialogTitle>Purchase {selectedProduct.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Revelant History</label>
            <Input
              required={true}
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              placeholder="Enter your revelant history"
            />
          </div>
          <div>
            <label className="block mb-2">Age</label>
            <Input
              required={true}
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
            />
          </div>
          <div>
            <label className="block mb-2">Policy End Date</label>
            <Input
              required={true}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <Button className="w-full" onClick={handlePurchase} disabled={loading}>
            {loading ? "Processing..." : `Purchase for ₹${selectedProduct.premium}`}
          </Button>
        </div>
      </motion.div>
    </DialogContent>
  </Dialog>
)}

      </motion.div>
    </div>
  );
};

export default Products;
