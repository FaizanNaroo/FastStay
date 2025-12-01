import React, { useState, useEffect } from "react";
import styles from "../styles/ManagerDemographics.module.css";

const ManagerDemographics: React.FC = () => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("user_id");

    useEffect(() => {
        if (!userId) window.location.href = "/signup";
    }, [userId]);

    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [phone, setPhone] = useState("");
    const [education, setEducation] = useState("");
    const [managerType, setManagerType] = useState("");
    const [hours, setHours] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">("");
    const [loading, setLoading] = useState(false);

    const handlePhotoChange = (file: File | null) => {
        setPhoto(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPhotoPreview(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setMessageType("");

        if (!userId) {
            setMessageType("error");
            setMessage("User ID missing. Please Signup again.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("p_UserId", userId);
        if (photo) formData.append("p_PhotoLink", photo);
        formData.append("p_PhoneNo", phone);
        formData.append("p_Education", education);
        formData.append("p_ManagerType", managerType);
        formData.append("p_OperatingHours", hours);

        try {
            const res = await fetch("http://127.0.0.1:8000/faststay_app/ManagerDetails/add/", {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            if (!res.ok) {
                setMessageType("error");
                setMessage(data.error || "Failed to save details.");
            } else {
                setMessageType("success");
                setMessage("Manager details saved successfully!");
                setTimeout(() => window.location.href = "/", 1200);
            }
        } catch {
            setMessageType("error");
            setMessage("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>
                    <i className="fa-solid fa-id-badge"></i> Hostel Manager Details
                </h2>
                <p className={styles.subtitle}>Provide your personal & professional details</p>

                <form onSubmit={handleSubmit}>

                    <div className={styles.photoSection}>
                        <div className={styles.photoBox}>
                            {photoPreview ? (
                                <img src={photoPreview} alt="Profile Preview" className={styles.photoPreview} />
                            ) : (
                                <i className="fa-solid fa-user"></i>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className={styles.fileInput}
                            onChange={e => handlePhotoChange(e.target.files?.[0] || null)}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label>Phone Number</label>
                            <input type="text" placeholder="03001234567" value={phone} onChange={e => setPhone(e.target.value)} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Education</label>
                            <input type="text" placeholder="BBA (PU)" value={education} onChange={e => setEducation(e.target.value)} />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label>Manager Type</label>
                            <select value={managerType} onChange={e => setManagerType(e.target.value)} required>
                                <option value="">Select Type</option>
                                <option>Owner</option>
                                <option>Employee</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Operating Hours</label>
                            <input type="number" min={1} max={24} placeholder="1-24" value={hours} onChange={e => setHours(e.target.value)} required />
                        </div>
                    </div>

                    <button type="submit" className={styles.btn} disabled={loading}>
                        {loading ? "Saving..." : "Save & Continue"}
                    </button>

                    {message && (
                        <div className={`${styles.msg} ${messageType === "success" ? styles.success : styles.error}`}>
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ManagerDemographics;