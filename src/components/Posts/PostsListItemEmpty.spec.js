import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import PostsListItemEmpty from 'components/Posts/PostsListItemEmpty';

describe('<PostsListItemEmpty />', () => {
    let render;

    beforeAll(() => {
        render = createShallow();
    });

    it('renders without crashing', () => {
        const wrapper = render(<PostsListItemEmpty />);
        expect(wrapper.exists('[data-test-id="typography"]'));
    });
});
