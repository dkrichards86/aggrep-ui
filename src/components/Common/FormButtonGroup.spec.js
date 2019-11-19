import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import FormButtonGroup from 'components/Common/FormButtonGroup';

describe('<FormButtonGroup />', () => {
    let render;

    beforeAll(() => {
        render = createShallow();
    });

    it('renders without crashing', () => {
        const wrapper = render(<FormButtonGroup />);
        expect(wrapper.exists('[data-test-id="form-button-group"]'));
    });
});
