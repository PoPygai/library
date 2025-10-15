export type Book = {
    id: string
    title:string,
    author:string,
    genre: BookGenres,
    status:BookStatus,
    pickList: PickRecord[]
}

export enum BookGenres {
    "SCI_FI"='sci-fi',
    "ADVENTURE" = 'adventure',
    "FANTASY" = 'fantasy',
    "ROMANTIC" = 'love',
    "CLASSIC" = 'classic',
    "DYSTOPIA" = "dystopia",
    "CHILDREN" = "skazki"
}

export enum BookStatus {
    "ON_STOCK" = "on_stock",
    "ON_HAND" = "on_hand",
    "REMOVED" = "removed"
}
export  type PickRecord = {
    reader:string,
    date: string,
    returnDate: string|null
}