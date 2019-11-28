import update from 'immutability-helper';
import { handleActions } from 'redux-actions';

import { 
    STORE_POSTS, ADD_FILTER, REMOVE_FILTER, SET_LOADING, LOGIN, LOGOUT, STORE_USER,
    UPDATE_HYDRATING, STORE_USER_CATEGORIES, STORE_USER_SOURCES, STORE_SOURCES, STORE_CATEGORIES,
    UPDATE_ALERT, STORE_USER_BOOKMARKS, BULK_SET_FILTERS
} from './reducer_types';
import { DEFAULT_SORT, DEFAULT_PER_PAGE } from '../constants';
import { loadSetting, removeSetting, saveSetting } from 'store/storage';

const initialState = {
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

const reducers = handleActions({
    [UPDATE_HYDRATING]: (state, action) => {
        return update(state, {
            hydrating: {
                $set: action.payload
            }
        })
    },
    [STORE_POSTS]: (state, action) => {
        return update(state, {
            posts: {
                $set: action.payload
            }
        })
    },
    [STORE_SOURCES]: (state, action) => {
        return update(state, {
            sources: {
                $set: action.payload
            }
        })
    },
    [STORE_CATEGORIES]: (state, action) => {
        return update(state, {
            categories: {
                $set: action.payload
            }
        })
    },
    [ADD_FILTER]: (state, action) => {
        return update(state, {
            filters: {
                [action.payload.key]: {
                    $set: action.payload.value
                }
            }
        })
    },
    [REMOVE_FILTER]: (state, action) => {
        return update(state, {
            filters: {
                [action.payload]: {
                    $set: null
                }
            }
        })
    },
    [BULK_SET_FILTERS]: (state, action) => {
        return update(state, {
            filters: {
                $set: action.payload
            }
        })
    },
    [SET_LOADING]: (state, action) => {
        return update(state, {
            loading: {
                $set: action.payload
            }
        })
    },
    [LOGOUT]: (state) => {
        removeSetting('auth');
        return update(state, {
            auth: {
                $set: null,
            }
        })
    },
    [LOGIN]: (state, action) => {
        saveSetting('auth', action.payload);
        return update(state, {
            auth: {
                $set: action.payload,
            }
        })
    },
    [STORE_USER]: (state, action) => {
        return update(state, {
            user: {
                $set: action.payload
            }
        })
    },
    [STORE_USER_CATEGORIES]: (state, action) => {
        return update(state, {
            user: {
                categories: {
                    $set: action.payload
                }
            }
        })
    },
    [STORE_USER_SOURCES]: (state, action) => {
        return update(state, {
            user: {
                sources: {
                    $set: action.payload
                }
            }
        })
    },
    [STORE_USER_BOOKMARKS]: (state, action) => {
        return update(state, {
            user: {
                bookmarks: {
                    $set: action.payload
                }
            }
        })
    },
    [UPDATE_ALERT]: (state, action) => {
        return update(state, {
            alert: {
                $set: action.payload
            }
        })
    },
}, initialState);

export default reducers;
