export interface IReadingChallengeFromObject {
    id: number;
    userId: number;
    year: number;
    goal: number;
    createdAt: Date;
    updatedAt: Date | null;
}

export interface IReadingChallengeKey {
    userId: number;
    year: number;
}

export interface IReadingChallengeData extends IReadingChallengeKey {
    goal: number;
}

export interface ICreateReadingChallengeDto {
    year?: number | string;
    goal?: number | string;
}

export interface IUpdateReadingChallengeDto {
    year?: number | string;
    goal?: number | string;
}

export interface IReadingChallengeYearDto {
    year?: number | string;
}
