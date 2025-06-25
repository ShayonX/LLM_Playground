import React, { Component } from "react";
import { Header } from "../../components/header/Header";
import { LeftNav } from "../../components/leftNav/LeftNav";
import { Breadcrumbs } from "../../components/breadcrumbs/breadcrumbs";
import { DashboardDataManagement } from "./relatedComponentsHome/DashboardComponent";
import { mergeStyles } from "@fluentui/react";
import "./HomeDashboardStyle.css";

interface IState {
    loading: boolean;
    isLeftNavCollapsed: boolean;
}

const items = [
    { text: "Home", key: "home", href: "/" },
    { text: "Dashboard", key: "dashboard" },
];

export class HomeDashboard extends Component<{}, IState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            loading: true, // Add the loading property to the state object
            isLeftNavCollapsed: false, // Initial state
        };
    }
    toggleLeftNav = () => {
        this.setState((prevState) => ({
            isLeftNavCollapsed: !prevState.isLeftNavCollapsed,
        }));
    };

    render() {
        // TODO: Add spinner here.
        // let contents = this.state.loading
        //     ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        //     : App.MigrationCalls();

        return (
            <div className="outer-flex-container">
                <div className="header">
                    <Header />
                </div>
                <div className="leftNav">
                    <LeftNav
                        isCollapsed={this.state.isLeftNavCollapsed}
                        onToggle={this.toggleLeftNav}
                    />
                </div>

                <div className="transitionAnimation">
                    <div className="vertical-items">
                        <div className="horizontal-items">
                            <div
                                className="main-content-vertical-items"
                                style={{
                                    marginLeft: this.state.isLeftNavCollapsed
                                        ? "48px"
                                        : "280px",
                                }}
                            >
                                <div className="horizontal-items">
                                    <div className="breadcrumbs">
                                        <Breadcrumbs
                                            items={items}
                                            showHeader={true}
                                        />
                                        <>
                                            {" "}
                                            <div className="welcome-message">
                                                <p>
                                                    Welcome to MORGAN - your
                                                    intelligent agent for
                                                    seamless data transfer
                                                    management.
                                                </p>
                                            </div>{" "}
                                            <div className="morgan-meaning">
                                                <h2>M - Migration</h2>
                                                <h2>O - Orchestration</h2>
                                                <h2>R - Resource</h2>
                                                <h2>G - Generation</h2>
                                                <h2>A - Automation</h2>
                                                <h2>N - ...and Navigation</h2>
                                                <p>
                                                    <strong>
                                                        An intelligent agent for
                                                        seamless data transfer
                                                        within company
                                                        departments.
                                                    </strong>
                                                </p>
                                            </div>
                                        </>
                                    </div>
                                </div>
                                <div className="dashboard">
                                    {
                                        // TODO: We can add a Dashboard later for other features, disabling for now.
                                        // <DashboardDataManagement />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
