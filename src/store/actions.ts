import { createAction } from '@reduxjs/toolkit';
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

import { AppThunk } from 'store/reducers';
import { AuthType, AlertType, FilterValueType, CategoryType, SourceType, PostResponseType, UserType } from 'store/types';

const INFO = 'info';
const ERROR = 'error';

export const storePosts = createAction<PostResponseType>(STORE_POSTS);
export const addFilter = createAction<FilterValueType>(ADD_FILTER);
export const removeFilter = createAction<string>(REMOVE_FILTER);
export const bulkSetFilters = createAction<Array<FilterValueType>>(BULK_SET_FILTERS);
export const setLoading = createAction<boolean>(SET_LOADING);
export const login = createAction<AuthType>(LOGIN);
export const logout = createAction(LOGOUT);
export const storeUser = createAction<UserType>(STORE_USER);
export const storeUserCategories = createAction<Array<number>>(STORE_USER_CATEGORIES);
export const storeUserSources = createAction<Array<number>>(STORE_USER_SOURCES);
export const storeUserBookmarks = createAction<Array<number>>(STORE_USER_BOOKMARKS);
export const storeCategories = createAction<Array<CategoryType>>(STORE_CATEGORIES);
export const storeSources = createAction<Array<SourceType>>(STORE_SOURCES);
export const updateHydrating = createAction<boolean>(UPDATE_HYDRATING);
export const updateAlert = createAction<AlertType | null>(UPDATE_ALERT);

export const hydrateStore = (): AppThunk => async (dispatch, getState) => {
    const state = getState();
    await dispatch(getCategories());
    await dispatch(getSources());
    if (!isNil(state.auth)) {
        const token = get(state.auth, 'access_token');
        await dispatch(getAuthTokenConfirm());
        await dispatch(hydrateUser(token));
    }
    dispatch(updateHydrating(false));
};

export const hydrateUser = (token: string): AppThunk => async (dispatch) => {
    await dispatch(getManageCategories(token));
    await dispatch(getManageSources(token));
    await dispatch(getBookmarks(token));
};

export const setFilter = (key:string, value:any): AppThunk => async (dispatch) => {
    dispatch(addFilter({key, value}));

    // Unless we explicitly change the page, reset to page 1.
    if (key !== 'page') {
        dispatch(removeFilter('page'));
    }

    if (key === 'sort') {
        saveSetting('sort', value);
    }
};

export const setAlert = (alert: AlertType): AppThunk => async (dispatch) => {
    dispatch(updateAlert(alert));
};

export const clearAlert = (): AppThunk => async (dispatch) => {
    dispatch(updateAlert(null));
};

export const getPosts = (): AppThunk => async (dispatch, getState) => {
    const state = getState();
    const filters = state.filters;

    dispatch(setLoading(true));

    let args = []

    if (filters.page) {
        args.push(`page=${filters.page}`);
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

    const token = get(state.auth, 'access_token');
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

export const searchPosts = (query: string): AppThunk => async (dispatch, getState) => {
    const state = getState();
    const filters = state.filters;

    dispatch(setLoading(true));

    let args = []

    args.push(`query=${encodeURI(query)}`);

    if (filters.page) {
        args.push(`page=${filters.page}`);
    }

    let apiURL = `${BASE_URL}/search`;

    if (args.length) {
        apiURL += `?${args.join("&")}`;
    }

    const token = get(state.auth, 'access_token');
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

export const getBookmarks = (token: string): AppThunk => async (dispatch) => {
    const apiURL = `${BASE_URL}/bookmarks/ids`;
    try {
        const data = await fetcher(apiURL, withAuthToken(getConfig(), token));
        dispatch(storeUserBookmarks(data.bookmarks));
    }
    catch (err) {
        dispatch(setAlert({ message: err.msg, type: ERROR }));
    }
};

export const postBookmark = (payload: object): AppThunk => async (dispatch, getState) => {
    const apiURL = `${BASE_URL}/bookmarks/ids`;
    const state = getState();
    const token = get(state.auth, 'access_token');
    try {
        const data = await fetcher(apiURL, withAuthToken(postConfig(payload), token));
        dispatch(storeUserBookmarks(data.bookmarks));
        dispatch(setAlert({ message: data.msg, type: INFO }));
    }
    catch (err) {
        dispatch(setAlert({ message: err.msg, type: ERROR }));
    }
};

export const deleteBookmark = (payload: object) : AppThunk => async (dispatch, getState) => {
    const apiURL = `${BASE_URL}/bookmarks/ids`;
    const state = getState();
    const token = get(state.auth, 'access_token');
    try {
        const data = await fetcher(apiURL, withAuthToken(deleteConfig(payload), token));
        dispatch(storeUserBookmarks(data.bookmarks));
        dispatch(setAlert({ message: data.msg, type: INFO }));
    }
    catch (err) {
        dispatch(setAlert({ message: err.msg, type: ERROR }));
    }
};

export const postView = (payload: object): AppThunk => async (dispatch, getState) => {
    const apiURL = `${BASE_URL}/views`;
    const state = getState();
    const token = get(state.auth, 'access_token');
    try {
        fetcher(apiURL, withAuthToken(postConfig(payload), token));
    }
    catch (err) {}
};

export const getCategories = (): AppThunk => async (dispatch) => {
    const apiURL = `${BASE_URL}/categories`;
    try {
        const data = await fetcher(apiURL, getConfig());
        dispatch(storeCategories(data.categories));
    }
    catch (err) {
        dispatch(logout());
        dispatch(setAlert({ message: err.msg, type: ERROR }));
    }
};

export const getSources = (): AppThunk => async (dispatch) => {
    const apiURL = `${BASE_URL}/sources`;
    try {
        const data = await fetcher(apiURL, getConfig());
        dispatch(storeSources(data.sources));
    }
    catch (err) {
        dispatch(logout());
        dispatch(setAlert({ message: err.msg, type: ERROR }));
    }
};

export const getManageCategories = (token: string): AppThunk => async (dispatch) => {
    const apiURL = `${BASE_URL}/manage/categories`;
    try {
        const data = await fetcher(apiURL, withAuthToken(getConfig(), token));
        dispatch(storeUserCategories(data.included_categories));
    }
    catch (err) {
        dispatch(logout());
    }
};

export const postMangeCategories = (payload: object): AppThunk => async (dispatch, getState) => {
    const apiURL = `${BASE_URL}/manage/categories`;
    const state = getState();
    const token = get(state.auth, 'access_token');
    try {
        const data = await fetcher(apiURL, withAuthToken(postConfig(payload), token));
        dispatch(storeUserCategories(data.included_categories));
        dispatch(setAlert({ message: data.msg, type: INFO }));
    }
    catch (err) {
        dispatch(setAlert({ message: err.msg, type: ERROR }));
    }
};

export const getManageSources = (token: string): AppThunk => async (dispatch) => {
    const apiURL = `${BASE_URL}/manage/sources`;
    try {
        const data = await fetcher(apiURL, withAuthToken(getConfig(), token));
        dispatch(storeUserSources(data.included_sources));
    }
    catch (err) {
        dispatch(logout());
    }
};

export const postMangeSources = (payload: object): AppThunk => async (dispatch, getState) => {
    const apiURL = `${BASE_URL}/manage/sources`;
    const state = getState();
    const token = get(state.auth, 'access_token');
    try {
        const data = await fetcher(apiURL, withAuthToken(postConfig(payload), token));
        dispatch(storeUserSources(data.included_sources));
        dispatch(setAlert({ message: data.msg, type: INFO }));
    }
    catch (err) {
        dispatch(setAlert({ message: err.msg, type: ERROR }));
    }
};

export const postAuthLogin = (auth: object): AppThunk => async (dispatch) => {
    const apiURL = `${BASE_URL}/auth/login`;
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

export const postAuthRegister = (auth: object): AppThunk => async (dispatch) => {
    const apiURL = `${BASE_URL}/auth/register`;

    try {
        const data = await fetcher(apiURL, postConfig(auth));
        dispatch(setAlert({ message: data.msg, type: INFO }));
    }
    catch (err) {
        dispatch(setAlert({ message: err.msg, type: ERROR }));
        throw new Error(err);
    }
};

export const fetchLogout = (): AppThunk => async (dispatch) => {
    dispatch(logout());
    dispatch(setAlert({message: 'You have successfully logged out.', type: INFO}));
};

export const postAuthPasswordUpdate = (auth: object): AppThunk => async (dispatch, getState) => {
    const apiURL = `${BASE_URL}/auth/password/update`;

    const state = getState();
    const token = get(state.auth, 'access_token');
    try {
        const data = await fetcher(apiURL, withAuthToken(postConfig(auth), token));
        dispatch(setAlert({ message: data.msg, type: INFO }));
    }
    catch (err) {
        dispatch(setAlert({ message: err.msg, type: ERROR }));
        throw new Error(err);
    }
};

export const postAuthPasswordReset = (payload: object): AppThunk => async (dispatch) => {
    const apiURL = `${BASE_URL}/auth/password/reset`;

    try {
        const data = await fetcher(apiURL, postConfig(payload));
        dispatch(setAlert({ message: data.msg, type: INFO }));
    }
    catch (err) {
        dispatch(setAlert({ message: err.msg, type: ERROR }));
        throw new Error(err);
    }
};

export const postAuthEmailUpdate = (payload: object): AppThunk => async (dispatch, getState) => {
    const apiURL = `${BASE_URL}/auth/email/update`;
    const state = getState();
    const token = get(state.auth, 'access_token');
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

export const postAuthEmailConfirmRequest = (): AppThunk => async (dispatch, getState) => {
    const apiURL = `${BASE_URL}/auth/email/confirm/request`;

    const state = getState();
    const token = get(state.auth, 'access_token');
    try {
        const data = await fetcher(apiURL, withAuthToken(postConfig({}), token));
        dispatch(setAlert({ message: data.msg, type: INFO }));
    }
    catch (err) {
        dispatch(setAlert({ message: err.msg, type: ERROR }));
    }
};

export const postAuthEmailConfirmToken = (payload: object): AppThunk => async (dispatch, getState) => {
    const apiURL = `${BASE_URL}/auth/email/confirm/token`;

    const state = getState();
    const token = get(state.auth, 'access_token');
    try {
        const data = await fetcher(apiURL, withAuthToken(postConfig(payload), token));
        dispatch(setAlert({ message: data.msg, type: INFO }));
    }
    catch (err) {
        dispatch(setAlert({ message: err.msg, type: ERROR }));
    }
};

export const postAuthPasswordResetConfirm = (payload: object): AppThunk => async (dispatch) => {
    const apiURL = `${BASE_URL}/auth/password/reset/confirm`;
    try {
        const data = await fetcher(apiURL, postConfig(payload));
        dispatch(setAlert({ message: data.msg, type: INFO }));
    }
    catch (err) {
        dispatch(setAlert({ message: err.msg, type: ERROR }));
        throw new Error(err);
    }
};

export const getAuthTokenConfirm = (): AppThunk => async (dispatch, getState) => {
    const apiURL = `${BASE_URL}/auth/token/confirm`;
    const state = getState();
    const token = get(state.auth, 'access_token');
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
