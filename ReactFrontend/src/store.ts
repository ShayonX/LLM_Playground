import { configureStore } from '@reduxjs/toolkit';
import messagesReducer from './messagesSlice';
import toggleReducer from './toggleSlice';
import scenarioReducer from './scenarioSlice';

const store = configureStore({
    reducer: {
        messages: messagesReducer,
        toggle: toggleReducer,
        scenario: scenarioReducer,
    },
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
