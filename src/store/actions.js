import { createAction } from 'redux-actions';
import 'whatwg-fetch';
import get from 'lodash/get';
import isNil from 'lodash/isNil';

import { getConfig, postConfig, deleteConfig, fetcher, withAuthToken } from './fetch_configs';
import { BASE_URL } from '../constants';

import { 
    STORE_POSTS, ADD_FILTER, REMOVE_FILTER, SET_LOADING, LOGIN, LOGOUT, STORE_USER, UPDATE_HYDRATING,
    STORE_USER_CATEGORIES, STORE_USER_SOURCES, STORE_SOURCES, STORE_CATEGORIES, UPDATE_ALERT,
    STORE_USER_BOOKMARKS, BULK_SET_FILTERS
} from './reducer_types';

import { saveSetting } from './storage';

const INFO = 'info';
const ERROR = 'error';

export const storePosts = createAction(STORE_POSTS);
export const addFilter = createAction(ADD_FILTER);
export const removeFilter = createAction(REMOVE_FILTER);
export const bulkSetFilters = createAction(BULK_SET_FILTERS);
export const setLoading = createAction(SET_LOADING);
export const login = createAction(LOGIN);
export const logout = createAction(LOGOUT);
export const storeUser = createAction(STORE_USER);
export const storeUserCategories = createAction(STORE_USER_CATEGORIES);
export const storeUserSources = createAction(STORE_USER_SOURCES);
export const storeUserBookmarks = createAction(STORE_USER_BOOKMARKS);
export const storeCategories = createAction(STORE_CATEGORIES);
export const storeSources = createAction(STORE_SOURCES);
export const updateHydrating = createAction(UPDATE_HYDRATING);
export const updateAlert = createAction(UPDATE_ALERT);

export const hydrateStore = () => {
    return async (dispatch, getState) => {
        const state = getState();
        await dispatch(getCategories());
        await dispatch(getSources());
        if (!isNil(state.app.auth)) {
            const token = get(state.app.auth, 'access_token');
            await dispatch(getAuthTokenConfirm());
            await dispatch(hydrateUser(token));
        }
        dispatch(updateHydrating(false));
    };
};

export const hydrateUser = (token) => {
    return async (dispatch) => {
        await dispatch(getManageCategories(token));
        await dispatch(getManageSources(token));
        await dispatch(getBookmarks(token));
    };
};

export const setFilter = (key, value) => {
    return (dispatch) => {
        dispatch(addFilter({key, value}));

        // Unless we explicitly change the page, reset to page 1.
        if (key !== 'page') {
            dispatch(removeFilter('page'));
        }

        if (key === 'per_page') {
            saveSetting('per_page', value);
        }

        if (key === 'sort') {
            saveSetting('sort', value);
        }
    };
};

export const setAlert = (alert) => {
    return (dispatch) => {
        dispatch(updateAlert(alert));
    };
};

export const clearAlert = () => {
    return (dispatch) => {
        dispatch(updateAlert(null));
    };
};

export const getPosts = () => {
    return async (dispatch, getState) => {
        const state = getState();
        const filters = state.app.filters;

        dispatch(setLoading(true));

        let args = []

        if (filters.page) {
            args.push(`page=${filters.page}`);
        }

        if (filters.per_page) {
            args.push(`per_page=${filters.per_page}`);
        }

        if (filters.sort && filters.endpoint !== 'bookmarks') {
            args.push(`sort=${filters.sort}`);
        }

        let apiURL = `${BASE_URL}/${filters.endpoint}`;
        if (filters.slug) {
            apiURL += `/${filters.slug}`;
        }

        if (args.length) {
            apiURL += `?${args.join("&")}`;
        }

        const token = get(state.app.auth, 'access_token');
        try {
            const data = await fetcher(apiURL, withAuthToken(getConfig(), token));
            dispatch(storePosts(data));
            dispatch(setLoading(false));
        }
        catch (err) {
            dispatch(setLoading(false));
            dispatch(setAlert({ message: err.msg, type: ERROR }));
        }
    };
};

export const getBookmarks = (token) => {
    const apiURL = `${BASE_URL}/bookmarks/ids`;
    return async (dispatch) => {
        try {
            const data = await fetcher(apiURL, withAuthToken(getConfig(), token));
            dispatch(storeUserBookmarks(data.bookmarks));
        }
        catch (err) {
            dispatch(setAlert({ message: err.msg, type: ERROR }));
        }
    };
};

