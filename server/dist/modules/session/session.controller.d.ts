import { SessionService } from './session.service';
export declare class SessionController {
    private readonly sessionService;
    constructor(sessionService: SessionService);
    getAllWithUserData(user: User): Promise<any>;
    getLibrarySessions(user: User, libraryId: string): Promise<any>;
    delete(id: string, user: User): Promise<{
        success: boolean;
    }>;
    batchDelete(body: {
        sessions: string[];
    }, user: User): Promise<{
        success: boolean;
    }>;
    getOpenSession(id: string): Promise<any>;
    syncOpenSession(id: string, syncData: any, user: User): Promise<any>;
    closeSession(id: string, syncData: any, user: User): Promise<{
        success: boolean;
    }>;
}
