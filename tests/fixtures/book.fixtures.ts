import { PrintTypeEnum } from "@/src/domain/interfaces/book.interfaces";
import { BookEntity } from "@domain/entities/book.entity";

export const bookObj = {
    id: 1,
    apiBookId: "abc123",
    title: "Understanding TypeScript",
    subtitle: "A Practical Guide",
    authors: ["Maximilian Schwarzmüller"],
    description: "A comprehensive guide to TypeScript for beginners and advanced developers.",
    pageCount: 450,
    publishedDate: new Date("2021-06-15"),
    coverImageUrl: "https://example.com/covers/typescript-guide.jpg",
    categories: ["Programming", "Web Development", "TypeScript"],
    averageRating: 4.7,
    reviewCount: 128,
    deletedAt: null
};

export const bookEntity = BookEntity.fromObject(bookObj);
export const mockBookPrisma = {...bookObj};

export const searchingResponse = {
    page: 1,
    maxResults: 20,
    books: [
        {
            id: "bk001",
            title: "Clean Code",
            authors: ["Robert C. Martin"],
            imageCover: "https://example.com/images/clean-code.jpg"
        },
        {
            id: "bk002",
            title: "You Don't Know JS",
            authors: ["Kyle Simpson"]
        },
        {
            id: "bk003",
            title: "The Pragmatic Programmer",
            authors: ["Andrew Hunt", "David Thomas"],
            imageCover: "https://example.com/images/pragmatic-programmer.jpg"
        }
    ]
};

export const createBookDtoObj = {
    apiBookId: "js456",
    title: "JavaScript: The Definitive Guide",
    subtitle: null,
    authors: ["David Flanagan"],
    description: "A deep dive into JavaScript, covering both fundamentals and advanced topics for serious developers.",
    publishedDate: new Date("2020-05-25"),
    coverImageUrl: "https://example.com/images/js-definitive-guide.jpg",
    categories: ["Programming", "JavaScript", "Web Development"],
    averageRating: 4.5,
    reviewCount: 342,
    pageCount: 1096
};

export const searchBookDtoObj = {
    searchText: 'clean code',
    page: 1,
    printType: PrintTypeEnum.Books,
    maxResults: 10,
};