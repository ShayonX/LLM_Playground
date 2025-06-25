import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IAttachment {
    name: string;
    type: string;
    url?: string;
    base64Data?: string;
}

interface IMessage {
    content: string;
    agent: 'userAgent' | 'copilotAgent';
    attachments?: IAttachment[];
    isCoTReasoning?: boolean; // Flag to indicate if this is CoT reasoning
}

const initialState: IMessage[] = [];

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<IMessage>) => {
            state.push(action.payload);
        },
        updateLastMessage: (state, action: PayloadAction<string>) => {
            if (state.length > 0) {
                state[state.length - 1].content = action.payload;
            }
        },
        clearMessages: () => initialState
    }
});

export const { addMessage, updateLastMessage, clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
