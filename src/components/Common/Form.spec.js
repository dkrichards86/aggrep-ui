import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { Card, CardContent } from '@material-ui/core';
import Form from 'components/Common/Form';

describe('<Form />', () => {
    let render;

    beforeAll(() => {
        render = createShallow();
    });

    it('renders without crashing', () => {
        const wrapper = render(<Form />);
        expect(wrapper.exists(Card));
        expect(wrapper.exists(CardContent));
    });
});
