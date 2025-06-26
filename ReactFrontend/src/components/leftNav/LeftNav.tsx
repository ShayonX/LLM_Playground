import {
    Checkbox,
    ChoiceGroup,
    DefaultButton,
    Dropdown,
    Link,
    mergeStyles,
    Toggle,
} from "@fluentui/react";
import { useM365Theme } from "@m365-admin/customizations";
import type { INavLink, INavLinkGroup } from "@m365-admin/nav";
import { Nav } from "@m365-admin/nav";
import { Link as RouteLink, useMatch, useNavigate } from "react-router-dom";
import type { FC, MouseEvent } from "react";
import * as React from "react";

const { useState, useEffect } = React;

interface LeftNavProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
}

/**
 * REMEMBER THIS!!
 *
 * (Optional) By default, any link with onClick defined will render as a button.
 * Set this property to true to override that behavior. (Links with onClick defined
 * will render as buttons by default.)
 * NOTE: If you force true without href prop the link will not work with keyboard
 */
// forceAnchor?: boolean;

export const LeftNav: FC<LeftNavProps> = ({
    isCollapsed: externalIsCollapsed,
    onToggle,
}) => {
    // Initial state based on window's width
    const [isNavCollapsed, setIsNavCollapsed] = useState(
        externalIsCollapsed ?? window.innerWidth < 760
    );

    const [isAdminOpsExpanded, setIsAdminOpsExpanded] = useState(false);
    const [showTitleTeachingBubble, setShowTitleTeachingBubble] =
        useState(false);
    const theme = useM365Theme();

    useEffect(() => {
        const handleResize = () => {
            if (externalIsCollapsed === undefined) {
                // Only set if external prop isn't passed.
                setIsNavCollapsed(window.innerWidth < 760);
            }
        };

        // Attach the event listener
        window.addEventListener("resize", handleResize);

        // Set initial state
        handleResize();

        // Cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, [externalIsCollapsed]);

    // handle onNavCollapsed since we are using the managed pattern
    // the callback passes the internal state of isNavCollapsed back but since
    // we are handling it on our own we don't need it hence the "_"
    const _onNavCollapsed = (_isNavCollapsed: boolean) => {
        setIsNavCollapsed(!isNavCollapsed);
        if (onToggle) {
            onToggle(); // Inform the parent about the collapse state change.
        }
    };

    const _toggleTeachingBubble = () => {
        setShowTitleTeachingBubble(!showTitleTeachingBubble);
    };

    const _onDismiss = () => {
        setShowTitleTeachingBubble(false);
    };

    const navigate = useNavigate();

    const navLinkGroups: INavLinkGroup[] = [
        {
            key: "VikiNonAdminGroup",
            // name: 'testing',
            groupTitleAttributes: {
                id: "nav_group_1",
            },
            showHeaderTeachingBubble: showTitleTeachingBubble,
            headerTeachingBubbleProps: {
                closeButtonAriaLabel: "Close teaching bubble",
                headline: "Nav teaching bubble",
                onDismiss: _onDismiss,
                primaryButtonProps: { children: "primary" },
                secondaryButtonProps: { children: "secondary" },
                children: (
                    <>
                        Here is some content to put in a teaching bubble on the
                        nav{" "}
                    </>
                ),
            },
            links: [
                {
                    name: "Home",
                    title: "Home",
                    key: "homeKey",
                    href: "",
                    icon: "Home",
                    forceAnchor: true,
                    isSelected: !!useMatch("/"),
                    onClick: ((
                        _ev?: React.MouseEvent<HTMLElement, MouseEvent>,
                        item?: INavLink
                    ) => {
                        if (item) {
                            console.log("Navigating to Home", item);
                            navigate("/");
                        }
                    }) as any,
                },
                {
                    name: "MORGAN",
                    title: "Copilot",
                    key: "copilotKey",
                    href: "",
                    icon: "OfficeChat",
                    forceAnchor: true,
                    isSelected: !!useMatch("/copilot"),
                    onClick: ((
                        _ev?: React.MouseEvent<HTMLElement, MouseEvent>,
                        item?: INavLink
                    ) => {
                        if (item) {
                            console.log("Navigating to Copilot", item);
                            navigate("/copilot");
                        }
                    }) as any,
                },
            ],
        },
    ];

    const navStyle = mergeStyles({ display: "flex", flex: 1, height: "100vh" });

    return (
        <div className={navStyle}>
            <Nav
                groups={navLinkGroups}
                enableCustomization={false}
                showMore={false}
                isNavCollapsed={isNavCollapsed}
                onNavCollapsed={_onNavCollapsed}
                showMoreLinkProps={{
                    "data-hint": "telemetry test",
                    title: "Show more",
                    "aria-label": "Show more",
                }}
                collapseNavLinkProps={{
                    "data-hint": "collapse test",
                    title: isNavCollapsed
                        ? "Expand Navigation"
                        : "Collapse Navigation",
                    primaryIconName: "GlobalNavButton",
                    "aria-label": isNavCollapsed
                        ? "Expand Navigation"
                        : "Collapse Navigation",
                    forceAnchor: true,
                }}
            />
        </div>
    );
};
