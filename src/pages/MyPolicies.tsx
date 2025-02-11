import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Header from '@/components/Header';
import { userService } from '@/services/apiService';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Policy {
  id: number;
  user_id: number;
  product_id: number;
  purchase_date: string;
  valid_until: string;
  status: 'pending' | 'active' | 'claimed' | 'claim_pending' | 'approved' | 'denied';
  title: string;
  description: string;
  claim_status?: 'pending' | 'accepted' | 'rejected';
}

const MyPolicies: React.FC = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch policies and ensure the response is in the expected format.
  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const data = await userService.getMyPolicies();
      console.log("Fetched policies:", data);

      // If data is not an array, log an error and show a toast.
      if (Array.isArray(data)) {
        setPolicies(data);
      } else {
        console.error("Unexpected response format:", data);
        toast.error("Invalid data received from server.");
      }
    } catch (error) {
      console.error("Error fetching policies:", error);
      toast.error("Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  // Fetch policies on component mount.
  useEffect(() => {
    console.log("Fetching policies...");
    fetchPolicies();
  }, []);

  // Log policy state changes for debugging.
  useEffect(() => {
    console.log("Policies state updated:", policies);
  }, [policies]);

  // Returns badge styles based on policy status.
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'denied':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Returns badge styles based on claim status.
  const getClaimStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleClaim = async (policyId: number) => {
    try {
      console.log("Submitting claim for policy ID:", policyId);
      console.log("going to hit ");
      await userService.submitForClaim(policyId, 5000);
      console.log(" to hit "); // Assuming 5000 is the claim amount
      toast.success("Claim submitted. Awaiting admin approval.");

      // Update the policy's claim status to "pending"
      setPolicies((prevPolicies) =>
        prevPolicies.map((policy) =>
          policy.id === policyId ? { ...policy, claim_status: 'pending' } : policy
        )
      );
    } catch (error) {
      console.error("Error submitting claim:", error);
      toast.error(error.response?.data?.error || "Failed to submit claim"); // Display the backend error message
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">My Policies</h1>
          {policies.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              You don't have any policies yet.
            </div>
          ) : (
            <div className="grid gap-6">
              {policies.map((policy) => (
                <div key={policy.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        {policy.title || "Untitled Policy"}
                      </h2>
                      <p className="text-gray-600">
                        {policy.description || "No description available"}
                      </p>
                      <p className="text-gray-600">
                        Purchased on: {new Date(policy.purchase_date).toLocaleDateString()}
                      </p>
                      {policy.valid_until && (
                        <p className="text-gray-600">
                          Valid until: {new Date(policy.valid_until).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(policy.status)}`}
                      >
                        {policy.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {/* Show "Claim Now" button only if the policy is approved and not already claimed */}
                  {policy.status === 'approved' && policy.claim_status !== 'pending' && (
                    <Button
                      onClick={() => handleClaim(policy.id)}
                      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      Claim Now
                    </Button>
                  )}
                  {/* Show pending status if claim is submitted */}
                  {policy.claim_status === 'pending' && (
                    <div className="mt-4 text-yellow-600">
                      Claim submitted. Awaiting admin approval.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyPolicies;
