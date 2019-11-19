import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import {
    FormControl, FormGroup, InputLabel, Input, FormHelperText
} from '@material-ui/core';
import FormInput from 'components/Common/FormInput';

describe('<FormInput />', () => {
    let render;

    beforeAll(() => {
        render = createShallow();
    });

    it('renders without crashing', () => {
        const wrapper = render(<FormInput />);
        expect(wrapper.exists(FormControl));
        expect(wrapper.exists(FormGroup));
        expect(wrapper.exists(InputLabel));
        expect(wrapper.exists(Input));
        expect(wrapper.exists(FormHelperText));
    });
});
