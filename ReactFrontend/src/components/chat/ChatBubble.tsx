import React, { useEffect, useRef } from "react";
import { Remarkable } from "remarkable";

import "./ChatBubbleStyle.css";

interface IAttachment {
    name: string;
    type: string;
    url?: string;
    base64Data?: string;
}

interface ChatBubbleProps {
    message: string;
    agent: "copilotAgent" | "userAgent";
    attachments?: IAttachment[];
    isCoTReasoning?: boolean;
}

const isJsonString = (str: string) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

const ChatBubble: React.FC<ChatBubbleProps> = ({
    message,
    agent,
    attachments,
    isCoTReasoning,
}) => {
    const isJSON = isJsonString(message);
    const formattedMessage = isJSON
        ? JSON.stringify(JSON.parse(message), null, 2)
        : message;
    const md = new Remarkable(); // Initialize Remarkable

    // Different styling for CoT reasoning vs regular responses
    const getBubbleBackgroundColor = () => {
        if (agent === "userAgent") return "#45586B";
        return isCoTReasoning ? "#FFA500" : "#298FE3"; // Orange for CoT, blue for regular response
    };

    const bubbleStyle: React.CSSProperties = {
        padding: "10px 20px",
        borderRadius: isCoTReasoning ? "10px" : "20px", // More rectangular for CoT
        backgroundColor: getBubbleBackgroundColor(),
        maxWidth: "40vw",
        wordBreak: "break-word",
        boxShadow: isCoTReasoning
            ? "0 2px 4px rgba(255, 165, 0, 0.3), 0 1px 2px rgba(255, 165, 0, 0.2)" // Orange shadow for CoT
            : "0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.08)",
        whiteSpace: isJSON ? "pre-wrap" : "normal",
        color: "white",
        marginBottom: "8px",
        alignSelf: agent === "copilotAgent" ? "flex-start" : "flex-end",
        fontFamily: isJSON
            ? "monospace"
            : isCoTReasoning
            ? "monospace"
            : "inherit", // Monospace for CoT
        overflowWrap: "break-word",
        animation: "slideFadeIn 300ms forwards",
        opacity: isCoTReasoning ? 0.9 : 1, // Slightly transparent for CoT
        fontStyle: isCoTReasoning ? "italic" : "normal", // Italic for CoT
        fontSize: isCoTReasoning ? "0.9em" : "1em", // Slightly smaller for CoT
    };

    const containerStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        width: "60vw",
        alignItems: agent === "copilotAgent" ? "flex-start" : "flex-end",
    }; // Function to handle PDF viewing
    const handleViewPDF = (attachment: IAttachment) => {
        if (attachment.base64Data) {
            const pdfBlob = new Blob(
                [
                    Uint8Array.from(atob(attachment.base64Data), (c) =>
                        c.charCodeAt(0)
                    ),
                ],
                {
                    type: "application/pdf",
                }
            );
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, "_blank");
        } else if (attachment.url) {
            window.open(attachment.url, "_blank");
        }
    };

    // Reference to the div that will contain the rendered markdown
    const renderedContentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        // Highlight href elements after rendering
        if (renderedContentRef.current) {
            const links = renderedContentRef.current.querySelectorAll("a");
            links.forEach((link) => {
                link.style.backgroundColor = "white"; // Apply white background highlight
                link.style.color = "#298FE3"; // Adjust text color to match the agent's bubble
                link.style.padding = "2px 4px"; // Optional: add some padding for better appearance
                link.style.borderRadius = "4px"; // Optional: add border-radius for better appearance
                link.style.textDecoration = "none"; // Optional: remove underline
            });
        }
    }, [formattedMessage]); // Dependency array ensures this runs on message change

    return (
        <div style={containerStyle}>
            {/* Add CoT reasoning label */}
            {isCoTReasoning && (
                <div
                    style={{
                        fontSize: "0.8em",
                        color: "#FFA500",
                        fontWeight: "bold",
                        marginBottom: "4px",
                        alignSelf: "flex-start",
                        fontStyle: "italic",
                    }}
                >
                    💭 Chain of Thought Reasoning...
                </div>
            )}
            <div style={bubbleStyle}>
                {isJSON ? (
                    formattedMessage
                ) : (
                    <div
                        ref={renderedContentRef} // Assign the ref to the div
                        dangerouslySetInnerHTML={{
                            __html: md.render(formattedMessage),
                        }}
                    /> // Render message as markdown with Remarkable
                )}
                {/* Render attachments if they exist */}
                {attachments && attachments.length > 0 && (
                    <div style={{ marginTop: "8px" }}>
                        {attachments.map((attachment, index) => (
                            <div
                                key={index}
                                className="pdf-attachment"
                                onClick={() => handleViewPDF(attachment)}
                            >
                                <span className="pdf-icon">📄</span>
                                <span className="pdf-name">
                                    {attachment.name}
                                </span>
                                <span className="pdf-action">
                                    Click to view
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatBubble;
