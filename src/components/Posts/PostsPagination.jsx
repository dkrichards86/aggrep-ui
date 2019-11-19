import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TablePagination } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { setFilter } from 'store/actions';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexWrap: 'wrap'
    }
}));

const PostPagination = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const numPages = useSelector(state => state.posts.total_pages);
    const postCount = useSelector(state => state.posts.total_items);
    const perPage = useSelector(state => state.posts.per_page);
    const pageNumber = useSelector(state => state.posts.page);

    const handleChangePage = (_, newPage) => {
        dispatch(setFilter('page', newPage + 1));
    };

    const handleChangePerPage = (event) => {
        dispatch(setFilter('per_page', event.target.value, 10));
    };

    let pagination = null;
    if (numPages > 1) {
        pagination = (
            <TablePagination
                classes={{
                    toolbar: classes.root,
                }}
                rowsPerPageOptions={[10, 20, 50]}
                component="div"
                count={postCount}
                page={pageNumber - 1}
                rowsPerPage={perPage}
                labelRowsPerPage="Posts to show: "
                backIconButtonProps={{
                    'aria-label': 'previous page',
                }}
                nextIconButtonProps={{
                    'aria-label': 'next page',
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangePerPage}
            />
        );
    }

    return pagination;
}

export default PostPagination;
