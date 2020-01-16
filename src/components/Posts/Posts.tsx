import React, { useEffect, useRef } from 'react';
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { makeStyles } from '@material-ui/core/styles';

import ViewTitle from 'components/Common/ViewTitle';
import PostsList from "components/Posts/PostsList";
import PostSort from 'components/Posts/PostSort';
import isEqual from 'lodash/isEqual';

import { getPosts, bulkSetFilters } from 'store/actions';
import { RootState } from 'store/reducers';
import { useSelector } from 'store/types'

const useStyles = makeStyles(() => ({
    content: {
        maxWidth: 1024,
        margin: '0 auto'
    },
    postOptions: {
        flexWrap: 'wrap',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
}));

interface PostProps {
    endpoint: string;
    hideSort: boolean;
};

const Posts:React.FunctionComponent<PostProps> = ({ endpoint, hideSort }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const categoryTitle = useSelector((state: RootState) => state.posts.title);
    const filters = useSelector((state: RootState) => state.filters);
    const loading = useSelector((state: RootState) => state.loading);
    const { slug } = useParams();

    useEffect(() => {
        if (endpoint !== filters.endpoint || slug !== filters.slug) {
            dispatch(bulkSetFilters([
                {key: 'endpoint', value: endpoint},
                {key: 'slug', value: slug},
                {key: 'page', value: 1},
                {key: 'per_page', value: filters.per_page},
                {key: 'sort', value: filters.sort},
            ]));
        }
    }, [endpoint, slug, filters, dispatch]);

    const prevFilters = useRef(filters);
    useEffect(() => {
        let shouldFetch = false;
        if (!isEqual(filters, prevFilters.current)) {
            prevFilters.current = filters;
            shouldFetch = true;
        }

        if (shouldFetch) {
            dispatch(getPosts());
        }
    }, [filters, dispatch]);

    return (
        <div className={classes.content}>
            <div className={classes.postOptions}>
                <ViewTitle title={loading ? "Loading..." : categoryTitle} />
                {!hideSort && <PostSort />}
            </div>
            <PostsList />
        </div>
    );
};

export default Posts;
