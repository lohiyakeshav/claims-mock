import { useEffect, useState } from 'react';
import { userService } from '@/services/apiService';
import { toast } from 'sonner';

const MyClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await userService.getMyClaims();
        setClaims(response);
      } catch (error) {
        console.error('Failed to fetch claims:', error);
        toast.error('Failed to fetch claims');
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center py-8">My Claims</h1>
      <div className="container mx-auto px-4 py-8">
        {claims.length === 0 ? (
          <div className="text-center py-8 text-gray-600">You don't have any claims yet.</div>
        ) : (
          <div className="grid gap-6">
            {claims.map((claim) => (
              <div key={claim.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Claim ID: {claim.id}</h2>
                    <p className="text-gray-600">Claim Amount: ${claim.claimAmount}</p>
                    <p className="text-gray-600">
                      Claim Date: {claim.claimDate.toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      Status: {claim.status.toUpperCase()}
                    </p>
                    {claim.rejectionReason && (
                      <p className="text-gray-600">
                        Rejection Reason: {claim.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyClaims; 