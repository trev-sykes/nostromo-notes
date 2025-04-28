import styles from "./ConfirmModal.module.css";
interface ConfirmModalProps {
    action: 'delete' | 'modify' | 'purge';  // Use Enum or Union Type
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ action, onConfirm, onCancel }) => {
    const actionText = action.charAt(0).toUpperCase() + action.slice(1); // Capitalize action (e.g., "Delete")

    return (
        <div className={styles.modalOverlay}>  {/* Add a modal overlay for better UI */}
            <div className={styles.modalContent}>
                <h1>Confirmation</h1>
                <h2>Are you sure you want to {actionText == 'Purge' ? `${actionText} all items?` : `${actionText} this item?`}</h2>
                <div className={styles.buttonGroup}>
                    <button onClick={onCancel} className={`${styles.button} ${styles.cancel}`}>
                        [CANCEL]
                    </button>
                    <button onClick={onConfirm} className={`${styles.button} ${styles.confirm}`}>
                        [CONFIRM]
                    </button>
                </div>
            </div>
        </div>
    );
};
