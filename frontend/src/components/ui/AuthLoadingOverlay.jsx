// AuthLoadingOverlay.jsx
import React from 'react';

const loadingMessages = [
    "Checking your session...",
    "Waking up the server, this can take a few seconds...",
    "Almost there, hang tight...",
    "Cold start in progress, thanks for your patience...",
];

const AuthLoadingOverlay = ({ isLoading }) => {
    const [messageIndex, setMessageIndex] = React.useState(0);
    const [showMessage, setShowMessage] = React.useState(false);

    React.useEffect(() => {
        if (!isLoading) {
            setShowMessage(false);
            setMessageIndex(0);
            return;
        }

        const revealTimer = setTimeout(() => setShowMessage(true), 1500);
        const rotateTimer = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 2200);

        return () => {
            clearTimeout(revealTimer);
            clearInterval(rotateTimer);
        };
    }, [isLoading]);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
            <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
            {showMessage && (
                <p className="mt-4 text-emerald-700 text-sm font-medium text-center px-6">
                    {loadingMessages[messageIndex]}
                </p>
            )}
        </div>
    );
};

export default AuthLoadingOverlay;