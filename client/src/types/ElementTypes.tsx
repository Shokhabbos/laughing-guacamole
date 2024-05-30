export type User = {
    _id:string,
    name: string,
    email: string,
    password: string,
    role: string,
    collections: Collection[],
}
export type UserManagement = {
    _id: any
    id:string,
    name: string,
    email: string,
    password: string,
    role: string,
    lstLogTime: string,
    regTime: string,
    status:string
}

export type authUser = {
    name:string,
    email: string,
    password: string
}
export type Items = {
    tags: string[]
    result: object[]
}
export type Collection = {
    _id: string,
    name:string,
    discreption:string,
    topic:string,
    image:string,
    items:object[]
}
export type Comment = {
    name: string;
    text: string;
    item_id: string;
};
export type Item = {
    _id: string;
    image: string;
    tags: string;
    name: string;
    likes: string[];
    comments: Comment[];
    additionalInfo: string;
  };
export type KeySearchResult = {
    collections: Collection[]
    comments: Comment[]
    items: Item[]
}