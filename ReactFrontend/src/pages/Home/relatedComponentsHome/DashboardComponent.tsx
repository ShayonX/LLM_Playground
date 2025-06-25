import type { IContextualMenuProps } from "@fluentui/react";
import { FontWeights, memoizeFunction, mergeStyles } from "@fluentui/react";
import type { IThumbnailStackItemProps } from "@m365-admin/card";
import {
    DashboardCard,
    DashboardCardBodyText,
    ThumbnailItemStack,
} from "@m365-admin/card";
import { MultiStackedBarChartHelper } from "@m365-admin/charting-helpers";
import type { ICountAnnotationBarProps } from "@m365-admin/count-annotation";
import { CountAnnotationBar } from "@m365-admin/count-annotation";
import {
    ThrowOnUndefinedColorContext,
    useM365Theme,
} from "@m365-admin/customizations";
import { Dashboard } from "@m365-admin/dashboard";
import type { IRearrangeableGridDefinition } from "@m365-admin/rearrangeable-grid";
import type { FunctionComponent } from "react";
import * as React from "react";
import { useRef, useState } from "react";

// Add responsive styles for dashboard
const getResponsivePadding = () => {
    if (window.innerWidth <= 480) {
        return 8; // Small mobile
    } else if (window.innerWidth <= 768) {
        return 16; // Mobile
    } else {
        return 24; // Desktop
    }
};

// NOTE: This is a DUMMY Dashboard that will be replaced by a fully functioning Dashboard once we spec and design it.
const thumbnailStackItems: IThumbnailStackItemProps[] = [
    {
        imageProps: {
            src: "https://vikicopilotassets.blob.core.windows.net/vikicopilotassets/customizedIllustrationSVG.svg",
            alt: "Customize",
        },
        compoundButtonProps: {
            text: "Customize",
            secondaryText: "This is the secondary text",
        },
    },
    {
        imageProps: {
            src: "https://vikicopilotassets.blob.core.windows.net/vikicopilotassets/adminTrainingIllustrationSVG.svg",
            alt: "Admin Training",
        },
        compoundButtonProps: {
            primary: false,
            text: "Admin Training",
            secondaryText: "This is the secondary text",
        },
    },
    {
        imageProps: {
            src: "https://vikicopilotassets.blob.core.windows.net/vikicopilotassets/userTrainingIllustrationSVG.svg",
            alt: "User training",
        },
        compoundButtonProps: {
            primary: false,
            text: "User training",
            secondaryText: "This is the secondary text",
        },
    },
];

const countAnnotationProps: ICountAnnotationBarProps = {
    countAnnotationProps: [
        { annotationText: "Monday", count: "20%" },
        { annotationText: "Tuesday", count: "39%" },
        { annotationText: "Wednesday", count: "70%" },
    ],
};

const content = (
    <>
        <CountAnnotationBar {...countAnnotationProps} />
        <DashboardCardBodyText
            subHeaderText={"Corperate ipsum text"}
            bodyText={
                "Leverage agile frameworks to provide a robust synopsis for high level overviews."
            }
            linkProps={{
                text: "Bring to the table win-win survival strategies",
            }}
        />
    </>
);

export const DashboardDataManagement: FunctionComponent = () => {
    const theme = useM365Theme();

    const [panelOpen] = useState(false); // Remove setPanelOpen since it's not used

    // store the state of the Dashboard and handle changes within it
    const [map, setMap] = useState<IRearrangeableGridDefinition>({
        third: { cellHeight: 1, cellWidth: 1, row: 0, col: 0 },
        countAnnotationCard: { cellHeight: 1, cellWidth: 1, row: 0, col: 1 },
        thumbnailStackCard: { cellHeight: 1, cellWidth: 1, row: 0, col: 2 },
    });

    const removeText = "Remove";
    const generateRemoveCallback = (key: string) => {
        return () => {
            const newMap = { ...map };

            delete newMap[key];
            setMap(newMap);
        };
    };

    const generateItemMenu = (key: string): IContextualMenuProps => {
        return {
            items: [
                {
                    iconProps: { iconName: "Cancel" },
                    key: removeText,
                    text: removeText,
                    onClick: generateRemoveCallback(key),
                    ariaLabel: "Remove card",
                },
            ],
        };
    };

    const backgroundStyles = mergeStyles({
        display: "flex",
        flex: 1,
        flexFlow: "column nowrap",
        background: theme.semanticColors.dashboardBackdrop,
        padding: getResponsivePadding(), // Use responsive padding
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
    });

    const headerStyles = memoizeFunction(mergeStyles);

    const getCardTitle = (title: string) => {
        const titleClassName = headerStyles([
            theme.fonts.medium,
            { padding: 0, margin: 0, fontWeight: FontWeights.semibold },
        ]);

        return <h3 className={titleClassName}>{title}</h3>;
    };

    return (
        <div
            className={backgroundStyles}
            style={{
                padding:
                    window.innerWidth <= 480
                        ? 8
                        : window.innerWidth <= 768
                        ? 16
                        : 24,
            }}
        >
            <ThrowOnUndefinedColorContext.Provider
                value={{ disableThrowOnUndefinedColor: true }}
            >
                <Dashboard
                    isAddCardPanelOpen={panelOpen}
                    map={map}
                    ariaLabel="Data Management Dashboard"
                    ariaDescription="Use the arrow keys to navigate to a card. Press enter key to enter each item. Press escape to return to the grid when within an item."
                >
                    <DashboardCard
                        titleText={getCardTitle("Message center")}
                        key="third"
                        moreIconButtonProps={{
                            ariaLabel: "More actions",
                            menuProps: generateItemMenu("third"),
                        }}
                        moreIconButtonTooltipHostProps={{
                            content: "More actions",
                        }}
                    >
                        <MultiStackedBarChartHelper
                            visualizationDatapoints={[
                                {
                                    chartTitle: "Monitored",
                                    chartData: [
                                        {
                                            datapointText:
                                                "Debit card numbers (EU and USA)",
                                            datapointValue: 40,
                                        },
                                        {
                                            datapointText:
                                                "Passport numbers (USA)",
                                            datapointValue: 23,
                                        },
                                        {
                                            datapointText:
                                                "Social security numbers",
                                            datapointValue: 35,
                                        },
                                    ],
                                },
                                {
                                    chartTitle: "Unmonitored",
                                    chartData: [
                                        {
                                            datapointText:
                                                "Credit card numbers",
                                            datapointValue: 40,
                                        },
                                        {
                                            datapointText:
                                                "Tax identification numbers (USA)",
                                            datapointValue: 23,
                                        },
                                    ],
                                },
                            ]}
                        />
                    </DashboardCard>

                    <DashboardCard
                        key="countAnnotationCard"
                        headerText={"Count all the things"}
                        titleText="CountAnnotation example"
                        body={content}
                        moreIconButtonTooltipHostProps={{
                            content: "More actions",
                        }}
                        moreIconButtonProps={{
                            ariaLabel: "More actions",
                            menuProps: generateItemMenu("countAnnotationCard"),
                        }}
                    />

                    <DashboardCard
                        key="thumbnailStackCard"
                        titleText="ThumbnailItemStack example"
                        body={
                            <ThumbnailItemStack items={thumbnailStackItems} />
                        }
                        moreIconButtonTooltipHostProps={{
                            content: "More actions",
                        }}
                        moreIconButtonProps={{
                            ariaLabel: "More actions",
                            menuProps: generateItemMenu("thumbnailStackCard"),
                        }}
                    />
                </Dashboard>
            </ThrowOnUndefinedColorContext.Provider>
        </div>
    );
};
