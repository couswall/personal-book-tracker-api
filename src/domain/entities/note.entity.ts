
export class NoteEntity{
    constructor(
        public id: number,
        public bookId: number,
        public userId: number,
        public content: string,
        public createdAt: Date | null,
        public updatedAt: Date | null,
        public deletedAt: Date | null,
    ){};
}