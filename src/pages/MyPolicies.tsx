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
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);

  // Fetch policies and ensure the response is in the expected format.
  const fetchPolicies = async () => {
    try {
      const response = await userService.getMyPolicies();
      // Ensure response is an array
      if (Array.isArray(response)) {
        setPolicies(response);
      } else {
        console.error('Invalid policies response:', response);
        setPolicies([]);
      }
    } catch (error) {
      console.error("Failed to fetch policies:", error);
      toast.error("Failed to load policies");
      setPolicies([]); // Reset to empty array
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

  // Add these logs temporarily
  console.log('Policies state:', policies);
  console.log('Loading state:', loading);

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
      
      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">My Policies</h1>

          {policies.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No policies found
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              {policies.map((policy) => (
                <div key={policy.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Policy #{policy.id}
                      </h3>
                      <p className="text-gray-600">
                        Purchased: {new Date(policy.purchase_date).toLocaleDateString()}
                      </p>
                      {policy.valid_until && (
                        <p className="text-gray-600">
                          Valid until: {new Date(policy.valid_until).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      policy.policy_status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {policy.policy_status?.toUpperCase() || 'UNKNOWN STATUS'}
                    </span>
                  </div>

                  {policy.claim_status && (
                    <div className={`mt-4 p-3 rounded-lg ${
                      policy.claim_status === 'approved' ? 'bg-green-50 text-green-700' :
                      policy.claim_status === 'denied' ? 'bg-red-50 text-red-700' :
                      'bg-yellow-50 text-yellow-700'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span>
                          Claim Status: {policy.claim_status.toUpperCase()}
                          {policy.claim_date && (
                            <span className="block text-sm mt-1 text-opacity-75">
                              Submitted: {new Date(policy.claim_date).toLocaleDateString()}
                            </span>
                          )}
                        </span>
                        {policy.claim_amount && (
                          <span className="font-semibold">
                            ₹{Number(policy.claim_amount).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {!policy.claim_status && policy.policy_status === 'approved' && (
                    <Button
                      onClick={() => handleClaim(policy.id)}
                      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors w-full sm:w-auto"
                      disabled={isClaiming}
                    >
                      {isClaiming ? 'Submitting Claim...' : 'Claim Now'}
                    </Button>
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
