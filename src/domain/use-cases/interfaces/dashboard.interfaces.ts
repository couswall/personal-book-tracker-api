import {IDashboard} from '@domain/interfaces/dashboard.interfaces';

export interface GetDashboardUseCase {
    execute(userId: number, now?: Date): Promise<IDashboard>;
}
