import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import PostsListItemLoading from 'components/Posts/PostsListItemLoading';

describe('<PostListLoadingItem />', () => {
    let render;

    beforeAll(() => {
        render = createShallow();
    });

    it('renders without crashing', () => {
        const wrapper = render(<PostsListItemLoading />);
        expect(wrapper.exists('[data-test-id="post-loading-list-item"]'));
        expect(wrapper.exists('[data-test-id="primary-shimmer"]'));
        expect(wrapper.exists('[data-test-id="secondary-shimmer"]'));
    });
});
