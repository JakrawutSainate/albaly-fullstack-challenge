import { UserDTO } from "@/types/api-response";

export class AuthService {
    async login(email: string): Promise<UserDTO> {
        // Mock login - in reality would verify password hash
        if (email === "admin@albaly.com") {
            return {
                id: "admin-1",
                name: "Admin User",
                email,
                role: "ADMIN"
            }
        }
        return {
            id: "user-1",
            name: "Demo Viewer",
            email,
            role: "VIEWER"
        }
    }

    async logout() {
        // Clear session cookies etc.
        return true;
    }
}
