import { AccessViewStatus, Country, CurrencyCode, ISearchFromAPIResponse, Kind, Language, Saleability, TextToSpeechPermission, Viewability } from "@domain/interfaces/apiBook.interfaces";

export const searchAPIResponseObj: ISearchFromAPIResponse = {
  kind: "books#search",
  totalItems: 3,
  items: [
    {
      kind: Kind.BooksVolume,
      id: "book1",
      etag: "etag123",
      selfLink: "https://api.example.com/book1",
      volumeInfo: {
        title: "Effective TypeScript",
        authors: ["Dan Vanderkam"],
        publisher: "O'Reilly Media",
        publishedDate: "2019-10-15",
        description: "62 specific ways to improve your TypeScript.",
        readingModes: { text: true, image: false },
        pageCount: 250,
        printType: "BOOK",
        categories: ["Programming", "TypeScript"],
        maturityRating: "NOT_MATURE",
        allowAnonLogging: true,
        contentVersion: "1.0.0",
        panelizationSummary: { containsEpubBubbles: false, containsImageBubbles: false },
        language: Language.En,
        previewLink: "https://books.example.com/effective-typescript/preview",
        infoLink: "https://books.example.com/effective-typescript/info",
        canonicalVolumeLink: "https://books.example.com/effective-typescript",
        imageLinks: {
          smallThumbnail: 'https://small-thumb.jpg',
          thumbnail: 'https://thumb.jpg'
        }
      },
      saleInfo: {
        country: Country.MX,
        saleability: Saleability.ForSale,
        isEbook: true,
        listPrice: { amount: 450, currencyCode: CurrencyCode.Mxn },
        retailPrice: { amount: 400, currencyCode: CurrencyCode.Mxn },
        buyLink: "https://store.example.com/effective-typescript"
      },
      accessInfo: {
        country: Country.MX,
        viewability: Viewability.Partial,
        embeddable: true,
        publicDomain: false,
        textToSpeechPermission: TextToSpeechPermission.Allowed,
        epub: { isAvailable: true },
        pdf: { isAvailable: false },
        webReaderLink: "https://reader.example.com/book1",
        accessViewStatus: AccessViewStatus.Sample,
        quoteSharingAllowed: true
      },
      searchInfo: {
        textSnippet: "Improve your TypeScript code with practical tips and techniques."
      }
    },
    {
      kind: Kind.BooksVolume,
      id: "book2",
      etag: "etag456",
      selfLink: "https://api.example.com/book2",
      volumeInfo: {
        title: "JavaScript: The Good Parts",
        authors: ["Douglas Crockford"],
        publisher: "O'Reilly Media",
        publishedDate: "",
        readingModes: { text: true, image: true },
        pageCount: 176,
        printType: "BOOK",
        categories: ["Programming", "JavaScript"],
        maturityRating: "NOT_MATURE",
        allowAnonLogging: false,
        contentVersion: "1.0.1",
        panelizationSummary: { containsEpubBubbles: false, containsImageBubbles: false },
        language: Language.En,
        previewLink: "https://books.example.com/js-good-parts/preview",
        infoLink: "https://books.example.com/js-good-parts/info",
        canonicalVolumeLink: "https://books.example.com/js-good-parts"
      },
      saleInfo: {
        country: Country.MX,
        saleability: Saleability.NotForSale,
        isEbook: false
      },
      accessInfo: {
        country: Country.MX,
        viewability: Viewability.NoPages,
        embeddable: false,
        publicDomain: false,
        textToSpeechPermission: TextToSpeechPermission.AllowedForAccessibility,
        epub: { isAvailable: false },
        pdf: { isAvailable: false },
        webReaderLink: "https://reader.example.com/book2",
        accessViewStatus: AccessViewStatus.None,
        quoteSharingAllowed: false
      },
      searchInfo: {
        textSnippet: "An insightful look into the elegant parts of JavaScript."
      }
    },
    {
      kind: Kind.BooksVolume,
      id: "book3",
      etag: "etag789",
      selfLink: "https://api.example.com/book3",
      volumeInfo: {
        title: "Learning TypeScript",
        subtitle: "Enhance Your JavaScript Projects",
        authors: ["Josh Goldberg"],
        publisher: "Packt Publishing",
        publishedDate: "2022-07-01",
        description: "A hands-on guide to mastering TypeScript.",
        readingModes: { text: true, image: true },
        pageCount: 350,
        printType: "BOOK",
        categories: ["Programming", "TypeScript"],
        averageRating: 4.8,
        ratingsCount: 85,
        maturityRating: "NOT_MATURE",
        allowAnonLogging: true,
        contentVersion: "1.0.2",
        panelizationSummary: { containsEpubBubbles: false, containsImageBubbles: false },
        imageLinks: {
          thumbnail: "https://images.example.com/learning-ts-thumb.jpg"
        },
        language: Language.En,
        previewLink: "https://books.example.com/learning-ts/preview",
        infoLink: "https://books.example.com/learning-ts/info",
        canonicalVolumeLink: "https://books.example.com/learning-ts"
      },
      saleInfo: {
        country: Country.MX,
        saleability: Saleability.ForSale,
        isEbook: true,
        listPrice: { amount: 520, currencyCode: CurrencyCode.Mxn },
        retailPrice: { amount: 499, currencyCode: CurrencyCode.Mxn },
        buyLink: "https://store.example.com/learning-typescript"
      },
      accessInfo: {
        country: Country.MX,
        viewability: Viewability.Partial,
        embeddable: true,
        publicDomain: false,
        textToSpeechPermission: TextToSpeechPermission.Allowed,
        epub: { isAvailable: true, acsTokenLink: "https://token.example.com/book3" },
        pdf: { isAvailable: true },
        webReaderLink: "https://reader.example.com/book3",
        accessViewStatus: AccessViewStatus.Sample,
        quoteSharingAllowed: true
      },
      searchInfo: {
        textSnippet: "Master TypeScript and build scalable, maintainable applications."
      }
    }
  ]
};