import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const isStandalone = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
};

const isIosDevice = () => typeof navigator !== 'undefined'
    && (/iphone|ipad|ipod/i.test(navigator.userAgent)
        || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

const InstallFretsButton = () => {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [installed, setInstalled] = useState(isStandalone);

    useEffect(() => {
        const handleBeforeInstallPrompt = event => {
            event.preventDefault();
            setInstallPrompt(event);
        };
        const handleAppInstalled = () => {
            setInstalled(true);
            setInstallPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstall = async () => {
        if (installPrompt) {
            await installPrompt.prompt();
            setInstallPrompt(null);
            return;
        }

        if (isIosDevice()) {
            window.alert('To install Frets, tap Share in Safari, then choose Add to Home Screen.');
        } else {
            window.alert('To install Frets, open your browser menu and choose Install app or Add to Home Screen.');
        }
    };

    if (installed) return null;

    // Supported Android browsers expose the native install prompt. iOS uses
    // manual installation guidance because it has no equivalent prompt API.
    if (!installPrompt && !isIosDevice()) return null;

    return <button
        type="button"
        className="control-button"
        onClick={handleInstall}
        aria-label="Install Frets"
    >
        Install Frets <FontAwesomeIcon icon={faDownload} />
    </button>;
};

export default InstallFretsButton;