export const postBookmark = (payload) => {
    const apiURL = `${BASE_URL}/bookmarks/ids`;

    return async (dispatch, getState) => {
        const state = getState();
        const token = get(state.app.auth, 'access_token');
        try {
            const data = await fetcher(apiURL, withAuthToken(postConfig(payload), token));
            dispatch(storeUserBookmarks(data.bookmarks));
            dispatch(setAlert({ message: data.msg, type: INFO }));
        }
        catch (err) {
            dispatch(setAlert({ message: err.msg, type: ERROR }));
        }
    };
};

export const deleteBookmark = (payload) => {
    const apiURL = `${BASE_URL}/bookmarks/ids`;

    return async (dispatch, getState) => {
        const state = getState();
        const token = get(state.app.auth, 'access_token');
        try {
            const data = await fetcher(apiURL, withAuthToken(deleteConfig(payload), token));
            dispatch(storeUserBookmarks(data.bookmarks));
            dispatch(setAlert({ message: data.msg, type: INFO }));
        }
        catch (err) {
            dispatch(setAlert({ message: err.msg, type: ERROR }));
        }
    };
};

export const postView = (payload) => {
    const apiURL = `${BASE_URL}/views`;

    return async (dispatch, getState) => {
        const state = getState();
        const token = get(state.app.auth, 'access_token');
        try {
            fetcher(apiURL, withAuthToken(postConfig(payload), token));
        }
        catch (err) {}
    };
};

export const getCategories = () => {
    const apiURL = `${BASE_URL}/categories`;
    return async (dispatch) => {
        try {
            const data = await fetcher(apiURL, getConfig());
            dispatch(storeCategories(data.categories));
        }
        catch (err) {
            dispatch(logout());
            dispatch(setAlert({ message: err.msg, type: ERROR }));
        }
    };
};

export const getSources = () => {
    const apiURL = `${BASE_URL}/sources`;
    return async (dispatch) => {
        try {
            const data = await fetcher(apiURL, getConfig());
            dispatch(storeSources(data.sources));
        }
        catch (err) {
            dispatch(logout());
            dispatch(setAlert({ message: err.msg, type: ERROR }));
        }
    };
};

export const getManageCategories = (token) => {
    const apiURL = `${BASE_URL}/manage/categories`;
    return async (dispatch) => {
        try {
            const data = await fetcher(apiURL, withAuthToken(getConfig(), token));
            dispatch(storeUserCategories(data.included_categories));
        }
        catch (err) {
            dispatch(logout());
        }
    };
};

export const postMangeCategories = (payload) => {
    const apiURL = `${BASE_URL}/manage/categories`;
    return async (dispatch, getState) => {
        const state = getState();
        const token = get(state.app.auth, 'access_token');
        try {
            const data = await fetcher(apiURL, withAuthToken(postConfig(payload), token));
            dispatch(storeUserCategories(data.included_categories));
            dispatch(setAlert({ message: data.msg, type: INFO }));
        }
        catch (err) {
            dispatch(setAlert({ message: err.msg, type: ERROR }));
        }
    };
};

export const getManageSources = (token) => {
    const apiURL = `${BASE_URL}/manage/sources`;
    return async (dispatch) => {
        try {
            const data = await fetcher(apiURL, withAuthToken(getConfig(), token));
            dispatch(storeUserSources(data.included_sources));
        }
        catch (err) {
            dispatch(logout());
        }
    };
};

export const postMangeSources = (payload) => {
    const apiURL = `${BASE_URL}/manage/sources`;
    return async (dispatch, getState) => {
        const state = getState();
        const token = get(state.app.auth, 'access_token');
        try {
            const data = await fetcher(apiURL, withAuthToken(postConfig(payload), token));
            dispatch(storeUserSources(data.included_sources));
            dispatch(setAlert({ message: data.msg, type: INFO }));
        }
        catch (err) {
            dispatch(setAlert({ message: err.msg, type: ERROR }));
        }
    };
};

export const postAuthLogin = (auth) => {
    const apiURL = `${BASE_URL}/auth/login`;

    return async (dispatch) => {
        try {
            const data = await fetcher(apiURL, postConfig(auth));
            dispatch(login(data));
            await dispatch(hydrateUser(data.access_token));
            dispatch(setAlert({ message: data.msg, type: INFO }));
        }
        catch (err) {
            dispatch(setAlert({ message: err.msg, type: ERROR }));
            throw new Error(err);
        }
    };
};

