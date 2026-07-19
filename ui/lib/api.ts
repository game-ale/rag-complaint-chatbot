import { AnalyticsData, Complaint, QuestionRequest, RAGResponse } from './types';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getAuthHeaders() {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return headers;
}

export async function askQuestion(request: QuestionRequest): Promise<RAGResponse> {
    const start = performance.now();
    const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    const elapsed = ((performance.now() - start) / 1000);
    return { ...data, response_time: elapsed };
}

export async function healthCheck(): Promise<{ status: string; message: string }> {
    try {
        const response = await fetch(`${API_URL}/`);
        if (!response.ok) throw new Error('Backend unreachable');
        return response.json();
    } catch {
        return { status: 'error', message: 'Backend is offline' };
    }
}

export async function getComplaintStats(): Promise<AnalyticsData> {
    const response = await fetch(`${API_URL}/api/complaints/stats`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
}

export async function getRecentComplaints(limit: number = 20): Promise<Complaint[]> {
    const response = await fetch(`${API_URL}/api/complaints/recent?limit=${limit}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
}

export async function getActiveModel(): Promise<string> {
    const response = await fetch(`${API_URL}/api/settings/model`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.active_model;
}

export async function setActiveModel(modelName: string): Promise<string> {
    const response = await fetch(`${API_URL}/api/settings/model`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ model_name: modelName }),
    });
    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.active_model;
}

export async function getHistory(limit: number = 50): Promise<any[]> {
    const response = await fetch(`${API_URL}/api/history?limit=${limit}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
}

export async function deleteHistory(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/history/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }
}

export async function updateProfile(name?: string, password?: string): Promise<any> {
    const body: any = {};
    if (name) body.name = name;
    if (password) body.password = password;
    
    const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
}

export async function searchComplaints(query: string, product?: string, page: number = 1): Promise<any> {
    const params = new URLSearchParams({
        q: query || "",
        page: page.toString(),
        limit: "20"
    });
    if (product) params.append("product", product);
    
    const response = await fetch(`${API_URL}/api/complaints/search?${params.toString()}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
}

export async function compareProducts(productA: string, productB: string): Promise<any> {
    const params = new URLSearchParams({ productA, productB });
    const response = await fetch(`${API_URL}/api/complaints/compare?${params.toString()}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
}

export async function getTrendsData(): Promise<any> {
    const response = await fetch(`${API_URL}/api/complaints/trends`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
}
