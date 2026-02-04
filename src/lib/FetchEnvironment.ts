import { QueryClient, queryOptions } from "@tanstack/react-query";

export const environmentQueryKey = ["env"] as const;

async function fetchEnvironmentFn(): Promise<EnvironmentResponse> {
    const envUrl = import.meta.env.API_ENVIRONMENT;
    const apiSecret = import.meta.env.API_ENVIRONMENT_SECRET;

    if (!envUrl) {
        throw new Error("API_ENVIRONMENT not configured");
    }

    if (!apiSecret) {
        throw new Error("API_ENVIRONMENT_SECRET not configured");
    }

    const response = await fetch(envUrl, {
        headers: {
            Authorization: `Bearer ${apiSecret}`,
            "X-API-Key": apiSecret,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: EnvironmentResponse = await response.json();

    if (!json.ok || !json.data || json.data.length === 0) {
        throw new Error("No environment data available");
    }

    return json;
}

export const environmentQueryOptions = () =>
    queryOptions({
        queryKey: environmentQueryKey,
        queryFn: async () => {
            try {
                return await fetchEnvironmentFn();
            } catch (error) {
                throw new Error(
                    `Failed to fetch environment data: ${error instanceof Error ? error.message : "Unknown error"}`
                );
            }
        },
    });

export const fetchEnvironment = async (): Promise<EnvironmentResponse> => {
    const queryClient = new QueryClient();
    return queryClient.fetchQuery(environmentQueryOptions());
};