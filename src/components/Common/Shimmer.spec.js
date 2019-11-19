import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import Shimmer from 'components/Common/Shimmer';

describe('<Shimmer />', () => {
    let render;

    beforeAll(() => {
        render = createShallow();
    });

    it('renders without crashing', () => {
        const wrapper = render(<Shimmer />);
        expect(wrapper.exists('[data-test-id="shimmer"]'));
    });
});
