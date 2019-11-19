import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Wrapper from "components/Layout/Wrapper";

import './index.css';
import "@fortawesome/fontawesome-free/css/all.css";
import 'typeface-roboto';
import 'typeface-quicksand';
import Routes from './router/Routes';
import reducers from "./store/reducers";
import { hydrateStore } from './store/actions';
import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#60748b',
            main: '#34495E',
            dark: '#092234',
            contrastText: '#FFF',
        },
        secondary: {
            light: '#60748b',
            main: '#34495E',
            dark: '#092234',
            contrastText: '#FFF',
        },
    }
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunkMiddleware)));

store.dispatch(hydrateStore());

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <MuiThemeProvider theme={theme}>
                <Wrapper>
                    <Routes />
                </Wrapper>
            </MuiThemeProvider>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();