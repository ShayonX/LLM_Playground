import * as React from "react";
import { IBreadcrumbItem as FabricIBreadcrumbItem } from "@fluentui/react";
import type { IBreadcrumbProps } from "@fluentui/react";
import { useM365Theme } from "@m365-admin/customizations";
import { M365Breadcrumb } from "@m365-admin/m365-breadcrumb";
import "./breadcrumbsStyle.css";

export function Breadcrumbs(
    props: IBreadcrumbProps & { showHeader?: boolean }
): JSX.Element {
    const { items, showHeader = false, style } = props;
    const theme = useM365Theme();
    const ariaLabel = props.ariaLabel || (items && items[0]?.text) || "";

    for (let index = 0; items && index < items.length; index++) {
        (items[index] as FabricIBreadcrumbItem).isCurrentItem =
            index === items.length - 1;
    }

    const header =
        items && items.length ? (
            <h1 aria-label={ariaLabel} className="title-style">
                {items[items.length - 1].text}
            </h1>
        ) : null;

    if (items && items.length === 1) {
        return <>{header}</>;
    }
    const breadcrumb = (
        <M365Breadcrumb
            className="breadcrumbs-row"
            style={{
                ...style,
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden",
                boxSizing: "border-box",
            }}
            items={items}
            ariaLabel={ariaLabel}
            overflowAriaLabel={props.overflowAriaLabel}
            overflowIndex={props.overflowIndex}
            styles={{
                root: {
                    marginTop: 0,
                    marginBottom: 0,
                    width: "100%",
                    maxWidth: "100%",
                    overflow: "hidden",
                    boxSizing: "border-box",
                },
            }}
        />
    );

    if (!showHeader) {
        return breadcrumb;
    }

    return (
        <>
            {breadcrumb}
            {header}
        </>
    );
}
