import { useState, useEffect } from 'react';
import styles from "../../styles/AddHostel.module.css";

interface KitchenDetailsProps {
    hostelId: number | null;
    editingMode: boolean;
    hostelDetails?: any;
}

export default function KitchenDetailsSection({
    hostelId,
    editingMode
}: KitchenDetailsProps) {
    const [isFridge, setIsFridge] = useState(false);
    const [isMicrowave, setIsMicrowave] = useState(false);
    const [isGas, setIsGas] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [existingKitchenDetails, setExistingKitchenDetails] = useState<any>(null);
    const [kitchenId, setKitchenId] = useState<number | null>(null);

    // Fetch existing kitchen details if editing
    useEffect(() => {
        if (editingMode && hostelId) {
            fetchKitchenDetails(hostelId);
        } else {
            // Reset form when not editing
            setIsFridge(false);
            setIsMicrowave(false);
            setIsGas(false);
            setExistingKitchenDetails(null);
            setKitchenId(null);
        }
    }, [editingMode, hostelId]);

    async function fetchKitchenDetails(hostelId: number) {
        try {
            setLoading(true);
            const res = await fetch(`http://127.0.0.1:8000/faststay_app/display/details_kitchen?p_HostelId=${hostelId}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });

            const data = await res.json();

            if (res.ok && !data.error) {
                setExistingKitchenDetails(data);
                setKitchenId(data.p_KitchenId || data.p_kitchenid);
                setIsFridge(data.p_isFridge || data.p_isfridge || false);
                setIsMicrowave(data.p_isMicrowave || data.p_ismicrowave || false);
                setIsGas(data.p_isGas || data.p_isgas || false);
            } else {
                // No existing kitchen details or error
                setExistingKitchenDetails(null);
                setKitchenId(null);
                setIsFridge(false);
                setIsMicrowave(false);
                setIsGas(false);

                if (data.error && !data.error.includes("not found")) {
                    setMessage(data.error);
                }
            }
        } catch (error) {
            console.error("Error fetching kitchen details:", error);
            setMessage("Failed to load kitchen details");
        } finally {
            setLoading(false);
        }
    }

    async function handleKitchenSubmit(e: any) {
        e.preventDefault();
        setMessage("");

        if (!hostelId) {
            setMessage("Please fill Basic Information first.");
            return;
        }

        const payload = existingKitchenDetails
            ? {
                p_KitchenId: kitchenId,
                p_isFridge: isFridge,
                p_isMicrowave: isMicrowave,
                p_isGas: isGas,
            }
            : {
                p_HostelId: hostelId,
                p_isFridge: isFridge,
                p_isMicrowave: isMicrowave,
                p_isGas: isGas,
            };

        try {
            const url = existingKitchenDetails
                ? "http://127.0.0.1:8000/faststay_app/kitchenDetails/update/"
                : "http://127.0.0.1:8000/faststay_app/kitchenDetails/add/";

            const method = existingKitchenDetails ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message || "Kitchen Details Saved Successfully!");
                // Refresh data
                setTimeout(() => fetchKitchenDetails(hostelId), 500);
            } else {
                setMessage(data.error || data.message || "Failed to save kitchen details.");
            }

        } catch (error) {
            console.error("Error saving kitchen details:", error);
            setMessage("Server error occurred.");
        }
    }

    async function deleteKitchenDetails() {
        if (!kitchenId) {
            setMessage("No kitchen details to delete");
            return;
        }

        if (!window.confirm("Are you sure you want to delete kitchen details?")) {
            return;
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/faststay_app/kitchen/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ p_KitchenId: kitchenId }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message || "Kitchen Details Deleted Successfully!");
                setExistingKitchenDetails(null);
                setKitchenId(null);
                setIsFridge(false);
                setIsMicrowave(false);
                setIsGas(false);
            } else {
                setMessage(data.error || "Failed to delete kitchen details.");
            }
        } catch (error) {
            console.error("Error deleting kitchen details:", error);
            setMessage("Server error occurred.");
        }
    }

    return (
        <div className={styles.card} id="kitchen">
            <div className={styles.cardHead}>
                <h3>
                    Kitchen Details
                    {editingMode && existingKitchenDetails && (
                        <span style={{ fontSize: '14px', color: '#666', marginLeft: '10px' }}>
                            (ID: {kitchenId})
                        </span>
                    )}
                </h3>
                <div className={styles.cardActions}>
                    {existingKitchenDetails && (
                        <>
                            <button type="button" className={styles.editBtn} onClick={handleKitchenSubmit}>
                                Update
                            </button>
                            <button type="button" className={styles.deleteBtn} onClick={deleteKitchenDetails}>
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>

            {loading ? (
                <div className={styles.loading}>
                    <i className="fa-solid fa-spinner fa-spin"></i> Loading kitchen details...
                </div>
            ) : (
                <form onSubmit={handleKitchenSubmit} className={styles.sectionForm}>
                    <div className={styles.row} style={{ marginTop: "20px" }}>
                        <div className={styles.checkboxGroup}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isFridge}
                                    onChange={(e) => setIsFridge(e.target.checked)}
                                />
                                Fridge Available
                            </label>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.checkboxGroup}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isMicrowave}
                                    onChange={(e) => setIsMicrowave(e.target.checked)}
                                />
                                Microwave Available
                            </label>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.checkboxGroup}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isGas}
                                    onChange={(e) => setIsGas(e.target.checked)}
                                />
                                Gas Available
                            </label>
                        </div>
                    </div>

                    <button className={styles.btn} type="submit">
                        {existingKitchenDetails ? "Update Kitchen Details" : "Save Kitchen Details"}
                    </button>

                    {message && (
                        <p className={`${styles.message} ${message.includes("Successfully") ? styles.success : styles.error
                            }`}>
                            {message}
                        </p>
                    )}
                </form>
            )}
        </div>
    );
}