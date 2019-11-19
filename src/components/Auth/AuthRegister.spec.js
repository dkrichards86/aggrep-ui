import React from 'react';
import { useDispatch } from 'react-redux';
import { createShallow } from '@material-ui/core/test-utils';
import AuthRegister from 'components/Auth/AuthRegister';

jest.mock('react-redux');

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
      push: jest.fn(),
    }),
}));

useDispatch.mockImplementation(() => cb => cb());

describe('<AuthRegister />', () => {
    let render;

    beforeAll(() => {
        render = createShallow();
    });

    useDispatch.mockImplementation(() => cb => cb());
    
    it('renders without crashing', () => {
        const wrapper = render(<AuthRegister />);
        expect(wrapper.exists('[data-test-id="view-title"]'));
        expect(wrapper.exists('[data-test-id="email-input"]'));
        expect(wrapper.exists('[data-test-id="password-confirmed-input"]'));
        expect(wrapper.exists('[data-test-id="clear-button"]'));
        expect(wrapper.exists('[data-test-id="submit-button"]'));
    });

    it('submits a valid form', () => {
        const wrapper = render(<AuthRegister />);
        wrapper.find('[data-test-id="email-input"]').prop('onChange')({target:{value: 'foo@bar.com'}});
        wrapper.find('[data-test-id="password-input"]').prop('onChange')({target:{value: 'foobar'}});
        wrapper.find('[data-test-id="password-confirmed-input"]').prop('onChange')({target:{value: 'foobar'}});
        wrapper.find('[data-test-id="submit-button"]').simulate('click');

        expect(wrapper.find('[data-test-id="email-input"]').props().value).toEqual('foo@bar.com');
        expect(wrapper.find('[data-test-id="email-input"]').props().error).toBeFalsy();
        expect(wrapper.find('[data-test-id="email-input"]').props().helperText).toBeFalsy();

        expect(wrapper.find('[data-test-id="password-input"]').props().value).toEqual('foobar');
        expect(wrapper.find('[data-test-id="password-input"]').props().error).toBeFalsy();
        expect(wrapper.find('[data-test-id="password-input"]').props().helperText).toBeFalsy();

        expect(wrapper.find('[data-test-id="password-confirmed-input"]').props().value).toEqual('foobar');
        expect(wrapper.find('[data-test-id="password-confirmed-input"]').props().error).toBeFalsy();
        expect(wrapper.find('[data-test-id="password-confirmed-input"]').props().helperText).toBeFalsy();
    });

    it('shows errors on invalid inputs', () => {
        const wrapper = render(<AuthRegister />);
        wrapper.find('[data-test-id="email-input"]').prop('onChange')({target:{value: 'foobar'}});
        wrapper.find('[data-test-id="password-input"]').prop('onChange')({target:{value: 'foobar'}});
        wrapper.find('[data-test-id="password-confirmed-input"]').prop('onChange')({target:{value: 'quxquux'}});
        wrapper.find('[data-test-id="submit-button"]').simulate('click');

        expect(wrapper.find('[data-test-id="email-input"]').props().value).toEqual('foobar');
        expect(wrapper.find('[data-test-id="email-input"]').props().error).toBeTruthy();
        expect(wrapper.find('[data-test-id="email-input"]').props().helperText).toEqual("Invalid email address provided.");

        expect(wrapper.find('[data-test-id="password-input"]').props().value).toEqual('foobar');
        expect(wrapper.find('[data-test-id="password-input"]').props().error).toBeTruthy();
        expect(wrapper.find('[data-test-id="password-input"]').props().helperText).toEqual('The passwords must match.');

        expect(wrapper.find('[data-test-id="password-confirmed-input"]').props().value).toEqual('quxquux');
        expect(wrapper.find('[data-test-id="password-confirmed-input"]').props().error).toBeTruthy();
        expect(wrapper.find('[data-test-id="password-confirmed-input"]').props().helperText).toEqual('The passwords must match.');
    });

    it('shows errors on empty inputs', () => {
        const wrapper = render(<AuthRegister />);
        wrapper.find('[data-test-id="email-input"]').prop('onChange')({target:{value: ''}});
        wrapper.find('[data-test-id="password-input"]').prop('onChange')({target:{value: ''}});
        wrapper.find('[data-test-id="password-confirmed-input"]').prop('onChange')({target:{value: ''}});
        wrapper.find('[data-test-id="submit-button"]').simulate('click');

        expect(wrapper.find('[data-test-id="email-input"]').props().value).toEqual('');
        expect(wrapper.find('[data-test-id="email-input"]').props().error).toBeTruthy();
        expect(wrapper.find('[data-test-id="email-input"]').props().helperText).toEqual('This field is required.');

        expect(wrapper.find('[data-test-id="password-input"]').props().value).toEqual('');
        expect(wrapper.find('[data-test-id="password-input"]').props().error).toBeTruthy();
        expect(wrapper.find('[data-test-id="password-input"]').props().helperText).toEqual('This field is required.');

        expect(wrapper.find('[data-test-id="password-confirmed-input"]').props().value).toEqual('');
        expect(wrapper.find('[data-test-id="password-confirmed-input"]').props().error).toBeTruthy();
        expect(wrapper.find('[data-test-id="password-confirmed-input"]').props().helperText).toEqual('This field is required.');
    });
});
