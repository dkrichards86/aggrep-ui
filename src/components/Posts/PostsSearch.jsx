import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import isEmpty from 'lodash/isEmpty';

import ViewTitle from 'components/Common/ViewTitle';
import Form from 'components/Common/Form';
import FormButton from 'components/Common/FormButton';
import FormButtonGroup from 'components/Common/FormButtonGroup';
import FormInput from 'components/Common/FormInput';
import PostsList from "components/Posts/PostsList";
import isEqual from 'lodash/isEqual';
import { isBlank } from 'utils';

import { searchPosts, bulkSetFilters } from 'store/actions';

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

const PostsSearch = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const filters = useSelector(state => state.app.filters);
    const [query, setQuery] = useState('');
    const [errors, setErrors] = useState({});
    const [showPosts, setShowPosts] = useState(false);

    useEffect(() => {
        if (filters.endpoint !== 'search') {
            dispatch(bulkSetFilters({
                endpoint: 'search',
                slug: null,
                page: 1,
                per_page: filters.per_page,
                sort: filters.sort,
            }));
        }
    }, [filters, dispatch]);

    const clear = () => {
        setQuery('');
        setErrors({});
        setShowPosts(false);
    };

    const submit = async () => {
        const submissionErrors = {};

        if (isBlank(query)) {
            submissionErrors.query = 'This field is required.';
        }

        if (isEmpty(submissionErrors)) {
            setErrors({});
            try {
                await dispatch(searchPosts(query));
                setShowPosts(true);
            } catch {}
        }
        else {
            setErrors(submissionErrors)
        }
    };

    const prevFilters = useRef(filters);
    useEffect(() => {
        let shouldFetch = false;
        if (!isEqual(filters, prevFilters.current)) {
            prevFilters.current = filters;
            shouldFetch = true;
        }

        if (query && shouldFetch) {
            dispatch(searchPosts(query));
        }
    }, [filters, query, dispatch]);

    return (
        <div className={classes.content}>
            <div className={classes.postOptions}>
                <ViewTitle title="Search Posts" data-test-id="view-title" />
            </div>
            <Form onEnterKey={submit}>
                <FormInput
                    id="search-query"
                    data-test-id="query-input"
                    label="Search"
                    type="text"
                    value={query}
                    error={!!errors.query}
                    helperText={'query' in errors && errors.query}
                    onChange={event => setQuery(event.target.value)} />
                <FormButtonGroup>
                    <FormButton
                        data-test-id="clear-button"
                        color="primary"
                        onClick={clear}>
                        Clear
                    </FormButton>
                    <FormButton
                        data-test-id="submit-button"
                        variant="contained"
                        color="primary"
                        onClick={submit}>
                        Submit
                    </FormButton>
                </FormButtonGroup>
            </Form>
            <br />
            {showPosts && <PostsList />}
        </div>
    );
};

export default PostsSearch;
