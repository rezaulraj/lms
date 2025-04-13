import React, { useEffect, useState } from 'react';

const ScreenRecordingOverlay = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsVisible(true); // Show overlay when the page is hidden
            } else {
                setIsVisible(false); // Hide overlay when the page is visible
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    return (
        <div
            style={{
                display: isVisible ? 'block' : 'none',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'black',
                zIndex: 9999,
                color: 'white',
                textAlign: 'center',
                marginTop: '20%',
            }}
        >
            <h1>Screen Recording Detected</h1>
        </div>
    );
};

export default ScreenRecordingOverlay;
