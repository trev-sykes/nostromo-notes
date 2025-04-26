import { useState, useEffect } from "react";
import useNoteStore from "../../store/useNoteStore";
import styles from "./Dashboard.module.css";

export const Dashboard = () => {
    const { notes, writeNote, deleteNote, clearNotes } = useNoteStore();
    const [input, setInput] = useState("");
    const [cursor, setCursor] = useState(true);
    const [bootSequence, setBootSequence] = useState(true);
    const [bootText, setBootText] = useState("");
    const fullBootText = "WEYLAND-YUTANI CORP.\nMU/TH/UR 6000\nNOTES MODULE V2.4.0\nINITIALIZING...";

    // Blinking cursor effect
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setCursor(prev => !prev);
        }, 530);
        return () => clearInterval(cursorInterval);
    }, []);

    // Boot sequence effect
    useEffect(() => {
        if (!bootSequence) return;

        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < fullBootText.length) {
                setBootText(prev => prev + fullBootText.charAt(i));
                i++;
            } else {
                clearInterval(typeInterval);
                setTimeout(() => setBootSequence(false), 1000);
            }
        }, 40);

        return () => clearInterval(typeInterval);
    }, [bootSequence]);

    const handleAddNote = () => {
        if (input.trim() === "") return;
        writeNote(input);
        setInput("");
    };

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            handleAddNote();
        }
    };

    if (bootSequence) {
        return (
            <div className={styles.container}>
                <div className={styles.bootScreen}>
                    <pre className={styles.bootText}>
                        {bootText}{cursor ? "_" : " "}
                    </pre>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Scan lines and flicker overlays */}
            <div className={styles.scanLines}></div>
            <div className={styles.screenFlicker}></div>

            <div className={styles.terminalWrapper}>
                {/* Header */}
                <header className={styles.terminalHeader}>
                    <div className={styles.headerTop}>
                        <h1 className={styles.terminalTitle}>
                            <span className={styles.companyName}>WEYLAND-YUTANI</span> :: MU/TH/UR 6000
                        </h1>
                        <div className={styles.terminalInfo}>
                            <div>TERMINAL: USR.276.11</div>
                            <div className={styles.authorized}>USER: AUTHORIZED</div>
                        </div>
                    </div>
                    <div className={styles.headerBottom}>
                        <div className={styles.moduleVersion}>NOTES MODULE v2.4.0</div>
                        <div className={styles.terminalDate}>
                            {new Date().toLocaleDateString()} :: {new Date().toLocaleTimeString()}
                        </div>
                    </div>
                </header>

                {/* Command input area */}
                <div className={styles.commandPanel}>
                    <div className={styles.panelLabel}>:: INPUT COMMAND ::</div>
                    <div className={styles.inputWrapper}>
                        <span className={styles.promptSymbol}>&gt;</span>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="ENTER NOTE TEXT..."
                            className={styles.input}
                        />
                        {cursor && <span className={styles.cursor}>_</span>}
                    </div>

                    <div className={styles.buttonGroup}>
                        <button
                            onClick={handleAddNote}
                            className={styles.storeButton}
                        >
                            [STORE]
                        </button>
                        <button
                            onClick={clearNotes}
                            className={styles.purgeButton}
                        >
                            [PURGE ALL]
                        </button>
                    </div>
                </div>

                {/* Notes display */}
                <div className={styles.dataPanel}>
                    <div className={styles.dataPanelHeader}>
                        <div className={styles.panelLabel}>:: STORED DATA ::</div>
                        <div className={styles.entryCount}>ENTRIES: {notes.size}</div>
                    </div>

                    {notes.size === 0 ? (
                        <div className={styles.emptyState}>
                            -- NO DATA AVAILABLE --
                        </div>
                    ) : (
                        <div className={styles.entriesList}>
                            {[...notes.entries()].map(([id, text]) => (
                                <div key={id} className={styles.entryItem}>
                                    <div className={styles.entryHeader}>
                                        <div className={styles.entryId}>ENTRY #{id.substring(0, 8)}</div>
                                        <button
                                            onClick={() => deleteNote(id)}
                                            className={styles.deleteButton}
                                        >
                                            [DELETE]
                                        </button>
                                    </div>
                                    <div className={styles.entryText}>
                                        {text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer status bar */}
                <footer className={styles.terminalFooter}>
                    <div>SYSTEM STATUS: NOMINAL</div>
                    <div className={styles.connectionStatus}>CONNECTION SECURE</div>
                </footer>
            </div>
        </div>
    );
};