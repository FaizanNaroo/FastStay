import { useState } from "react";
import styles from "../styles/AddHostel.module.css";
import { Link } from "react-router-dom";

export default function AddHostel() {
    const params = new URLSearchParams(window.location.search);
    const managerId = Number(params.get("user_id"));

    const [form, setForm] = useState({
        p_ManagerId: managerId,
        p_BlockNo: "",
        p_HouseNo: "",
        p_HostelType: "",
        p_isParking: false,
        p_NumRooms: "",
        p_NumFloors: "",
        p_WaterTimings: "",
        p_CleanlinessTenure: "",
        p_IssueResolvingTenure: "",
        p_MessProvide: false,
        p_GeezerFlag: false,
    });

    const [message, setMessage] = useState("");

    function handleChange(e: any) {
        const { name, value, type, checked } = e.target;
        setForm((p) => ({
            ...p,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        setMessage("");

        try {
            const res = await fetch("http://127.0.0.1:8000/faststay_app/hostel/add/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) setMessage("Hostel Added Successfully!");
            else setMessage(data.error || "Failed to add hostel");
        } catch {
            setMessage("Server error");
        }
    }

    return (
        <>
            {/* NAVBAR */}
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <i className="fa-solid fa-building-user"></i> FastStay
                </div>

                <div className={styles.navLinks}>
                    <Link to={`/manager/dashboard?user_id=${managerId}`}>
                        Dashboard
                    </Link>

                    <Link to={`/manager/add_hostel?user_id=${managerId}`} className={styles.active}>
                        Add Hostel
                    </Link>

                    <Link to={`/manager/add_room?user_id=${managerId}`}>
                        Add Room
                    </Link>

                    <Link to={`/manager/profile?user_id=${managerId}`}>
                        Your Profile
                    </Link>

                    <Link to="/logout">
                        Logout
                    </Link>
                </div>

            </nav>

            <div className={styles.layout}>

                {/* SIDEBAR */}
                <aside className={styles.sidebar}>
                    <h3>Hostel Sections</h3>
                    <ul>
                        <li><a href="#basic" className={styles.active}>Basic Information</a></li>
                        <li><a href="#mess">Mess Details</a></li>
                        <li><a href="#kitchen">Kitchen Details</a></li>
                        <li><a href="#security">Security Info</a></li>
                        <li><a href="#expenses">Expenses</a></li>
                    </ul>
                </aside>

                {/* CONTENT */}
                <main className={styles.content}>
                    <h2 className={styles.pageTitle}>Add Hostel Details</h2>
                    <p className={styles.subtitle}>Fill in the required information carefully.</p>

                    {/* BASIC INFO */}
                    <div className={styles.card} id="basic">
                        <div className={styles.cardHead}>
                            <h3>Basic Information</h3>
                            <div className={styles.cardActions}>
                                <button className={styles.editBtn}>Update</button>
                                <button className={styles.deleteBtn}>Delete</button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Block No</label>
                                    <input
                                        name="p_BlockNo"
                                        value={form.p_BlockNo}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Block 5"
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>House No</label>
                                    <input
                                        name="p_HouseNo"
                                        value={form.p_HouseNo}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="House 23"
                                        required
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Type</label>
                                    <select
                                        name="p_HostelType"
                                        value={form.p_HostelType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="Portion">Portion</option>
                                        <option value="Building">Building</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.checkboxGroup}>
                                    <label>Parking Available</label>
                                    <input
                                        name="p_isParking"
                                        type="checkbox"
                                        checked={form.p_isParking}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className={styles.checkboxGroup}>
                                    <label>Mess Provide</label>
                                    <input
                                        name="p_MessProvide"
                                        type="checkbox"
                                        checked={form.p_MessProvide}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className={styles.checkboxGroup}>
                                    <label>Geezer</label>
                                    <input
                                        name="p_GeezerFlag"
                                        type="checkbox"
                                        checked={form.p_GeezerFlag}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Rooms</label>
                                    <input
                                        name="p_NumRooms"
                                        type="number"
                                        value={form.p_NumRooms}
                                        onChange={handleChange}
                                        placeholder="12"
                                        required
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Floors</label>
                                    <input
                                        name="p_NumFloors"
                                        type="number"
                                        placeholder="3"
                                        value={form.p_NumFloors}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Water Timings</label>
                                    <input
                                        name="p_WaterTimings"
                                        value={form.p_WaterTimings}
                                        onChange={handleChange}
                                        placeholder="6AM - 10AM"
                                        required
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Cleanliness Tenure (days)</label>
                                    <input
                                        name="p_CleanlinessTenure"
                                        type="number"
                                        value={form.p_CleanlinessTenure}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Issue Resolving Tenure (days)</label>
                                    <input
                                        name="p_IssueResolvingTenure"
                                        type="number"
                                        value={form.p_IssueResolvingTenure}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <button className={styles.btn}>Save Hostel Details</button>

                            {message && <p className={styles.message}>{message}</p>}
                        </form>
                    </div>

                    {/* All other cards (Mess, Kitchen, Security, Expenses)
                        will follow EXACT same design with Update + Delete buttons
                        but I will generate them AFTER you confirm this structure. */}
                </main>
            </div>
        </>
    );
}