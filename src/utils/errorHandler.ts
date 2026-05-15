export const getBackendError = (err: any, fallback: string): string => {
    console.error('API Error:', err);
    
    const msg = 
      err?.response?.data?.error || 
      err?.response?.data?.message || 
      err?.response?.data?.msg ||
      err?.message;
    
    return msg && typeof msg === 'string' ? msg : fallback;
  };