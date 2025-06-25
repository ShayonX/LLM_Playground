import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScenarioState {
    scenario: string;
}

const initialState: ScenarioState = {
    scenario: 'Scenario1', // Default scenario
};

const scenarioSlice = createSlice({
    name: 'scenario',
    initialState,
    reducers: {
        setScenario: (state, action: PayloadAction<string>) => {
            state.scenario = action.payload;
        },
    },
});

export const { setScenario } = scenarioSlice.actions;
export default scenarioSlice.reducer;
