import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart, LogOut, Home, FileText, Calendar, Heart, Car, Plane, ChevronDown, Facebook, Twitter, Linkedin, Instagram, Mail, Phone } from "lucide-react";
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
import Header from '@/components/Header';

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
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

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

  const insuranceTypes = [
    {
      title: 'Health Insurance',
      icon: <img src="https://img.icons8.com/bubbles/100/apple-health.png" className="w-12 h-12" />,
      description: "Comprehensive health coverage for you and your family"
    },
    {
      title: 'Life Insurance',
      icon: <img src="https://img.icons8.com/fluency/48/heart-with-pulse--v1.png" className="w-12 h-12" />,
      description: "Secure your family's future with our life insurance plans"
    },
    {
      title: 'Motor Insurance',
      icon: <img src="https://img.icons8.com/color/48/engine.png" className="w-12 h-12" />,
      description: 'Protect your vehicle with our motor insurance coverage'
    },
    {
      title: 'Travel Insurance',
      icon: <img src="https://img.icons8.com/ios-filled/50/coconut-cocktail.png" className="w-12 h-12" />,
      description: 'Travel worry-free with our global coverage insurance plans'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Business Owner',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
      content: "The best insurance experience I've ever had. Quick, efficient, and transparent.",
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
      content: 'Excellent customer service and competitive rates. Highly recommended!',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Teacher',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
      content: 'Made insurance simple and affordable. Great experience overall!',
      rating: 4
    }
    // ... your existing testimonials array ...
  ];

  const faqs = [
    {
      question: 'How do I file a claim?',
      answer: 'Filing a claim is easy! Simply log into your account, navigate to the claims section, and follow the step-by-step process. Our support team is available 24/7 to assist you.'
    },
    {
      question: 'What types of insurance do you offer?',
      answer: 'We offer a wide range of insurance products including life, motor, travel, health, and property insurance. Each type comes with multiple plans to suit your specific needs.'
    },
    {
      question: 'How long does it take to process a claim?',
      answer: 'Most claims are processed within 48-72 hours. However, complex cases might take longer. We keep you updated throughout the process.'
    }
    // ... your existing faqs array ...
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24">
        <section className="pt-24 pb-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Protect What Matters Most</h1>
              <p className="text-xl mb-8">Get comprehensive insurance coverage tailored to your needs</p>
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
              onClick={() => navigate('/products')}
              >
                Explore Plans
              </button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              {insuranceTypes.map((insurance, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex flex-col items-center text-center">
                    {insurance.icon}
                    <h3 className="text-xl font-semibold mt-4 mb-2">{insurance.title}</h3>
                    <p className="text-gray-600 mb-4">{insurance.description}</p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                    onClick={() => navigate('/products')}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{testimonial.content}</p>
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <div key={index} className="mb-4">
                  <button
                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                  >
                    <span className="font-semibold">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        activeAccordion === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {activeAccordion === index && (
                    <div className="p-4 bg-white border border-gray-200 rounded-b-lg">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Heart className="w-6 h-6" />
                  <span className="text-xl font-bold">InsurePro</span>
                </div>
                <p className="text-gray-400">Protecting what matters most to you.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Products</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Claims</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                <div className="space-y-2">
                  <p className="flex items-center text-gray-400">
                    <Phone className="w-4 h-4 mr-2" />
                    1-800-123-4567
                  </p>
                  <p className="flex items-center text-gray-400">
                    <Mail className="w-4 h-4 mr-2" />
                    support@insurepro.com
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Twitter className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Instagram className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center">
              <p className="text-gray-400">© 2025 Keshav Lohiya. All rights reserved.</p>
              <p className="text-gray-400 mt-2">Made with ❤️ in Noida</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
