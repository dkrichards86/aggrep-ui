import { createReducer, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk'

import { 
    STORE_POSTS, ADD_FILTER, REMOVE_FILTER, SET_LOADING, LOGIN, LOGOUT, STORE_USER,
    UPDATE_HYDRATING, STORE_USER_CATEGORIES, STORE_USER_SOURCES, STORE_SOURCES, STORE_CATEGORIES,
    UPDATE_ALERT, STORE_USER_BOOKMARKS, BULK_SET_FILTERS
} from './reducer_types';
import { DEFAULT_SORT, DEFAULT_PER_PAGE } from '../constants';
import { loadSetting, removeSetting, saveSetting } from 'store/storage';
import { AppStateType, FilterValueType, FiltersType } from 'store/types';

const defaultFilters:FiltersType = {
    endpoint: 'posts',
    slug: null,
    page: 1,
    per_page: loadSetting('per_page') || DEFAULT_PER_PAGE,
    sort: loadSetting('sort') || DEFAULT_SORT,
};

export const initialState:AppStateType = {
    auth: loadSetting('auth'),
    filters: {
        endpoint: 'posts',
        slug: null,
        page: 1,
        per_page: loadSetting('per_page') || DEFAULT_PER_PAGE,
        sort: loadSetting('sort') || DEFAULT_SORT,
    },
    loading: true,
    hydrating: true,
    posts: {
        items: [],
        total_pages: 1,
        total_items: 0,
        per_page: 20,
        page: 1,
        title: "Posts",
    },
    sources: [],
    categories: [],
    user: {
        categories: [],
        sources: [],
        bookmarks: [],
    },
    alert: null
};

const rootReducer = createReducer(initialState, {
    [UPDATE_HYDRATING]: (state, action) => {
        state.hydrating = action.payload;
    },
    [STORE_POSTS]: (state, action) => {
        state.posts = action.payload;
    },
    [STORE_SOURCES]: (state, action) => {
        state.sources = action.payload;
    },
    [STORE_CATEGORIES]: (state, action) => {
        state.categories = action.payload;
    },
    [ADD_FILTER]: (state, action) => {
        state.filters[action.payload.key] = action.payload.value;
    },
    [REMOVE_FILTER]: (state, action) => {
        state.filters[action.payload] = null;
    },
    [BULK_SET_FILTERS]: (state, action) => {
        const filters:FiltersType = {...defaultFilters};
        action.payload.forEach((o:FilterValueType) => filters[o.key] = o.value);
        state.filters = filters;
    },
    [SET_LOADING]: (state, action) => {
        state.loading = action.payload;
    },
    [LOGOUT]: (state) => {
        removeSetting('auth');
        state.auth = null;
    },
    [LOGIN]: (state, action) => {
        saveSetting('auth', action.payload);
        state.auth = action.payload;
    },
    [STORE_USER]: (state, action) => {
        state.user = action.payload;
    },
    [STORE_USER_CATEGORIES]: (state, action) => {
        state.user.categories = action.payload;
    },
    [STORE_USER_SOURCES]: (state, action) => {
        state.user.sources = action.payload;
    },
    [STORE_USER_BOOKMARKS]: (state, action) => {
        state.user.bookmarks = action.payload;
    },
    [UPDATE_ALERT]: (state, action) => {
        state.alert = action.payload;
    },
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export default rootReducer;
