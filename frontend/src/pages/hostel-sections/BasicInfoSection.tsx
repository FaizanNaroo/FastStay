import React from 'react';
import styles from "../../styles/AddHostel.module.css";

interface BasicInfoSectionProps {
    form: {
        p_ManagerId: number;
        p_HostelId: number;
        p_BlockNo: string;
        p_HouseNo: string;
        p_HostelType: string;
        p_isParking: boolean;
        p_NumRooms: string;
        p_NumFloors: string;
        p_WaterTimings: string;
        p_CleanlinessTenure: string;
        p_IssueResolvingTenure: string;
        p_MessProvide: boolean;
        p_GeezerFlag: boolean;
        p_name: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    message: string;
    editingMode: boolean;
    selectedHostelId: number | null; // Changed from selectedHostel to selectedHostelId
}

export default function BasicInfoSection({
    form,
    handleChange,
    handleSubmit,
    message,
    editingMode,
    selectedHostelId
}: BasicInfoSectionProps) {
    
    return (
        <div className={styles.card} id="basic">
            <div className={styles.cardHead}>
                <h3>Basic Information</h3>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.sectionForm}>
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>Hostel Name *</label>
                        <input
                            type="text"
                            name="p_name"
                            value={form.p_name}
                            onChange={handleChange}
                            placeholder="Enter hostel name"
                            required
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>Block No *</label>
                        <input
                            type="text"
                            name="p_BlockNo"
                            value={form.p_BlockNo}
                            onChange={handleChange}
                            placeholder="Block number"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>House No *</label>
                        <input
                            type="text"
                            name="p_HouseNo"
                            value={form.p_HouseNo}
                            onChange={handleChange}
                            placeholder="House number"
                            required
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>Hostel Type *</label>
                        <select
                            name="p_HostelType"
                            value={form.p_HostelType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select type</option>
                            <option value="Portion">Portion</option>
                            <option value="Building">Building</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Number of Rooms *</label>
                        <input
                            type="number"
                            name="p_NumRooms"
                            value={form.p_NumRooms}
                            onChange={handleChange}
                            placeholder="Total rooms"
                            min="1"
                            required
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>Number of Floors *</label>
                        <input
                            type="number"
                            name="p_NumFloors"
                            value={form.p_NumFloors}
                            onChange={handleChange}
                            placeholder="Total floors"
                            min="1"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Water Timing (hours) *</label>
                        <input
                            type="number"
                            name="p_WaterTimings"
                            value={form.p_WaterTimings}
                            onChange={handleChange}
                            placeholder="Hours per day"
                            min="0"
                            required
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>Cleanliness Tenure (days) *</label>
                        <input
                            type="number"
                            name="p_CleanlinessTenure"
                            value={form.p_CleanlinessTenure}
                            onChange={handleChange}
                            placeholder="Days between cleaning"
                            min="1"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Issue Resolving Tenure (days) *</label>
                        <input
                            type="number"
                            name="p_IssueResolvingTenure"
                            value={form.p_IssueResolvingTenure}
                            onChange={handleChange}
                            placeholder="Days to resolve issues"
                            min="1"
                            required
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="p_isParking"
                                checked={form.p_isParking}
                                onChange={handleChange}
                            />
                            <span>Parking Available</span>
                        </label>
                    </div>
                    <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="p_MessProvide"
                                checked={form.p_MessProvide}
                                onChange={handleChange}
                            />
                            <span>Mess Provided</span>
                        </label>
                    </div>
                    <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="p_GeezerFlag"
                                checked={form.p_GeezerFlag}
                                onChange={handleChange}
                            />
                            <span>Geyser Available</span>
                        </label>
                    </div>
                </div>

                {selectedHostelId && (
                    <div className={styles.hostelIdDisplay}>
                        <small>Hostel ID: {selectedHostelId}</small>
                    </div>
                )}

                <button 
                    className={styles.btn} 
                    type="submit"
                >
                    {editingMode ? "Update Hostel" : "Save Hostel"}
                </button>

                {message && (
                    <div className={`${styles.message} ${
                        message.includes("Successfully") || 
                        message.includes("successfully") || 
                        message.includes("Added") || 
                        message.includes("Updated") ||
                        message.includes("success")
                            ? styles.success 
                            : styles.error
                    }`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}