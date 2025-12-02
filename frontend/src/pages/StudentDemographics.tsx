import React, { useState, useEffect } from "react";
import styles from "../styles/StudentDemographics.module.css";

const StudentDemographics: React.FC = () => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("user_id");

    useEffect(() => {
        if (!userId) window.location.href = "/signup";
    }, [userId]);

    const [semester, setSemester] = useState("");
    const [department, setDepartment] = useState("");
    const [batch, setBatch] = useState("");
    const [roommateCount, setRoommateCount] = useState("");
    const [distance, setDistance] = useState("");
    const [acRoom, setAcRoom] = useState("");
    const [bedType, setBedType] = useState("");
    const [washroomType, setWashroomType] = useState("");
    const [mess, setMess] = useState("");

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            UserId: Number(userId),
            Semester: Number(semester),
            Department: department,
            Batch: batch ? Number(batch) : null,
            RoomateCount: Number(roommateCount),
            UniDistance: distance ? Number(distance) : null,
            isAcRoom: acRoom === "Yes",
            isMess: mess === "Yes",
            BedType: bedType,
            WashroomType: washroomType,
        };

        try {
            const res = await fetch("http://127.0.0.1:8000/faststay_app/UserDetail/add/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) {
                setMessageType("error");
                setMessage(data.error || "Failed to save preferences.");
            } else {
                setMessageType("success");
                setMessage("Preferences saved successfully!");

                setTimeout(() => {
                    window.location.href = "/";
                }, 1200);
            }
        } catch {
            setMessageType("error");
            setMessage("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.screen}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <h2 className={styles.title}>
                        <i className="fa-solid fa-user-graduate"></i> Student Demographics
                    </h2>
                    <p className={styles.subtitle}>Help us personalize hostel recommendations</p>

                    <form onSubmit={handleSubmit}>
                        {/* University Info Section */}
                        <h3 className={styles.sectionTitle}>
                            <i className="fa-solid fa-building-columns"></i> University Information
                        </h3>

                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>Semester</label>
                                <input type="number" placeholder="e.g., 3" value={semester} onChange={e => setSemester(e.target.value)} required />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Department</label>
                                <select value={department} onChange={e => setDepartment(e.target.value)}>
                                    <option value="">Select Department</option>
                                    <option>CS</option>
                                    <option>SE</option>
                                    <option>EE</option>
                                    <option>BBA</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>Batch</label>
                                <input type="number" placeholder="e.g., 2023" value={batch} onChange={e => setBatch(e.target.value)} />
                            </div>
                        </div>

                        {/* Hostel Preferences */}
                        <h3 className={styles.sectionTitle}>
                            <i className="fa-solid fa-bed"></i> Hostel Preferences
                        </h3>

                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>Roommate Count</label>
                                <input type="number" placeholder="0, 1, 2..." value={roommateCount} onChange={e => setRoommateCount(e.target.value)} required />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Preferred Distance</label>
                                <input type="number" step="0.1" placeholder="e.g., 1.5 km" value={distance} onChange={e => setDistance(e.target.value)} />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>AC Room</label>
                                <select value={acRoom} onChange={e => setAcRoom(e.target.value)} required>
                                    <option value="">Select</option>
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Bed Type</label>
                                <select value={bedType} onChange={e => setBedType(e.target.value)} required>
                                    <option value="">Select</option>
                                    <option>Bed</option>
                                    <option>Mattress</option>
                                    <option>Anyone</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>Washroom Type</label>
                                <select value={washroomType} onChange={e => setWashroomType(e.target.value)} required>
                                    <option value="">Select</option>
                                    <option value="RoomAttached">Attached</option>
                                    <option value="Community">Joint</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Mess Required</label>
                                <select value={mess} onChange={e => setMess(e.target.value)} required>
                                    <option value="">Select</option>
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className={styles.btn} disabled={loading}>
                            {loading ? "Saving..." : "Save Preferences"}
                        </button>

                        {message && (
                            <div className={`${styles.msg} ${messageType === "success" ? styles.success : styles.error}`}>
                                {message}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentDemographics;