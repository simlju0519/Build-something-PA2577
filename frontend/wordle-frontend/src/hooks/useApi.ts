import { useState } from 'react';

interface FetchOptions extends RequestInit {
    body?: FormData | string | null;
    params?: Record<string, string | number | boolean>;
    isBytes?: boolean;
}

const makeApiRequest = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [responseCode, setResponseCode] = useState<number | null>(null);

    const makeAPICall = async (route: string, options?: FetchOptions) => {
        setIsLoading(true);
        setError(null);

        console.log("Making API call to: ", route);

        try {
            // Use the API_URL from the environment variable
            let baseUrl = process.env.API_URL || 'http://localhost:5001';
            let url = `${baseUrl}${route}`;
            console.log("URL: ", url);
            
            if (options?.params) {
                const queryParams = new URLSearchParams();
                for (const key in options.params) {
                    if (options.params.hasOwnProperty(key)) {
                        queryParams.append(key, String(options.params[key]));
                    }
                }
                url += `?${queryParams.toString()}`;
            }

            // Conditionally set default headers if none are provided, and the body is not FormData
            if (!options?.headers && !(options?.body instanceof FormData)) {
                options = {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
            }

            // Remove `params` from options to avoid sending it to fetch
            const { params, ...fetchOptions } = options || {};

            const res = await fetch(url, fetchOptions);

            if (!res.ok) {
                return { response: null, isLoading: false, error: res.statusText, fullResponse: res, responseCode: res.status };
            }
            
            if (options?.isBytes) {
                const data = await res.arrayBuffer();
                return { response: new Uint8Array(data), isLoading: false, error: null, fullResponse: res, responseCode: res.status };
            }
            
            const data = await res.json();

            // Directly return all needed values
            return { response: data, isLoading: false, error: null, fullResponse: res };
        } catch (err: any) {
            return { response: null, isLoading: false, error: err.message || 'An error occurred', fullResponse: null };
        } finally {
            setIsLoading(false);
        }
    };

    return { makeAPICall };
};

export default makeApiRequest;
