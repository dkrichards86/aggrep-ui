import React from 'react';
import range from 'lodash/range';
import { Paper, List } from '@material-ui/core';
import PostsListItem from 'components/Posts/PostsListItem';
import PostsListItemLoading from 'components/Posts/PostsListItemLoading';
import PostsListItemEmpty from 'components/Posts/PostsListItemEmpty';
import PostsPagination from 'components/Posts/PostsPagination'

import { RootState } from 'store/reducers';
import { PostType, useSelector } from 'store/types';

const PostList:React.FunctionComponent = () => {
    const posts = useSelector((state: RootState) => state.posts.items);
    const loading = useSelector((state: RootState) => state.loading);

    let content;
    if (!loading && posts.length > 0) {
        content = posts.map((p: PostType):React.ReactNode => (<PostsListItem post={p} key={`post_${p.id}`} />));
    } else if (!loading) {
        content = <PostsListItemEmpty />;
    } else {
        content = range(20).map((_: number, i: number) => <PostsListItemLoading key={`post_placeholder_${i}`}/>);
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
