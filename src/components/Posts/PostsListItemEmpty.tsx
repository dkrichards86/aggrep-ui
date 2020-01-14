import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
    },
}));

const PostsListItemEmpty:React.FunctionComponent = () => {
    const classes = useStyles();

    return (
        <Typography variant='body1' className={classes.root} data-test-id="typography" >
            There are no posts to show.
        </Typography>
    );
};

export default PostsListItemEmpty;