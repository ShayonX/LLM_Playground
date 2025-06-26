import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToggleState {
    isChatNarrationEnabled: boolean;
}

const initialState: ToggleState = {
    isChatNarrationEnabled: false,
};

const toggleSlice = createSlice({
    name: 'toggle',
    initialState,
    reducers: {
        setChatNarration: (state, action: PayloadAction<boolean>) => {
            state.isChatNarrationEnabled = action.payload;
        },
    },
});

export const { setChatNarration } = toggleSlice.actions;
export default toggleSlice.reducer;
