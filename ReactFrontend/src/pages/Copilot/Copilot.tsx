import React, { Component } from "react";
import { Header } from "../../components/header/Header";
import { LeftNav } from "../../components/leftNav/LeftNav";
import { Breadcrumbs } from "../../components/breadcrumbs/breadcrumbs";
import ChatBubble from "../../components/chat/ChatBubble";
import { PrimaryButton, TextField, IconButton } from "@fluentui/react";
import { connect } from "react-redux";
import { addMessage, updateLastMessage } from "../../messagesSlice";
import { RootState } from "../../store";

import "./CopilotStyle.css";

interface IAttachment {
    name: string;
    type: string;
    url?: string;
    base64Data?: string;
}

interface IMessage {
    content: string;
    agent: "userAgent" | "copilotAgent";
    attachments?: IAttachment[];
    isCoTReasoning?: boolean; // Flag to indicate if this is CoT reasoning
}

interface IProps {
    addMessage: typeof addMessage;
    updateLastMessage: typeof updateLastMessage;
    messages: IMessage[];
    isChatNarrationEnabled: boolean;
    scenario: string;
}

interface IState {
    loading: boolean;
    isLeftNavCollapsed: boolean;
    messageText: string;
    isFetching: boolean;
    isRecording: boolean;
    isNarrating: boolean;
    selectedFile: File | null;
    isFileUploading: boolean;
    isCoTReasoningActive: boolean;
    currentCoTContent: string;
    currentResponseContent: string;
}

const items = [
    { text: "Home", key: "home", href: "/" },
    { text: "MORGAN", key: "copilot" },
];

