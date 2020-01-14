import { useSelector as useReduxSelector, TypedUseSelectorHook, } from 'react-redux';
import { RootState } from 'store/reducers';

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export interface CategoryType {
    id: number;
    slug: string;
    title: string;
};

export interface SourceType {
    id: number;
    slug: string;
    title: string;
};

interface FeedType {
    category: CategoryType;
    source: SourceType;
};

export interface PostResponseType {
    items: Array<PostType>;
    page: number;
    per_page: number;
    total_pages: number;
    total_items: number;
    title: string;
};

export interface PostType {
    feed: FeedType;
    id: number;
    link: string;
    post_url: string;
    published_datetime: string;
    similar_count?: number;
    title: string;
    uid: string;
};

export interface AlertType {
    message: string;
    type: string;
};

export interface UserType {
    email: string;
    confirmed: boolean;
};

export interface AuthType {
    auth_token: string;
    user: UserType;
};

export interface FilterValueType {
    key: string;
    value: string | number | null | undefined;
};

export interface FiltersType {
    [key: string]: string | number | null | undefined;
    endpoint: string | null | undefined;
    slug: string | null | undefined;
    page: number | null | undefined;
    per_page: number | null | undefined;
    sort: string | null | undefined;
};

export interface UserContentPrefsType {
    categories: Array<number>;
    sources: Array<number>;
    bookmarks: Array<string>;
};

export interface AppStateType {
    auth: AuthType | null;
    filters: FiltersType;
    loading: boolean;
    hydrating: boolean;
    posts: PostResponseType;
    sources: Array<SourceType>;
    categories: Array<CategoryType>;
    user: UserContentPrefsType;
    alert: AlertType | null;
};

export interface SubmissionErrorsType {
    [key: string]: string;
};