export interface ISearchFromAPIResponse {
    kind:       string;
    totalItems: number;
    items:      IBookFromAPI[];
}

export interface IBookFromAPI {
    kind:       Kind;
    id:         string;
    etag:       string;
    selfLink:   string;
    volumeInfo: VolumeInfo;
    saleInfo:   SaleInfo;
    accessInfo: AccessInfo;
    searchInfo: SearchInfo;
}

export interface AccessInfo {
    country:                Country;
    viewability:            Viewability;
    embeddable:             boolean;
    publicDomain:           boolean;
    textToSpeechPermission: TextToSpeechPermission;
    epub:                   Epub;
    pdf:                    Epub;
    webReaderLink:          string;
    accessViewStatus:       AccessViewStatus;
    quoteSharingAllowed:    boolean;
}

export enum AccessViewStatus {
    None = "NONE",
    Sample = "SAMPLE",
}

export enum Country {
    MX = "MX",
}

export interface Epub {
    isAvailable:   boolean;
    acsTokenLink?: string;
}

export enum TextToSpeechPermission {
    Allowed = "ALLOWED",
    AllowedForAccessibility = "ALLOWED_FOR_ACCESSIBILITY",
}

export enum Viewability {
    NoPages = "NO_PAGES",
    Partial = "PARTIAL",
}

export enum Kind {
    BooksVolume = "books#volume",
}

export interface SaleInfo {
    country:      Country;
    saleability:  Saleability;
    isEbook:      boolean;
    listPrice?:   SaleInfoListPrice;
    retailPrice?: SaleInfoListPrice;
    buyLink?:     string;
    offers?:      Offer[];
}

export interface SaleInfoListPrice {
    amount:       number;
    currencyCode: CurrencyCode;
}

export enum CurrencyCode {
    Mxn = "MXN",
}

export interface Offer {
    finskyOfferType: number;
    listPrice:       OfferListPrice;
    retailPrice:     OfferListPrice;
    giftable:        boolean;
}

export interface OfferListPrice {
    amountInMicros: number;
    currencyCode:   CurrencyCode;
}

export enum Saleability {
    ForSale = "FOR_SALE",
    NotForSale = "NOT_FOR_SALE",
}

export interface SearchInfo {
    textSnippet: string;
}

export interface VolumeInfo {
    title:                string;
    subtitle?:            string;
    authors:              string[];
    publisher:            string;
    publishedDate:        string;
    description?:         string;
    industryIdentifiers?: IndustryIdentifier[];
    readingModes:         ReadingModes;
    pageCount:            number;
    printType:            string;
    categories:           string[];
    averageRating?:       number;
    ratingsCount?:        number;
    maturityRating:       string;
    allowAnonLogging:     boolean;
    contentVersion:       string;
    panelizationSummary:  PanelizationSummary;
    imageLinks?:          ImageLinks;
    language:             Language;
    previewLink:          string;
    infoLink:             string;
    canonicalVolumeLink:  string;
}

export interface ImageLinks {
    smallThumbnail?: string;
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
    extralarge?: string
}

export interface IndustryIdentifier {
    type: string;
    identifier: string;
}

export enum Language {
    En = "en",
    Es = "es",
}

export interface PanelizationSummary {
    containsEpubBubbles:  boolean;
    containsImageBubbles: boolean;
}

export interface ReadingModes {
    text:  boolean;
    image: boolean;
}