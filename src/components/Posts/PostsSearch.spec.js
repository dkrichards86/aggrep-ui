import React from 'react';
import { useDispatch } from 'react-redux';
import { createShallow } from '@material-ui/core/test-utils';
import PostsList from "components/Posts/PostsList";
import PostsSearch from 'components/Posts/PostsSearch';

jest.mock('react-redux');

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
      push: jest.fn(),
    }),
}));

useDispatch.mockImplementation(() => cb => cb());

describe('<PostsSearch />', () => {
    let render;

    beforeAll(() => {
        render = createShallow();
    });
    
    it('renders without crashing', () => {
        const wrapper = render(<PostsSearch />);
        expect(wrapper.exists('[data-test-id="view-title"]'));
        expect(wrapper.exists('[data-test-id="query-input"]'));
        expect(wrapper.exists('[data-test-id="clear-button"]'));
        expect(wrapper.exists('[data-test-id="submit-button"]'));
        expect(wrapper.contains(<PostsList />)).toBe(false);
    });

    it('submits a valid form', () => {
        const wrapper = render(<PostsSearch />);
        wrapper.find('[data-test-id="query-input"]').prop('onChange')({target:{value: 'foobar'}});
        wrapper.find('[data-test-id="submit-button"]').simulate('click');

        expect(wrapper.find('[data-test-id="query-input"]').props().value).toEqual('foobar');
        expect(wrapper.find('[data-test-id="query-input"]').props().error).toBeFalsy();
        expect(wrapper.find('[data-test-id="query-input"]').props().helperText).toBeFalsy();

        expect(wrapper.contains(<PostsList />)).toBe(true);
    });

    it('shows errors on empty inputs', () => {
        const wrapper = render(<PostsSearch />);
        wrapper.find('[data-test-id="query-input"]').prop('onChange')({target:{value: ''}});
        wrapper.find('[data-test-id="submit-button"]').simulate('click');

        expect(wrapper.find('[data-test-id="query-input"]').props().value).toEqual('');
        expect(wrapper.find('[data-test-id="query-input"]').props().error).toBeTruthy();
        expect(wrapper.find('[data-test-id="query-input"]').props().helperText).toEqual('This field is required.');

        expect(wrapper.contains(<PostsList />)).toBe(false);
    });
});
