export type User = {
    guid: string;
    username: string;
    displayName: string;
    email: string;
    verified?: boolean;
    following?: User[];
}