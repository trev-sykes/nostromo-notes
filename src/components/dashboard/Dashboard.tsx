import { useState, useEffect } from "react";
import useNoteStore from "../../store/useNoteStore";
import { ConfirmModal } from "../confirmModal/ConfirmModal";  // Import the ConfirmModal component
import styles from "./Dashboard.module.css";

export const Dashboard = () => {
    const { notes, writeNote, deleteNote, modifyNote, clearNotes } = useNoteStore();
    const [input, setInput] = useState("");
    const [cursor, setCursor] = useState(true);
    const [bootSequence, setBootSequence] = useState(true);
    const [bootText, setBootText] = useState("");
    const fullBootText = "WEYLAND-YUTANI CORP.\nMU/TH/UR 6000\nNOTES MODULE V2.4.0\nINITIALIZING...";
    const [isNostromoLight, setIsNostromoLight] = useState<boolean>(false);
    // Track the note being edited
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editedText, setEditedText] = useState<string>("");

    // States for handling modal visibility and action
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalAction, setModalAction] = useState<string | null>(null);  // Store the action (e.g., delete, purge)
    const [noteIdToDelete, setNoteIdToDelete] = useState<string | null>(null);  // Store note id for deletion

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

    const handleModifyNote = (id: string, newText: string) => {
        modifyNote(id, newText); // Update the note with the new text
    };

    const handleConfirmEdit = (id: string) => {
        handleModifyNote(id, editedText);  // Confirm the modification
        setEditingNoteId(null);  // Exit edit mode
        setEditedText("");  // Reset the edited text
    };

    // Handle modal confirmation and cancellation
    const handleModalConfirm = () => {
        if (modalAction === "delete" && noteIdToDelete) {
            deleteNote(noteIdToDelete);  // Perform delete action
        } else if (modalAction === "purge") {
            clearNotes();  // Clear all notes
        }
        setIsModalVisible(false);  // Hide modal after action
        setModalAction(null);  // Reset the modal action
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);  // Close the modal without action
        setModalAction(null);  // Reset the modal action
    };

    const handleModalDecision = (action: string, noteId?: string) => {
        setModalAction(action);
        setNoteIdToDelete(noteId || null);
        setIsModalVisible(true);  // Show the modal
    };

    if (bootSequence) {
        return (
            <div className={`${styles.container} ${isNostromoLight ? "nostromoLight" : ""}`}>
                <div className={styles.bootScreen}>
                    <pre className={styles.bootText}>
                        {bootText}{cursor ? "_" : " "}
                    </pre>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.container} ${isNostromoLight ? "nostromoLight" : ""}`}>
            <div className={styles.scanLines}></div>
            <div className={styles.screenFlicker}></div>

            <div className={styles.terminalWrapper}>
                <header className={styles.terminalHeader}>
                    <div className={styles.headerTop}>
                        <h1 className={styles.terminalTitle}>
                            <span className={styles.companyName}>WEYLAND-YUTANI</span> :: MU/TH/UR 6000
                        </h1>
                        <div className={styles.terminalInfo}>
                            <div>TERMINAL: USR.276.11</div>
                            <div className={styles.authorized}>USER: AUTHORIZED</div>
                            <div className={styles.toggleLightContainer}>
                                <div
                                    className={`${styles.toggleLight} ${isNostromoLight ? styles.on : ''}`}
                                    onClick={() => setIsNostromoLight(prev => !prev)}
                                >
                                    <div className={styles.toggleIndicator} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.headerBottom}>
                        <div className={styles.moduleVersion}>NOTES MODULE v2.4.0</div>
                        <div className={styles.terminalDate}>
                            {new Date().toLocaleDateString()} :: {new Date().toLocaleTimeString()}
                        </div>
                    </div>
                </header>

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
                            onClick={() => handleModalDecision("purge")}
                            className={styles.purgeButton}
                        >
                            [PURGE ALL]
                        </button>
                    </div>
                </div>

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
                                        <div>
                                            {editingNoteId === id ? (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            handleModalDecision('modify')
                                                            handleConfirmEdit(id)
                                                        }
                                                        }
                                                        className={`${styles.button} ${styles.confirmButton}`}
                                                    >
                                                        [CONFIRM]
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleModalDecision("delete", id)}
                                                        className={`${styles.button} ${styles.deleteButton}`}
                                                    >
                                                        [DELETE]
                                                    </button>
                                                    <button
                                                        className={`${styles.button} ${styles.modifyButton}`}
                                                        onClick={() => {
                                                            setEditingNoteId(id);
                                                            setEditedText(text);  // Set the current note's text in the input
                                                        }}
                                                    >
                                                        [MODIFY]
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Display note text or input if being edited */}
                                    <div className={styles.entryText}>
                                        {editingNoteId === id ? (
                                            <input
                                                className={styles.entryTextInput}
                                                type="text"
                                                value={editedText}
                                                onChange={(e) => setEditedText(e.target.value)}
                                            />
                                        ) : (
                                            <span>{text}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <footer className={styles.terminalFooter}>
                    <div>SYSTEM STATUS: NOMINAL</div>
                    <div className={styles.connectionStatus}>CONNECTION SECURE</div>
                </footer>
            </div >

            {/* Modal for Confirmation */}
            {
                isModalVisible && (
                    <ConfirmModal
                        action={modalAction === "delete" ? 'delete' : modalAction == 'modify' ? 'modify' : 'purge'}
                        onConfirm={handleModalConfirm}
                        onCancel={handleModalCancel}
                    />
                )
            }
        </div >
    );
};
