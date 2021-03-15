export interface ApiResponse<T> {
    ok: boolean;
    error?: string;
    data?: T;
}