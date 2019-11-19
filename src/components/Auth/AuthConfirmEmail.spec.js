import React from 'react';
import { useDispatch } from 'react-redux';
import { createShallow } from '@material-ui/core/test-utils';
import AuthConfirmEmail from 'components/Auth/AuthConfirmEmail';


jest.mock('react-redux');

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
      push: jest.fn(),
    }),
}));

useDispatch.mockImplementation(() => cb => cb());

describe('<AuthConfirmEmail />', () => {
    let render;

    beforeAll(() => {
        render = createShallow();
    });

    useDispatch.mockImplementation(() => cb => cb());

    it('renders without crashing', () => {
        const wrapper = render(<AuthConfirmEmail match={{params: 'json.web.token'}} />);

        expect(wrapper.exists('[data-test-id="view-title"]'));
    });
});
