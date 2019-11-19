import React from 'react';
import { useSelector } from 'react-redux';
import range from 'lodash/range';
import { Paper, List } from '@material-ui/core';
import PostsListItem from 'components/Posts/PostsListItem';
import PostsListItemLoading from 'components/Posts/PostsListItemLoading';
import PostsListItemEmpty from 'components/Posts/PostsListItemEmpty';
import PostsPagination from 'components/Posts/PostsPagination'

const PostList = () => {
    const posts = useSelector(state => state.posts.items);
    const loading = useSelector(state => state.loading);

    let content;
    if (!loading && posts.length > 0) {
        content = posts.map(p => (<PostsListItem post={p} key={`post_${p.id}`} />));
    } else if (!loading) {
        content = <PostsListItemEmpty />;
    } else {
        content = range(20).map((_, i) => <PostsListItemLoading key={`post_placeholder_${i}`}/>);
    }

    return (
        <Paper>
            <List>
            {content}
            <PostsPagination />
            </List>
        </Paper>
    );
}

export default PostList;
