import React from 'react';
import { 
    ListItem, ListItemText
} from '@material-ui/core';
import Shimmer from 'components/Common/Shimmer';

const PostsListItemLoading:React.FunctionComponent = () => (
    <ListItem data-test-id='post-loading-list-item'>
        <ListItemText
            primary={<Shimmer data-test-id='primary-shimmer'/>}
            secondary={<Shimmer data-test-id='secondary-shimmer' />} />
    </ListItem>
);

export default PostsListItemLoading;