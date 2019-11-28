import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { makeStyles } from '@material-ui/core/styles';

import ViewTitle from 'components/Common/ViewTitle';
import PostsList from "components/Posts/PostsList";
import PostSort from 'components/Posts/PostSort';
import isEqual from 'lodash/isEqual';

import { getPosts, bulkSetFilters } from 'store/actions';

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

const Posts = ({ endpoint, hideSort }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const categoryTitle = useSelector(state => state.posts.title);
    const loading = useSelector(state => state.loading);
    const filters = useSelector(state => state.filters);
    const { slug } = useParams();

    useEffect(() => {
        if (endpoint !== filters.endpoint || slug !== filters.slug) {
            dispatch(bulkSetFilters({
                endpoint,
                slug,
                page: 1,
                per_page: filters.per_page,
                sort: filters.sort,
            }));
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
