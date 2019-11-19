import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import isEqual from 'lodash/isEqual';
import { makeStyles } from '@material-ui/core/styles';

import ViewTitle from 'components/Common/ViewTitle';
import PostsList from "components/Posts/PostsList";
import PostSort from 'components/Posts/PostSort';

import { getPosts } from 'store/actions';

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
    const isHydrating = useSelector(state => state.isHydrating);
    const categoryTitle = useSelector(state => state.posts.title);
    const loading = useSelector(state => state.loading);
    const filters = useSelector(state => state.filters);
    const { slug } = useParams();

    const updatePosts = useCallback(() => {
        dispatch(getPosts(endpoint, slug));
    }, [dispatch, endpoint, slug]);

    const prevSlug = useRef(slug);
    const prevEndpoint = useRef(endpoint);
    const prevFilters = useRef(filters);
    const prevHydrating = useRef(isHydrating);
    useEffect(() => {
        let shouldFetch = false;
        if (endpoint !== prevEndpoint) {
            shouldFetch = true;
            prevEndpoint.current = endpoint;
        } else if (slug !== prevSlug) {
            shouldFetch = true;
            prevSlug.current = slug;
        } else if (!isEqual(filters, prevFilters)) {
            shouldFetch = true;
            prevFilters.current = filters;
        } else if (isHydrating !== prevHydrating) {
            shouldFetch = true;
            prevHydrating.current = isHydrating;
        }

        if (shouldFetch) {
            updatePosts(endpoint, slug);
        }
    }, [endpoint, isHydrating, slug, filters, updatePosts]); 

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
