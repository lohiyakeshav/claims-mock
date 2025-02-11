import { toast } from 'sonner';

// Base URL for the API
const BASE_URL = 'http://localhost:3000/api'; // Update with your backend URL

// Helper function to handle API requests
const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  console.log("Token in fetchApi:", token); // Debug log

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`http://localhost:3000/api${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

// Auth APIs
export const authService = {
  register: async (userData: { name: string; email: string; password: string }) => {
    return fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  login: async (credentials: { email: string; password: string }) => {
    const response = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    localStorage.setItem('userId', response.userId); // Store userId in localStorage
    return response;
  },
  getProfile: async () => {
    return fetchApi('/auth/me');
  },
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
};

// User APIs
export const userService = {
  getUserProfile: async () => {
    const response = await fetchApi('/auth/me?t=' + Date.now(), { method: 'GET' });
    return response;
  },
  purchasePolicy: async (purchaseData: {
    productId: number;
    startDate: string;
    endDate: string;
    userId: number;
  }) => {
    return fetchApi('/products/buy', {
      method: 'POST',
      body: JSON.stringify(purchaseData),
    });
  },
  submitForClaim: async (policyPurchaseId: number, claimAmount: number) => {
    try {
      const response = await fetchApi('/claims/claimtriggered', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          policy_purchase_id: Number(policyPurchaseId),
          claim_amount: Number(claimAmount)
        }),
      });
      return response;
    } catch (error) {
      console.error('Claim submission failed:', error);
      throw error;
    }
  },
  fileClaim: async (claimData: { policyId: number; amount: number; description: string }) => {
    return fetchApi('/claims', {
      method: 'POST',
      body: JSON.stringify(claimData),
    });
  },
  getPolicies: async () => {
    return fetchApi('/policies');
  },
  getClaims: async () => {
    return fetchApi('/claims');
  },
  getMyPolicies: async () => {
    const response = await fetchApi('/policies/myPolicies?t=' + Date.now(), { method: 'GET' });
    return response;
  },
  getMyClaims: async () => {
    const response = await fetchApi('/claims/userClaims', { method: 'GET' });
    return response.map((claim) => ({
      id: claim.id,
      userId: claim.user_id,
      productId: claim.product_id,
      claimAmount: claim.claim_amount,
      claimDate: new Date(claim.claim_date),
      status: claim.status,
      approvedBy: claim.approved_by,
      approvedAt: claim.approved_at ? new Date(claim.approved_at) : null,
      rejectionReason: claim.rejection_reason,
    }));
  },
};

// **Insurance Product APIs**
export const productService = {
  // Get all approved insurance products
  getAllProducts: async () => {
    return fetchApi('/products');
  },

  // Submit a new insurance product
  submitProduct: async (productData: {
    title: string;
    description: string;
    coverage_amount: number;
    premium: number;
    duration: number;
  }) => {
    return fetchApi('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Approve or reject an insurance product (admin only)
  approveProduct: async (productId: number, decision: boolean, reason?: string) => {
    return fetchApi(`/products/approve/${productId}`, {
      method: 'POST',
      body: JSON.stringify({ decision, reason }),
    });
  },

  // Fetch all pending insurance products for admin approval
  getPendingProducts: async () => {
    return fetchApi('/products/pending');
  },
};

// Admin APIs
export const adminService = {
  getAllUsers: async () => {
    return fetchApi('/users');
  },
  getAllPolicies: async () => {
    return fetchApi('/policies');
  },
  getAllClaims: async () => {
    return fetchApi('/claims');
  },
  approveProduct: async (productId: number, decision: boolean, reason: string) => {
    return fetchApi(`/products/approve/${productId}`, {
      method: 'POST',
      body: JSON.stringify({ decision, reason }),
    });
  },
  getPendingApprovals: async () => {
    return fetchApi('/products/pending');
  },
  getAllTransactions: async () => {
    return fetchApi('/transactions');
  },
  getPendingPolicies: async () => {
    const response = await fetchApi("/admin/pendingPolicies", { method: "GET" });
    return response;
  },
  approvePolicy: async (policyId: number, decision: boolean) => {
    const response = await fetchApi(`/admin/approvePolicy/${policyId}`, {
      method: "POST",
      body: JSON.stringify({ decision }),
    });
    return response;
  },
  getPendingClaims: async () => {
    const response = await fetchApi("/admin/pendingClaims", { method: "GET" });
    return response;
  },
  approveClaim: async (claimId: number, decision: boolean) => {
    const response = await fetchApi(`/admin/approveClaim/${claimId}`, {
      method: "POST",
      body: JSON.stringify({ decision }),
    });
    return response;
  },
};

// Shared APIs
export const sharedService = {
  updateProfile: async (profileData: { name: string; email: string }) => {
    return fetchApi('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};



