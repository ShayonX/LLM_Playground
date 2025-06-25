// Header.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toggle } from "@fluentui/react"; // Import the Toggle component
import { RootState } from "../../store";
import { setChatNarration } from "../../toggleSlice"; // Import the action
import "./HeaderStyle.css";

export const Header = (): JSX.Element => {
    const dispatch = useDispatch();
    const isChatNarrationEnabled = useSelector(
        (state: RootState) => state.toggle.isChatNarrationEnabled
    );

    const handleToggleChange = (
        event: React.MouseEvent<HTMLElement>,
        checked?: boolean
    ) => {
        dispatch(setChatNarration(!!checked));
    };

    return (
        <div className="header-new">
            <div className="text-wrapper">Microsoft</div>
            <div className="windows-logo">
                <div className="rectangle" />
                <div className="rectangle-2" />
                <div className="rectangle-3" />
                <div className="rectangle-4" />
            </div>
            <div className="sign-in">
                <img
                    src={
                        "https://th.bing.com/th/id/R.f4699df7bc717c9f8996da48bfec7879?rik=pj8nIL3ZZC8leQ&riu=http%3a%2f%2fpngimg.com%2fuploads%2fpokemon%2fpokemon_PNG14.png&ehk=2ojy1p4%2f0QPeqLqFkJ144kuBrWdBOqSkVEdGuWWIf7s%3d&risl=&pid=ImgRaw&r=0"
                    }
                    alt="User Profile"
                    style={{
                        width: "28px",
                        height: "28px",
                        marginRight: "10px",
                        borderRadius: "50%",
                        objectFit: "cover",
                    }}
                />
            </div>
            <div className="text-wrapper-narration">Chat Narration</div>
            <div className="chat-narration-toggle">
                <Toggle
                    checked={isChatNarrationEnabled}
                    onChange={handleToggleChange}
                />
            </div>
        </div>
    );
};
