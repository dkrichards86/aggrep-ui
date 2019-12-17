import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import PostsListItemModal from 'components/Posts/PostsListItemModal';

describe('<PostsListItemModal />', () => {
    let render;

    beforeAll(() => {
        render = createShallow();
    });

    it('renders without crashing', () => {
        const post = {
            uid: 'foobar',
            post_url: 'https://www.aggregatereport.com/foobar',
            feed: {
                source: {
                    title: "Foo Bar"
                },
            },
        };

        const wrapper = render(<PostsListItemModal post={post} onClose={() => {}} />);

        expect(wrapper.exists('[data-test-id="share-modal"]'));
        expect(wrapper.exists('[data-test-id="share-modal-title"]'));
        expect(wrapper.exists('[data-test-id="share-modal-link"]'));
        expect(wrapper.exists('[data-test-id="share-link-twitter"]'));
        expect(wrapper.exists('[data-test-id="share-icon-twitter"]'));
        expect(wrapper.exists('[data-test-id="share-link-facebook"]'));
        expect(wrapper.exists('[data-test-id="share-icon-facebook"]'));
        expect(wrapper.exists('[data-test-id="share-link-linkedin"]'));
        expect(wrapper.exists('[data-test-id="share-icon-linkedin"]'));
        expect(wrapper.exists('[data-test-id="share-link-reddit"]'));
        expect(wrapper.exists('[data-test-id="share-icon-reddit"]'));
        expect(wrapper.exists('[data-test-id="share-link-email"]'));
        expect(wrapper.exists('[data-test-id="share-icon-email"]'));
        expect(wrapper.exists('[data-test-id="share-link-link"]'));
        expect(wrapper.exists('[data-test-id="share-icon-link"]'));
    });
});
