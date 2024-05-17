import { ReactNode } from 'react';

export type OrderByDirection = "ASC" | "DESC";

export interface Order {
    field: string;
    order: OrderByDirection;
}

export interface User {
    user_id: number;
    username: string;
}

export interface Tag {
    tag_id: number;
    tag_name: string;
}

export interface Post {
    post_id: number;
    post_title: string;
    post_content: string;
    post_at: string;
    user: User;
    tags: Tag[];
}

export interface PostsResponse {
    totalPages: number;
    currentPage: number;
    posts: Post[];
}

export interface TagOption {
    tag_id: string;
    tag_name: string;
}


export interface CoreContextType {
    loginFunc: (username: string, password: string) => void;
    getPosts: (token: string, currentPage: number, search: string, filterTag: string, orders: Order[]) => Promise<PostsResponse>;
    getTags: (token: string) => Promise<TagOption[]>;
}


export interface CoreProviderProps {
    children: ReactNode;
}
