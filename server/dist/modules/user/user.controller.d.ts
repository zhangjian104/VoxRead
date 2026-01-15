import { UserService } from './user.service';
import { AuthService } from '../../auth/auth.service';
export declare class UserController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    findAll(user: User, include?: string): Promise<any>;
    getOnlineUsers(user: User): Promise<any>;
    findOne(id: string, user: User): Promise<any>;
    create(createUserDto: any, user: User): Promise<any>;
    update(id: string, updateUserDto: any, user: User, req: any, res: any): Promise<any>;
    delete(id: string, user: User): Promise<{
        success: boolean;
    }>;
    unlinkFromOpenID(id: string, user: User): Promise<{
        success: boolean;
    }>;
    getListeningSessions(id: string, page?: number, itemsPerPage?: number): Promise<any>;
    getListeningStats(id: string): Promise<any>;
}
