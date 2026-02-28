
export class ReviewEntity{
    constructor(
        public id: number,
        public bookId: number,
        public userId: number,
        public content: string,
        public createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date | null,
    ){};
}