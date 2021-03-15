export interface ProfileState {
    authToken: string | null;
    lastAuthenticatedEmail: string;
    firstName: string;
    imageUrl: string;
}