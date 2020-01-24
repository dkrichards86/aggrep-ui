import React from 'react';
import { useDispatch } from 'react-redux';
import { TablePagination } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { setFilter } from 'store/actions';
import { RootState } from 'store/reducers';
import { useSelector } from 'store/types';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexWrap: 'wrap'
    }
}));

const PostPagination:React.FunctionComponent = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const numPages = useSelector((state: RootState) => state.posts.total_pages);
    const pageNumber = useSelector((state: RootState) => state.posts.page);
    const postCount = useSelector((state: RootState) => state.posts.total_items)

    const handleChangePage = (_:any, newPage: number):void => {
        dispatch(setFilter('page', newPage + 1));
    };

    let pagination = null;
    if (numPages > 1) {
        pagination = (
            <TablePagination
                classes={{
                    toolbar: classes.root,
                }}
                rowsPerPageOptions={[20]}
                component="div"
                count={postCount}
                page={pageNumber - 1}
                rowsPerPage={20}
                labelRowsPerPage="Posts to show: "
                backIconButtonProps={{
                    'aria-label': 'previous page',
                }}
                nextIconButtonProps={{
                    'aria-label': 'next page',
                }}
                onChangePage={handleChangePage}
            />
        );
    }

    return pagination;
}

export default PostPagination;
