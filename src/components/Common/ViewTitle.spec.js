import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import ViewTitle from 'components/Common/ViewTitle';

describe('<ViewTitle />', () => {
    let render;

    beforeAll(() => {
        render = createShallow();
    });

    it('renders without crashing', () => {
        const wrapper = render(<ViewTitle title="title" />);
        expect(wrapper.exists('[data-test-id="view-title"]'));
    });
});
