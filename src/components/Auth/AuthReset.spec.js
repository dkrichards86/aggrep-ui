import React from 'react';
import { useDispatch } from 'react-redux';
import { createShallow } from '@material-ui/core/test-utils';
import AuthReset from 'components/Auth/AuthReset';

jest.mock('react-redux');

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
      push: jest.fn(),
    }),
}));

useDispatch.mockImplementation(() => cb => cb());

describe('<AuthReset />', () => {
    let render;

    beforeAll(() => {
        render = createShallow();
    });

    useDispatch.mockImplementation(() => cb => cb());
    
    it('renders without crashing', () => {
        const wrapper = render(<AuthReset match={{params: 'json.web.token'}} />);

        expect(wrapper.exists('[data-test-id="view-title"]'));
        expect(wrapper.exists('[data-test-id="password-change-input"]'));
        expect(wrapper.exists('[data-test-id="password-repeat-input"]'));
        expect(wrapper.exists('[data-test-id="clear-button"]'));
        expect(wrapper.exists('[data-test-id="submit-button"]'));
    });

    it('submits a valid form', () => {
        const wrapper = render(<AuthReset match={{params: 'json.web.token'}} />);
        wrapper.find('[data-test-id="password-change-input"]').prop('onChange')({target:{value: 'foobar'}});
        wrapper.find('[data-test-id="password-repeat-input"]').prop('onChange')({target:{value: 'foobar'}});
        wrapper.find('[data-test-id="submit-button"]').simulate('click');

        expect(wrapper.find('[data-test-id="password-change-input"]').props().value).toEqual('foobar');
        expect(wrapper.find('[data-test-id="password-change-input"]').props().error).toBeFalsy();
        expect(wrapper.find('[data-test-id="password-change-input"]').props().helperText).toBeFalsy();

        expect(wrapper.find('[data-test-id="password-repeat-input"]').props().value).toEqual('foobar');
        expect(wrapper.find('[data-test-id="password-repeat-input"]').props().error).toBeFalsy();
        expect(wrapper.find('[data-test-id="password-repeat-input"]').props().helperText).toBeFalsy();
    });

    it('shows errors on invalid inputs', () => {
        const wrapper = render(<AuthReset match={{params: 'json.web.token'}} />);
        wrapper.find('[data-test-id="password-change-input"]').prop('onChange')({target:{value: 'foobar'}});
        wrapper.find('[data-test-id="password-repeat-input"]').prop('onChange')({target:{value: 'quxquux'}});
        wrapper.find('[data-test-id="submit-button"]').simulate('click');

        expect(wrapper.find('[data-test-id="password-change-input"]').props().value).toEqual('foobar');
        expect(wrapper.find('[data-test-id="password-change-input"]').props().error).toBeTruthy();
        expect(wrapper.find('[data-test-id="password-change-input"]').props().helperText).toEqual('The passwords must match.');

        expect(wrapper.find('[data-test-id="password-repeat-input"]').props().value).toEqual('quxquux');
        expect(wrapper.find('[data-test-id="password-repeat-input"]').props().error).toBeTruthy();
        expect(wrapper.find('[data-test-id="password-repeat-input"]').props().helperText).toEqual('The passwords must match.');
    });

    it('shows errors on empty inputs', () => {
        const wrapper = render(<AuthReset match={{params: 'json.web.token'}} />);
        wrapper.find('[data-test-id="password-change-input"]').prop('onChange')({target:{value: ''}});
        wrapper.find('[data-test-id="password-repeat-input"]').prop('onChange')({target:{value: ''}});
        wrapper.find('[data-test-id="submit-button"]').simulate('click');

        expect(wrapper.find('[data-test-id="password-change-input"]').props().value).toEqual('');
        expect(wrapper.find('[data-test-id="password-change-input"]').props().error).toBeTruthy();
        expect(wrapper.find('[data-test-id="password-change-input"]').props().helperText).toEqual('This field is required.');

        expect(wrapper.find('[data-test-id="password-repeat-input"]').props().value).toEqual('');
        expect(wrapper.find('[data-test-id="password-repeat-input"]').props().error).toBeTruthy();
        expect(wrapper.find('[data-test-id="password-repeat-input"]').props().helperText).toEqual('This field is required.');
    });
});
