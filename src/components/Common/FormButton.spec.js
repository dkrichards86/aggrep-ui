import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { Button } from '@material-ui/core';
import FormButton from 'components/Common/FormButton';

describe('<FormButton />', () => {
    let render;

    beforeAll(() => {
        render = createShallow();
    });

    it('renders without crashing', () => {
        const wrapper = render(<FormButton />);
        expect(wrapper.exists(Button));
    });
});
