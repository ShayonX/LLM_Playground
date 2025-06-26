import React, { Component } from "react";
import { HomeDashboard } from "./pages/Home/HomeDashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Copilot from "./pages/Copilot/Copilot";
import { Provider } from "react-redux";
import store from "./store";

interface IState {
    loading: boolean;
}

export class App extends Component<{}, IState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            loading: true, // Add the loading property to the state object
        };
    }

    render() {
        // TODO: Add spinner here.
        // let contents = this.state.loading
        //     ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        //     : App.MigrationCalls();

        return (
            <Provider store={store}>
                <Router>
                    <Routes>
                        <Route path="/" element={<HomeDashboard />} />
                        <Route path="/copilot" element={<Copilot />} />
                        {/* <Route path="/about" element={<About />} /> */}
                        {/* <Route path="*" element={<NotFound />} /> 404 Not Found */}
                    </Routes>
                </Router>
            </Provider>
        );
    }
}
