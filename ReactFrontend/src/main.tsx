import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from '@fluentui/react';
import { ISemanticColors, ITheme } from '@fluentui/react/lib/Styling';
import { M365ActualLightTheme } from '@m365-admin/customizations';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { App } from "./App";
import "./index.css";


// Using M365 Theming Engine
// https://github.com/microsoft/fluentui/blob/master/packages/react/src/utilities/ThemeProvider/README.md
// https://uifabric.visualstudio.com/iss/_git/m365-admin?path=%2F__docs__%2Fv8-theme-system.md&_a=preview#
interface IM365ExtendedSemanticColors extends ISemanticColors {

};

interface IM365Theme extends ITheme {
    semanticColors: IM365ExtendedSemanticColors;
}

// Using Fluent UI Icons
// https://github.com/microsoft/fluentui/wiki/Using-icons
// Select Icons Here: https://developer.microsoft.com/en-us/fluentui#/styles/web/icons
initializeIcons();

const rootElement = document.getElementById("root");
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <ThemeProvider theme={M365ActualLightTheme}>
                <App />
            </ThemeProvider>
        </React.StrictMode>
    );
}
