interface Environment {
    id: string;
    baseURL: string;
    createdAt: string;
}

interface EnvironmentResponse {
    statusCode: number;
    statusMessage: string;
    message: string;
    ok: boolean;
    data: Environment[];
}