export const postAuthRegister = (auth) => {
    const apiURL = `${BASE_URL}/auth/register`;

    return async (dispatch) => {
        try {
            const data = await fetcher(apiURL, postConfig(auth));
            dispatch(setAlert({ message: data.msg, type: INFO }));
        }
        catch (err) {
            dispatch(setAlert({ message: err.msg, type: ERROR }));
            throw new Error(err);
        }
    };
};

export const fetchLogout = () => {
    return (dispatch) => {
        dispatch(logout());
        dispatch(setAlert({message: 'You have successfully logged out.', type: INFO}));
    };
};

export const postAuthPasswordUpdate = (auth) => {
    const apiURL = `${BASE_URL}/auth/password/update`;

    return async (dispatch, getState) => {
        const state = getState();
        const token = get(state.app.auth, 'access_token');
        try {
            const data = await fetcher(apiURL, withAuthToken(postConfig(auth), token));
            dispatch(setAlert({ message: data.msg, type: INFO }));
        }
        catch (err) {
            dispatch(setAlert({ message: err.msg, type: ERROR }));
            throw new Error(err);
        }
    };
};

export const postAuthPasswordReset = (payload) => {
    const apiURL = `${BASE_URL}/auth/password/reset`;

    return async (dispatch) => {
        try {
            const data = await fetcher(apiURL, postConfig(payload));
            dispatch(setAlert({ message: data.msg, type: INFO }));
        }
        catch (err) {
            dispatch(setAlert({ message: err.msg, type: ERROR }));
            throw new Error(err);
        }
    };
};

export const postAuthEmailUpdate = (payload) => {
    const apiURL = `${BASE_URL}/auth/email/update`;
    return async (dispatch, getState) => {
        const state = getState();
        const token = get(state.app.auth, 'access_token');
        try {
            const data = await fetcher(apiURL, withAuthToken(postConfig(payload), token));
            dispatch(login(data.auth));
            dispatch(setAlert({ message: data.msg, type: INFO }));
        }
        catch (err) {
            dispatch(setAlert({ message: err.msg, type: ERROR }));
            throw new Error(err);
        }
    };
}

export const postAuthEmailConfirmRequest = () => {
    const apiURL = `${BASE_URL}/auth/email/confirm/request`;

    return async (dispatch, getState) => {
        const state = getState();
        const token = get(state.app.auth, 'access_token');
        try {
            const data = await fetcher(apiURL, withAuthToken(postConfig({}), token));
            dispatch(setAlert({ message: data.msg, type: INFO }));
        }
        catch (err) {
            dispatch(setAlert({ message: err.msg, type: ERROR }));
        }
    };
};

export const postAuthEmailConfirmToken = (payload) => {
    const apiURL = `${BASE_URL}/auth/email/confirm/token`;

    return async (dispatch, getState) => {
        const state = getState();
        const token = get(state.app.auth, 'access_token');
        try {
            const data = await fetcher(apiURL, withAuthToken(postConfig(payload), token));
            dispatch(setAlert({ message: data.msg, type: INFO }));
        }
        catch (err) {
            dispatch(setAlert({ message: err.msg, type: ERROR }));
        }
    };
};

export const postAuthPasswordResetConfirm = (payload) => {
    const apiURL = `${BASE_URL}/auth/password/reset/confirm`;
    return async (dispatch) => {
        try {
            const data = await fetcher(apiURL, postConfig(payload));
            dispatch(setAlert({ message: data.msg, type: INFO }));
        }
        catch (err) {
            dispatch(setAlert({ message: err.msg, type: ERROR }));
            throw new Error(err);
        }
    };
};

export const getAuthTokenConfirm = () => {
    const apiURL = `${BASE_URL}/auth/token/confirm`;
    return async (dispatch, getState) => {
        const state = getState();
        const token = get(state.app.auth, 'access_token');
        try {
            const data = await fetcher(apiURL, withAuthToken(getConfig(), token));
            await dispatch(hydrateUser(data.access_token));
            dispatch(login(data));
        }
        catch (err) {
            dispatch(logout());
            dispatch(setAlert({ message: err.msg, type: ERROR }));
        }
    };
};