class Copilot extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            loading: true,
            isLeftNavCollapsed: false,
            messageText: "",
            isFetching: false,
            isRecording: false,
            isNarrating: false,
            selectedFile: null,
            isFileUploading: false,
            isCoTReasoningActive: false,
            currentCoTContent: "",
            currentResponseContent: "",
        };
    }
    private recognition: any = null;
    private utterance: SpeechSynthesisUtterance | null = null;

    // Helper method to strip Markdown formatting
    private stripMarkdown(text: string): string {
        return text
            .replace(/(\*\*|__)(.*?)\1/g, "$2") // Bold
            .replace(/(\*|_)(.*?)\1/g, "$2") // Italic
            .replace(/~~(.*?)~~/g, "$1") // Strikethrough
            .replace(/`([^`]+)`/g, "$1") // Inline code
            .replace(/!\[.*?\]\(.*?\)/g, "") // Images
            .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Links
            .replace(/^\s*#{1,6}\s*(.+)/gm, "$1") // Headers
            .replace(/^>\s+(.+)/gm, "$1") // Blockquotes
            .replace(/^\s*[-*+]\s+/gm, "") // Unordered lists
            .replace(/^\s*\d+\.\s+/gm, "") // Ordered lists
            .replace(/\n{2,}/g, "\n") // Multiple newlines to one
            .replace(/^[\s]+|[\s]+$/g, "") // Trim spaces
            .replace(/[#*_`~]/g, ""); // Remove residual Markdown characters
    }

    // Helper method to convert file to base64
    private fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                // Remove the data URL prefix to get just the base64 data
                const base64 = result.split(",")[1];
                resolve(base64);
            };
            reader.onerror = (error) => reject(error);
        });
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.handleBeforeUnload);
        this.initializeSpeechRecognition();
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.handleBeforeUnload);
        if (this.recognition) {
            this.recognition.stop();
        }
        if (this.utterance) {
            window.speechSynthesis.cancel();
        }
    }

    initializeSpeechRecognition() {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (typeof SpeechRecognition === "undefined") {
            alert(
                "Your browser does not support speech recognition. Please use Chrome or Edge."
            );
            return;
        }

        this.recognition = new SpeechRecognition();
        if (SpeechRecognition && this.recognition) {
            this.recognition.lang = "en-US";
            this.recognition.continuous = false;
            this.recognition.interimResults = false;

            this.recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                this.setState({ messageText: transcript });
            };

            this.recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                this.setState({ isRecording: false });
            };

            this.recognition.onspeechend = () => {
                console.log("Speech has stopped being detected");
                if (this.recognition != null) {
                    this.recognition.stop();
                }
            };
            this.recognition.onend = () => {
                console.log("Speech recognition ended");
                this.setState({ isRecording: false });
                if (this.state.messageText.trim()) {
                    this.communicateWithCopilotCoT(this.state.messageText);
                }
            };
        } else {
            console.warn(
                "Speech Recognition API not supported in this browser."
            );
        }
    }

    startSpeechRecognition = () => {
        if (this.recognition) {
            this.setState({ isRecording: true, messageText: "" });
            this.recognition.start();
        } else {
            alert("Speech Recognition API not supported in this browser.");
        }
    };

    handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (this.props.messages.length > 1) {
            const warningMessage =
                "Chat history will be deleted. Are you sure you want to leave?";
            e.returnValue = warningMessage; // For most browsers
            return warningMessage; // For some older browsers
        }
    };

    toggleLeftNav = () => {
        this.setState((prevState) => ({
            isLeftNavCollapsed: !prevState.isLeftNavCollapsed,
        }));
    };
    handleTextChange = (
        _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        newValue?: string
    ) => {
        if (newValue !== undefined) {
            this.setState({ messageText: newValue });
        }
    };

    handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevents the default behavior of creating a new line
            if (this.state.messageText.trim()) {
                this.communicateWithCopilotCoT(this.state.messageText);
            }
        }
    };

    // Helper function to detect the browser
    getBrowserName = () => {
        const userAgent = navigator.userAgent;
        if (userAgent.indexOf("Firefox") > -1) {
            return "Firefox";
        } else if (
            userAgent.indexOf("Edg") > -1 ||
            userAgent.indexOf("Edge") > -1
        ) {
            return "Edge";
        } else if (userAgent.indexOf("Chrome") > -1) {
            return "Chrome";
        } else if (userAgent.indexOf("Safari") > -1) {
            return "Safari";
        } else {
            return "Other";
        }
    };

    // Helper function to wait for voices to be loaded
    waitForVoices = () => {
        return new Promise<void>((resolve) => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                resolve(); // Voices are already loaded
            } else {
                window.speechSynthesis.onvoiceschanged = () => {
                    resolve();
                };
            }
        });
    };

    // Helper function to get the best available voice for the browser
    getBestVoice = (voices: SpeechSynthesisVoice[]) => {
        const browser = this.getBrowserName();
        let bestVoice = null;

        if (browser === "Edge") {
            // Google Chrome-specific voices
            bestVoice = voices.find(
                (voice) =>
                    voice.name.includes("Jenny") || voice.name.includes("en-US")
            );
        } else if (browser === "Chrome") {
            // Google Chrome-specific voices
            bestVoice = voices.find(
                (voice) =>
                    voice.name.includes("Google US English") ||
                    voice.name.includes("en-US")
            );
        } else if (browser === "Firefox") {
            // Firefox typically uses OS voices
            bestVoice = voices.find(
                (voice) =>
                    voice.name.includes("Microsoft Jenny") ||
                    voice.name.includes("en-US")
            );
        } else if (browser === "Safari") {
            // macOS/iOS voices
            bestVoice = voices.find(
                (voice) =>
                    voice.name.includes("Samantha") ||
                    voice.name.includes("Daniel") ||
                    voice.name.includes("en-US")
            );
        }

        // Fallback to any English voice if the desired one is not found
        if (!bestVoice) {
            bestVoice = voices.find((voice) => voice.lang.startsWith("en"));
        }

        return bestVoice;
    };

    speakText = async (text: string) => {
        if (this.props.isChatNarrationEnabled) {
            if ("speechSynthesis" in window) {
                // Stop any ongoing speech synthesis
                if (this.utterance) {
                    window.speechSynthesis.cancel();
                }

                // Strip Markdown formatting
                const plainText = this.stripMarkdown(text);
                this.utterance = new SpeechSynthesisUtterance(plainText);

                // Wait for voices to be loaded
                await this.waitForVoices();

                const voices = window.speechSynthesis.getVoices();
                const bestVoice = this.getBestVoice(voices);

                if (bestVoice) {
                    this.utterance.voice = bestVoice;
                } else {
                    console.warn(
                        "No suitable voice found, using default voice."
                    );
                }

                this.utterance.lang = "en-US";

                // Update state when narration ends
                this.utterance.onend = () => {
                    this.setState({ isNarrating: false });
                    this.utterance = null;
                };

                window.speechSynthesis.speak(this.utterance);
                this.setState({ isNarrating: true });
            } else {
                console.warn("Speech Synthesis not supported in this browser.");
            }
        }
    };

    stopNarration = () => {
        if (this.utterance) {
            window.speechSynthesis.cancel();
            this.setState({ isNarrating: false });
            this.utterance = null;
        }
    };

    // File handling methods
    handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type === "application/pdf") {
                this.setState({ selectedFile: file });
            } else {
                alert("Please select a PDF file only.");
                event.target.value = ""; // Reset the input
            }
        }
    };

    removeSelectedFile = () => {
        this.setState({ selectedFile: null });
        // Reset the file input
        const fileInput = document.getElementById(
            "fileInput"
        ) as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }
    };
    async communicateWithCopilot(message: string) {
        this.setState({ messageText: "" }); // reset the messageText to empty string
        this.setState({ isFetching: true }); // set isFetching to true at the beginning
        try {
            // Prepare attachment data if file exists
            let attachments: IAttachment[] | undefined = undefined;
            if (this.state.selectedFile) {
                // Convert file to base64 for storing in message
                const base64Data = await this.fileToBase64(
                    this.state.selectedFile
                );
                attachments = [
                    {
                        name: this.state.selectedFile.name,
                        type: this.state.selectedFile.type,
                        base64Data: base64Data,
                    },
                ];
            }

            // Dispatch the addMessage action with potential attachments
            this.props.addMessage({
                content: message,
                agent: "userAgent",
                attachments: attachments,
            });

            // Check if there's a file to upload
            if (this.state.selectedFile) {
                this.setState({ isFileUploading: true });

                const formData = new FormData();
                formData.append("file", this.state.selectedFile);
                formData.append("message", message);
                formData.append("scenario", this.props.scenario || "default");
                formData.append(
                    "messages",
                    JSON.stringify(
                        this.props.messages.map((msg) => ({
                            content: msg.content,
                            agent: msg.agent,
                        }))
                    )
                );

                const response = await fetch("/api/chat/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data);

                // Add the copilot's message to the state
                this.props.addMessage({
                    content: data.response,
                    agent: "copilotAgent",
                });

                this.speakText(data.response);

                // Clear the selected file after successful upload
                this.removeSelectedFile();
            } else {
                // No file, use regular chat endpoint
                const requestBody = {
                    message: message,
                    scenario: this.props.scenario || "default",
                    messages: this.props.messages.map((msg) => ({
                        content: msg.content,
                        agent: msg.agent,
                    })),
                };

                const response = await fetch("/api/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data);

                // Add the copilot's message to the state
                this.props.addMessage({
                    content: data.response,
                    agent: "copilotAgent",
                });

                this.speakText(data.response);
            }
        } catch (error) {
            console.error("Failed to fetch:", error);
        } finally {
            this.setState({ isFetching: false, isFileUploading: false }); // reset isFetching to false in the end, regardless of success or error
        }
    }
    async communicateWithCopilotCoT(message: string) {
        this.setState({
            messageText: "",
            isFetching: true,
            isCoTReasoningActive: false,
            currentCoTContent: "",
            currentResponseContent: "",
        });

        try {
            // Prepare attachment data if file exists
            let attachments: IAttachment[] | undefined = undefined;
            if (this.state.selectedFile) {
                const base64Data = await this.fileToBase64(
                    this.state.selectedFile
                );
                attachments = [
                    {
                        name: this.state.selectedFile.name,
                        type: this.state.selectedFile.type,
                        base64Data: base64Data,
                    },
                ];
            }

            // Dispatch the user message
            this.props.addMessage({
                content: message,
                agent: "userAgent",
                attachments: attachments,
            });

            let response: Response;

            // Check if there's a file to upload
            if (this.state.selectedFile) {
                this.setState({ isFileUploading: true });

                // Use CoT upload endpoint for file uploads
                const formData = new FormData();
                formData.append("file", this.state.selectedFile);
                formData.append("message", message);
                formData.append("scenario", this.props.scenario || "default");
                formData.append(
                    "messages",
                    JSON.stringify(
                        this.props.messages.map((msg) => ({
                            content: msg.content,
                            agent: msg.agent,
                        }))
                    )
                );

                response = await fetch("/api/chat/upload-cot-stream", {
                    method: "POST",
                    body: formData,
                });
            } else {
                // No file, use regular CoT chat endpoint
                const requestBody = {
                    message: message,
                    scenario: this.props.scenario || "default",
                    messages: this.props.messages.map((msg) => ({
                        content: msg.content,
                        agent: msg.agent,
                    })),
                };

                response = await fetch("/api/chat/cot-stream", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                });
            }

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error("No response reader available");
            }
            const decoder = new TextDecoder();
            let cotMessageAdded = false;
            let contentMessageAdded = false;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const data = line.slice(6);
                        if (data.trim() === "") continue;

                        try {
                            const parsed = JSON.parse(data);
                            switch (parsed.type) {
                                case "file_processed":
                                    console.log(
                                        `File processed: ${parsed.filename}, Content length: ${parsed.content_length}`
                                    );
                                    break;
                                case "reasoning_start":
                                    this.setState({
                                        isCoTReasoningActive: true,
                                        currentCoTContent: "",
                                    });
                                    // Add CoT message placeholder
                                    this.props.addMessage({
                                        content: "",
                                        agent: "copilotAgent",
                                        isCoTReasoning: true,
                                    });
                                    cotMessageAdded = true;
                                    break;
                                case "reasoning":
                                    if (parsed.content) {
                                        this.setState((prevState) => {
                                            const newContent =
                                                prevState.currentCoTContent +
                                                parsed.content;
                                            // Update the CoT message with the new content
                                            if (cotMessageAdded) {
                                                this.props.updateLastMessage(
                                                    newContent
                                                );
                                            }
                                            return {
                                                currentCoTContent: newContent,
                                            };
                                        });
                                    }
                                    break;

                                case "reasoning_end":
                                    this.setState({
                                        isCoTReasoningActive: false,
                                    });
                                    break;

                                case "content_start":
                                    this.setState({
                                        currentResponseContent: "",
                                    });
                                    // Don't add message yet, wait for actual content
                                    break;
                                case "content":
                                    if (parsed.content) {
                                        // Add the response message only when we get the first content
                                        if (!contentMessageAdded) {
                                            this.props.addMessage({
                                                content: "",
                                                agent: "copilotAgent",
                                                isCoTReasoning: false,
                                            });
                                            contentMessageAdded = true;
                                        }

                                        this.setState((prevState) => {
                                            const newContent =
                                                prevState.currentResponseContent +
                                                parsed.content;
                                            // Update the final response message
                                            this.props.updateLastMessage(
                                                newContent
                                            );
                                            return {
                                                currentResponseContent:
                                                    newContent,
                                            };
                                        });
                                    }
                                    break;
                                case "content_end":
                                    // Speak the final response if narration is enabled
                                    if (this.state.currentResponseContent) {
                                        this.speakText(
                                            this.state.currentResponseContent
                                        );
                                    }
                                    break;
                                case "function_call":
                                    console.log(
                                        `Function call: ${parsed.function}, Status: ${parsed.status}, Context: ${parsed.context}`
                                    );
                                    break;
                                case "function_result":
                                    console.log(
                                        `Function result: ${parsed.function}, Status: ${parsed.status}`
                                    );
                                    if (parsed.error) {
                                        console.error(
                                            `Function error: ${parsed.error}`
                                        );
                                    }
                                    break;
                                case "analysis_summary":
                                    console.log(
                                        `Analysis summary - Document processed: ${parsed.document_processed}, Functions called: ${parsed.functions_called}, Filename: ${parsed.filename}`
                                    );
                                    break;
                                case "done":
                                    // Add fallback response if no content was generated
                                    if (
                                        !contentMessageAdded &&
                                        this.state.currentResponseContent === ""
                                    ) {
                                        this.props.addMessage({
                                            content:
                                                "I've analyzed the document, but I don't have a specific response to provide. Please try asking a more specific question about the document content.",
                                            agent: "copilotAgent",
                                            isCoTReasoning: false,
                                        });
                                    }

                                    // Clear the selected file after successful completion
                                    if (this.state.selectedFile) {
                                        this.removeSelectedFile();
                                    }
                                    break;

                                case "error":
                                    console.error(
                                        "CoT Stream error:",
                                        parsed.error
                                    );
                                    break;

                                // Enhanced streaming event types
                                case "stream_created":
                                    console.log(
                                        "Stream created:",
                                        parsed.message
                                    );
                                    // Could add UI indicator that stream has started
                                    break;
                                case "stream_progress":
                                    console.log(
                                        "Stream progress:",
                                        parsed.message
                                    );
                                    // Could add progress indicator
                                    break;
                                case "stream_completed":
                                    console.log(
                                        "Stream completed:",
                                        parsed.message
                                    );
                                    // Could add completion indicator or cleanup
                                    break;
                                case "output_item_added":
                                    console.log(
                                        "Output item added:",
                                        parsed.item_id,
                                        parsed.type
                                    );
                                    // Could track output items being created
                                    break;
                                case "output_item_done":
                                    console.log(
                                        "Output item done:",
                                        parsed.item_id,
                                        parsed.type
                                    );
                                    // Could update UI to show item completion
                                    break;
                                case "function_args_delta":
                                    console.log(
                                        `Function args delta for ${parsed.function}: ${parsed.delta}`
                                    );
                                    // Could show real-time function argument building
                                    break;
                                case "function_args_complete":
                                    console.log(
                                        `Function args complete for ${parsed.function}: ${parsed.arguments}`
                                    );
                                    // Could show completed function arguments
                                    break;
                                case "response.created":
                                case "response.in_progress":
                                case "response.completed":
                                case "response.function_call_arguments.delta":
                                case "response.function_call_arguments.done":
                                case "response.output_item.added":
                                case "response.output_item.done":
                                    // Handle OpenAI native event types
                                    console.log(
                                        "OpenAI native event:",
                                        parsed.type,
                                        parsed
                                    );
                                    break;
                                // ...existing cases...
                            }
                        } catch (parseError) {
                            console.error(
                                "Error parsing stream data:",
                                parseError
                            );
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch CoT stream:", error);
        } finally {
            this.setState({
                isFetching: false,
                isFileUploading: false,
                isCoTReasoningActive: false,
            });
        }
    }

    render() {
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
                                        <div className="label"></div>
                                    </div>
                                </div>

                                {/* New chat container structure */}
                                <div className="chat-container">
                                    {/* Chat messages area - 90% height */}
                                    <div className="chat-messages">
                                        <ChatBubble
                                            message="Hello there! I am MORGAN. I can help you with your company's inter-department data needs."
                                            agent="copilotAgent"
                                        />{" "}
                                        {this.props.messages.map(
                                            (message, index) => (
                                                <ChatBubble
                                                    key={index}
                                                    message={message.content}
                                                    agent={message.agent}
                                                    attachments={
                                                        message.attachments
                                                    }
                                                    isCoTReasoning={
                                                        message.isCoTReasoning
                                                    }
                                                />
                                            )
                                        )}
                                        {this.state.isCoTReasoningActive && (
                                            <div className="cot-streaming-indicator">
                                                <span className="cot-streaming-icon">
                                                    🧠
                                                </span>
                                                <span>
                                                    Chain of Thought reasoning
                                                    in progress...
                                                </span>
                                            </div>
                                        )}
                                        {this.state.isFetching &&
                                            !this.state
                                                .isCoTReasoningActive && (
                                                <div
                                                    style={{
                                                        display: "inline-block",
                                                        marginLeft: "10px",
                                                    }}
                                                >
                                                    <span className="dot-loading"></span>
                                                    <span className="dot-loading"></span>
                                                    <span className="dot-loading"></span>
                                                </div>
                                            )}
                                        {this.state.isNarrating && (
                                            <div className="stopNarrationButtonContainer">
                                                <PrimaryButton
                                                    text="Stop"
                                                    onClick={this.stopNarration}
                                                    className="stopNarrationButton"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Chat input area - 10% height */}
                                    <div className="chat-input-container">
                                        <div className="messageControls">
                                            {this.state.isRecording ? (
                                                // Waveform animation while recording
                                                <div className="waveform-animation">
                                                    <div className="waveform-bar"></div>
                                                    <div className="waveform-bar"></div>
                                                    <div className="waveform-bar"></div>
                                                    <div className="waveform-bar"></div>
                                                    <div className="waveform-bar"></div>
                                                </div>
                                            ) : (
                                                // Controls when not recording
                                                <>
                                                    {/* Show selected file */}
                                                    {this.state
                                                        .selectedFile && (
                                                        <div className="selected-file-display">
                                                            <span className="file-name">
                                                                📄{" "}
                                                                {
                                                                    this.state
                                                                        .selectedFile
                                                                        .name
                                                                }
                                                            </span>
                                                            <IconButton
                                                                iconProps={{
                                                                    iconName:
                                                                        "Cancel",
                                                                }}
                                                                onClick={
                                                                    this
                                                                        .removeSelectedFile
                                                                }
                                                                title="Remove file"
                                                                ariaLabel="Remove file"
                                                                style={{
                                                                    marginLeft:
                                                                        "5px",
                                                                    minWidth:
                                                                        "24px",
                                                                    height: "24px",
                                                                    backgroundColor:
                                                                        "#d13438",
                                                                    color: "white",
                                                                }}
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="input-row">
                                                        <IconButton
                                                            iconProps={{
                                                                iconName:
                                                                    "Microphone",
                                                            }}
                                                            title="Start Voice Input"
                                                            ariaLabel="Start Voice Input"
                                                            onClick={
                                                                this
                                                                    .startSpeechRecognition
                                                            }
                                                            disabled={
                                                                this.state
                                                                    .isRecording ||
                                                                this.state
                                                                    .isFetching
                                                            }
                                                        />

                                                        {/* File Upload Button */}
                                                        <input
                                                            type="file"
                                                            id="fileInput"
                                                            accept=".pdf"
                                                            onChange={
                                                                this
                                                                    .handleFileSelect
                                                            }
                                                            style={{
                                                                display: "none",
                                                            }}
                                                        />
                                                        <IconButton
                                                            iconProps={{
                                                                iconName:
                                                                    "Attach",
                                                            }}
                                                            title="Upload PDF"
                                                            ariaLabel="Upload PDF"
                                                            onClick={() => {
                                                                const fileInput =
                                                                    document.getElementById(
                                                                        "fileInput"
                                                                    ) as HTMLInputElement;
                                                                fileInput?.click();
                                                            }}
                                                            disabled={
                                                                this.state
                                                                    .isRecording ||
                                                                this.state
                                                                    .isFetching ||
                                                                this.state
                                                                    .isFileUploading
                                                            }
                                                            style={{
                                                                backgroundColor:
                                                                    this.state
                                                                        .selectedFile
                                                                        ? "#0078d4"
                                                                        : undefined,
                                                                color: this
                                                                    .state
                                                                    .selectedFile
                                                                    ? "white"
                                                                    : undefined,
                                                            }}
                                                        />

                                                        <TextField
                                                            id={"messageText"}
                                                            borderless
                                                            placeholder={
                                                                this.state
                                                                    .selectedFile
                                                                    ? `Send a message with ${this.state.selectedFile.name}`
                                                                    : "Send a message."
                                                            }
                                                            multiline
                                                            autoAdjustHeight
                                                            onChange={
                                                                this
                                                                    .handleTextChange
                                                            }
                                                            onKeyDown={
                                                                this
                                                                    .handleKeyDown
                                                            }
                                                            value={
                                                                this.state
                                                                    .messageText
                                                            }
                                                            disabled={
                                                                this.state
                                                                    .isRecording ||
                                                                this.state
                                                                    .isFetching
                                                            }
                                                        />

                                                        <PrimaryButton
                                                            text={
                                                                this.state
                                                                    .isFileUploading
                                                                    ? "Uploading..."
                                                                    : "Send"
                                                            }
                                                            onClick={() =>
                                                                this.communicateWithCopilotCoT(
                                                                    this.state
                                                                        .messageText
                                                                )
                                                            }
                                                            disabled={
                                                                !this.state.messageText.trim() ||
                                                                this.state
                                                                    .isFetching ||
                                                                this.state
                                                                    .isRecording ||
                                                                this.state
                                                                    .isFileUploading
                                                            }
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// Maps the state from Redux store to the props of the component
const mapStateToProps = (state: RootState) => {
    return {
        messages: state.messages,
        isChatNarrationEnabled: state.toggle.isChatNarrationEnabled,
        scenario: state.scenario.scenario,
    };
};

// Maps the dispatch function to the props of the component
const mapDispatchToProps = {
    addMessage,
    updateLastMessage,
};

// Connects the Copilot component to the Redux store
export default connect(mapStateToProps, mapDispatchToProps)(Copilot);
