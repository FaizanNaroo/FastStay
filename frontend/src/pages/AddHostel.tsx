import { useState } from "react";
import styles from "../styles/AddHostel.module.css";
import { Link } from "react-router-dom";

export default function AddHostel() {
    const params = new URLSearchParams(window.location.search);
    const managerId = Number(params.get("user_id"));

    const [hostelId, setHostelId] = useState<number | null>(null);

    const [activeSection, setActiveSection] = useState("basic");

    // ⭐ Form for Basic Information
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
        p_name: ""
    });

    const [message, setMessage] = useState("");

    function handleChange(e: any) {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    // ⭐ Submit Basic Info
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

            if (res.ok) {
                setMessage("Hostel Added Successfully!");
                setHostelId(data.hostelid);     // ⭐ store hostelId
                setActiveSection("mess");       // ⭐ auto switch to next section
            }
            else {
                setMessage(data.error || "Failed to add hostel");
            }
        }
        catch {
            setMessage("Server error");
        }
    }

    // ⭐ Prevents entering other sections before Basic Info is saved
    function requireBasicInfo(e: any, goto: string) {
        e.preventDefault(); // Add this line

        if (!hostelId) {
            e.preventDefault();
            setMessage("Please fill Basic Information first");
            setActiveSection("basic");
            return;
        }
        setMessage(""); // clear any previous message
        setActiveSection(goto);
    }


    function MessDetailsSection({ hostelId }: { hostelId: number | null }) {
        const [messTimeCount, setMessTimeCount] = useState("");
        const [dishes, setDishes] = useState<string[]>([""]);
        const [message, setMessage] = useState("");

        // Add new dish input
        function addDishField() {
            setDishes((prev) => [...prev, ""]);
        }

        // Remove dish input
        function removeDishField(index: number) {
            setDishes((prev) => prev.filter((_, i) => i !== index));
        }

        // Handle dish change
        function updateDish(index: number, value: string) {
            setDishes((prev) => {
                const newDishes = [...prev];
                newDishes[index] = value;
                return newDishes;
            });
        }

        async function handleMessSubmit(e: any) {
            e.preventDefault();
            setMessage("");

            if (!hostelId) {
                setMessage("Please fill Basic Information first.");
                return;
            }

            const payload = {
                p_HostelId: hostelId,
                p_MessTimeCount: Number(messTimeCount),
                p_Dishes: dishes.filter(d => d.trim() !== "")
            };

            try {
                const res = await fetch("http://127.0.0.1:8000/faststay_app/messDetails/add/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const data = await res.json();

                // Check for validation errors
                if (!res.ok) {
                    setMessage(data.error || "Failed to add mess details.");
                    return;
                }

                if (data.result === true) {
                    setMessage(data.message || "Mess Details Added Successfully!");
                } else {
                    // If result is false, show the message from backend
                    setMessage(data.message || "Failed to add mess details.");
                }

            } catch {
                setMessage("Server error occurred.");
            }
        }

        return (
            <form onSubmit={handleMessSubmit} className={styles.sectionForm}>

                {/* Mess Time Count */}
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>Meals Per Day</label>
                        <input
                            type="number"
                            value={messTimeCount}
                            onChange={(e) => setMessTimeCount(e.target.value)}
                            placeholder="1-3"
                            min={1}
                            max={3}
                            required
                        />
                    </div>
                </div>

                {/* Dynamic Dish Inputs */}
                <label style={{ fontWeight: "600", marginTop: "10px" }}>Dishes</label>

                {dishes.map((dish, index) => (
                    <div className={styles.row} key={index}>
                        <div className={styles.inputGroup} style={{ flex: 1 }}>
                            <input
                                type="text"
                                value={dish}
                                onChange={(e) => updateDish(index, e.target.value)}
                                placeholder={`Dish ${index + 1}`}
                                required
                            />
                        </div>

                        {dishes.length > 1 && (
                            <button
                                type="button"
                                className={styles.deleteBtn}
                                onClick={() => removeDishField(index)}
                                style={{ height: "40px", marginLeft: "10px" }}
                            >
                                -
                            </button>
                        )}
                    </div>
                ))}

                {/* Add New Dish Button */}
                <button
                    type="button"
                    className={styles.editBtn}
                    onClick={addDishField}
                    style={{ width: "150px", marginTop: "10px" }}
                >
                    + Add Dish
                </button>

                <button className={styles.btn} style={{ marginTop: "15px" }}>
                    Save Mess Details
                </button>

                {message && <p className={styles.message}>{message}</p>}
            </form>
        );
    }

    function KitchenDetailsSection({ hostelId }: { hostelId: number | null }) {
        const [isFridge, setIsFridge] = useState(false);
        const [isMicrowave, setIsMicrowave] = useState(false);
        const [isGas, setIsGas] = useState(false);
        const [message, setMessage] = useState("");

        async function handleKitchenSubmit(e: any) {
            e.preventDefault();
            setMessage("");

            if (!hostelId) {
                setMessage("Please fill Basic Information first.");
                return;
            }

            const payload = {
                p_HostelId: hostelId,
                p_isFridge: isFridge,
                p_isMicrowave: isMicrowave,
                p_isGas: isGas,
            };

            try {
                const res = await fetch("http://127.0.0.1:8000/faststay_app/kitchenDetails/add/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const data = await res.json();

                if (res.ok) {
                    setMessage("Kitchen Details Added Successfully!");
                } else {
                    setMessage(data.error || "Failed to save kitchen details.");
                }

            } catch {
                setMessage("Server error occurred.");
            }
        }

        return (
            <form onSubmit={handleKitchenSubmit} className={styles.sectionForm}>

                <div className={styles.row} style={{ marginTop: "20px" }}>
                    <div className={styles.checkboxGroup}>
                        <label>Fridge Available</label>
                        <input
                            type="checkbox"
                            checked={isFridge}
                            onChange={(e) => setIsFridge(e.target.checked)}
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.checkboxGroup}>
                        <label>Microwave Available</label>
                        <input
                            type="checkbox"
                            checked={isMicrowave}
                            onChange={(e) => setIsMicrowave(e.target.checked)}
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.checkboxGroup}>
                        <label>Gas Available</label>
                        <input
                            type="checkbox"
                            checked={isGas}
                            onChange={(e) => setIsGas(e.target.checked)}
                        />
                    </div>
                </div>

                <button className={styles.btn}>Save Kitchen Details</button>

                {message && <p className={styles.message}>{message}</p>}
            </form>
        );
    }

    function SecurityInfoSection({ hostelId }: { hostelId: number | null }) {
        const [gateTimings, setGateTimings] = useState("");
        const [isCameras, setIsCameras] = useState(false);
        const [isGuard, setIsGuard] = useState(false);
        const [isOutsiderVerification, setIsOutsiderVerification] = useState(false);
        const [message, setMessage] = useState("");

        async function handleSecuritySubmit(e: any) {
            e.preventDefault();
            setMessage("");

            if (!hostelId) {
                setMessage("Please fill Basic Information first.");
                return;
            }

            const payload = {
                p_HostelId: hostelId,
                p_GateTimings: gateTimings,
                p_isCameras: isCameras,
                p_isGuard: isGuard,
                p_isOutsiderVerification: isOutsiderVerification
            };

            try {
                const res = await fetch("http://127.0.0.1:8000/faststay_app/add/security_info", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();

                if (res.ok) {
                    setMessage("Security Information Added Successfully!");
                } else {
                    setMessage(data.error || "Failed to add security info.");
                }
            } catch {
                setMessage("Server error occurred.");
            }
        }

        return (
            <form onSubmit={handleSecuritySubmit} className={styles.sectionForm}>
                {/* Gate Timings */}
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>Security Guard Time (Hours)</label>
                        <input
                            type="number"
                            value={gateTimings}
                            onChange={(e) => setGateTimings(e.target.value)}
                            placeholder="5"
                            required
                        />
                    </div>
                </div>

                {/* Cameras */}
                <div className={styles.row}>
                    <div className={styles.checkboxGroup}>
                        <label>Cameras Installed</label>
                        <input
                            type="checkbox"
                            checked={isCameras}
                            onChange={(e) => setIsCameras(e.target.checked)}
                        />
                    </div>
                </div>

                {/* Guards */}
                <div className={styles.row}>
                    <div className={styles.checkboxGroup}>
                        <label>Security Guard</label>
                        <input
                            type="checkbox"
                            checked={isGuard}
                            onChange={(e) => setIsGuard(e.target.checked)}
                        />
                    </div>
                </div>

                {/* Outsider Verification */}
                <div className={styles.row}>
                    <div className={styles.checkboxGroup}>
                        <label>Outsider Verification</label>
                        <input
                            type="checkbox"
                            checked={isOutsiderVerification}
                            onChange={(e) => setIsOutsiderVerification(e.target.checked)}
                        />
                    </div>
                </div>

                <button className={styles.btn} style={{ marginTop: "10px" }}>
                    Save Security Info
                </button>

                {message && <p className={styles.message}>{message}</p>}
            </form>
        );
    }

    function ExpensesSection({ hostelId }: { hostelId: number | null }) {
        const [isExpensesIncluded, setIsExpensesIncluded] = useState(false);
        const [securityCharges, setSecurityCharges] = useState("");
        const [messCharges, setMessCharges] = useState("");
        const [kitchenCharges, setKitchenCharges] = useState("");
        const [internetCharges, setInternetCharges] = useState("");
        const [acServiceCharges, setAcServiceCharges] = useState("");
        const [electricityBillType, setElectricityBillType] = useState("");
        const [electricityCharges, setElectricityCharges] = useState("");
        const [message, setMessage] = useState("");

        async function handleExpensesSubmit(e: any) {
            e.preventDefault();
            setMessage("");

            if (!hostelId) {
                setMessage("Please fill Basic Information first.");
                return;
            }

            if (isExpensesIncluded) {
                // Case 1: Expenses included in Room Rent - only security charges
                if (!securityCharges) {
                    setMessage("Security charges are required when expenses are included in room rent.");
                    return;
                }

                const payload = {
                    p_HostelId: hostelId,
                    p_SecurityCharges: Number(securityCharges)
                };

                try {
                    const res = await fetch("http://127.0.0.1:8000/faststay_app/ExpensesRoomIncluded/add/", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });

                    const data = await res.json();

                    if (res.ok) {
                        setMessage("Expenses (Room Included) Added Successfully!");
                    } else {
                        setMessage(data.error || "Failed to add expenses.");
                    }
                } catch {
                    setMessage("Server error occurred.");
                }
            } else {
                // Case 2: Expenses NOT included in Room Rent - all fields required
                if (!securityCharges || !messCharges || !kitchenCharges || !internetCharges ||
                    !acServiceCharges || !electricityBillType || !electricityCharges) {
                    setMessage("All fields are required when expenses are not included in room rent.");
                    return;
                }

                const payload = {
                    p_HostelId: hostelId,
                    p_SecurityCharges: Number(securityCharges),
                    p_MessCharges: Number(messCharges),
                    p_KitchenCharges: Number(kitchenCharges),
                    p_InternetCharges: Number(internetCharges),
                    p_AcServiceCharges: Number(acServiceCharges),
                    p_ElectricitybillType: electricityBillType,
                    p_ElectricityCharges: Number(electricityCharges)
                };

                try {
                    const res = await fetch("http://127.0.0.1:8000/faststay_app/Expenses/add/", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });

                    const data = await res.json();

                    if (res.ok) {
                        setMessage("Expenses Added Successfully!");
                    } else {
                        setMessage(data.error || "Failed to add expenses.");
                    }
                } catch {
                    setMessage("Server error occurred.");
                }
            }
        }

        return (
            <form onSubmit={handleExpensesSubmit} className={styles.sectionForm}>

                {/* Toggle Switch for Expenses Included */}
                <div className={styles.row} style={{ marginTop: '10px' }}>
                    <div className={styles.checkboxGroup} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <label style={{ marginRight: '10px', fontWeight: '600' }}>
                            Expenses Included in Room Rent
                        </label>
                        <input
                            type="checkbox"
                            checked={isExpensesIncluded}
                            onChange={(e) => setIsExpensesIncluded(e.target.checked)}
                            style={{ width: '20px', height: '20px' }}
                        />
                    </div>
                </div>

                <p className={styles.note} style={{ marginBottom: '15px', color: '#666' }}>
                    {isExpensesIncluded
                        ? "Only security charges need to be specified. Other expenses will be averaged per seater."
                        : "All expenses need to be specified separately."}
                </p>

                {/* Security Charges - Always Required */}
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>Security Charges</label>
                        <input
                            type="number"
                            value={securityCharges}
                            onChange={(e) => setSecurityCharges(e.target.value)}
                            placeholder="0"
                            required
                        />
                    </div>
                </div>

                {/* Other Charges - Only show when expenses NOT included */}
                {!isExpensesIncluded && (
                    <>
                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>Mess Charges</label>
                                <input
                                    type="number"
                                    value={messCharges}
                                    onChange={(e) => setMessCharges(e.target.value)}
                                    placeholder="0"
                                    required={!isExpensesIncluded}
                                />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>Kitchen Charges</label>
                                <input
                                    type="number"
                                    value={kitchenCharges}
                                    onChange={(e) => setKitchenCharges(e.target.value)}
                                    placeholder="0"
                                    required={!isExpensesIncluded}
                                />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>Internet Charges</label>
                                <input
                                    type="number"
                                    value={internetCharges}
                                    onChange={(e) => setInternetCharges(e.target.value)}
                                    placeholder="0"
                                    required={!isExpensesIncluded}
                                />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>AC Service Charges</label>
                                <input
                                    type="number"
                                    value={acServiceCharges}
                                    onChange={(e) => setAcServiceCharges(e.target.value)}
                                    placeholder="0"
                                    required={!isExpensesIncluded}
                                />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>Electricity Bill Type</label>
                                <select
                                    value={electricityBillType}
                                    onChange={(e) => setElectricityBillType(e.target.value)}
                                    required={!isExpensesIncluded}
                                >
                                    <option value="">Select</option>
                                    <option value="RoomMeterFull">Room Meter Full</option>
                                    <option value="RoomMeterACOnly">Room Meter AC Only</option>
                                    <option value="ACSubmeter">AC Submeter</option>
                                    <option value="UnitBased">Unit Based</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>Electricity Charges</label>
                                <input
                                    type="number"
                                    value={electricityCharges}
                                    onChange={(e) => setElectricityCharges(e.target.value)}
                                    placeholder="0"
                                    required={!isExpensesIncluded}
                                />
                            </div>
                        </div>
                    </>
                )}

                <button className={styles.btn} style={{ marginTop: "10px" }}>
                    {isExpensesIncluded ? "Save Expenses (Room Included)" : "Save Expenses"}
                </button>

                {message && <p className={styles.message}>{message}</p>}
            </form>
        );
    }

    return (
        <>
            {/* NAVBAR */}
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <i className="fa-solid fa-building-user"></i> FastStay
                </div>

                <div className={styles.navLinks}>
                    <Link to={`/manager/dashboard?user_id=${managerId}`}>Dashboard</Link>
                    <Link to={`/manager/add_hostel?user_id=${managerId}`} className={styles.active}>Add Hostel</Link>
                    <Link to={`/manager/add_room?user_id=${managerId}`}>Add Room</Link>
                    <Link to={`/manager/profile?user_id=${managerId}`}>Your Profile</Link>
                    <Link to="/logout">Logout</Link>
                </div>
            </nav>

            <div className={styles.layout}>

                {/* SIDEBAR */}
                <aside className={styles.sidebar}>
                    <h3>Hostel Sections</h3>
                    <ul>
                        <li>
                            <a
                                href="#basic"
                                className={activeSection === "basic" ? styles.active : ""}
                                onClick={() => setActiveSection("basic")}
                            >
                                Basic Information
                            </a>
                        </li>

                        <li>
                            <a
                                href="#mess"
                                className={activeSection === "mess" ? styles.active : ""}
                                onClick={(e) => requireBasicInfo(e, "mess")}
                            >
                                Mess Details
                            </a>
                        </li>

                        <li>
                            <a
                                href="#kitchen"
                                className={activeSection === "kitchen" ? styles.active : ""}
                                onClick={(e) => requireBasicInfo(e, "kitchen")}
                            >
                                Kitchen Details
                            </a>
                        </li>

                        <li>
                            <a
                                href="#security"
                                className={activeSection === "security" ? styles.active : ""}
                                onClick={(e) => requireBasicInfo(e, "security")}
                            >
                                Security Info
                            </a>
                        </li>

                        <li>
                            <a
                                href="#expenses"
                                className={activeSection === "expenses" ? styles.active : ""}
                                onClick={(e) => requireBasicInfo(e, "expenses")}
                            >
                                Expenses
                            </a>
                        </li>
                    </ul>
                </aside>

                {/* MAIN CONTENT */}
                <main className={styles.content}>
                    <h2 className={styles.pageTitle}>Add Hostel Details</h2>
                    <p className={styles.subtitle}>Fill in the required information carefully.</p>

                    {/* BASIC INFORMATION SECTION */}
                    {activeSection === "basic" && (
                        <div className={styles.card} id="basic">

                            {message && message.includes("Please fill Basic Information first") && (
                                <div className={`${styles.message} ${styles.topMessage}`}>
                                    {message}
                                </div>
                            )}

                            <div className={styles.cardHead}>
                                <h3>Basic Information</h3>
                                <div className={styles.cardActions}>
                                    <button className={styles.editBtn}>Update</button>
                                    <button className={styles.deleteBtn}>Delete</button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>

                                {/* Hostel Name */}
                                <div className={styles.row}>
                                    <div className={styles.inputGroup}>
                                        <label>Name</label>
                                        <input
                                            name="p_name"
                                            value={form.p_name}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Student Hostel"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Block No */}
                                <div className={styles.row}>
                                    <div className={styles.inputGroup}>
                                        <label>Block No</label>
                                        <input
                                            name="p_BlockNo"
                                            value={form.p_BlockNo}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Block B Faisal Town"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* House No + Hostel Type */}
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

                                {/* Checkboxes */}
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
                                </div>

                                <div className={styles.row}>
                                    <div className={styles.checkboxGroup}>
                                        <label>Mess Provide</label>
                                        <input
                                            name="p_MessProvide"
                                            type="checkbox"
                                            checked={form.p_MessProvide}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className={styles.row}>
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

                                {/* Rooms + Floors */}
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

                                {/* Water + Cleanliness */}
                                <div className={styles.row}>
                                    <div className={styles.inputGroup}>
                                        <label>Warm Water Hours</label>
                                        <input
                                            name="p_WaterTimings"
                                            type="number"
                                            value={form.p_WaterTimings}
                                            onChange={handleChange}
                                            placeholder="5"
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

                                {/* Issue Tenure */}
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

                            </form>

                            {message && !message.includes("Please fill Basic Information first") && (
                                <p className={styles.message}>{message}</p>
                            )}
                        </div>
                    )}

                    {/* ===================== MESS DETAILS ===================== */}
                    {activeSection === "mess" && hostelId && (
                        <div className={styles.card} id="mess">
                            <div className={styles.cardHead}>
                                <h3>Mess Details</h3>
                                <div className={styles.cardActions}>
                                    <button className={styles.editBtn}>Update</button>
                                    <button className={styles.deleteBtn}>Delete</button>
                                </div>
                            </div>

                            <MessDetailsSection hostelId={hostelId} />
                        </div>
                    )}

                    {/* ===================== KITCHEN DETAILS ===================== */}
                    {activeSection === "kitchen" && hostelId && (
                        <div className={styles.card} id="kitchen">
                            <div className={styles.cardHead}>
                                <h3>Kitchen Details</h3>
                                <div className={styles.cardActions}>
                                    <button className={styles.editBtn}>Update</button>
                                    <button className={styles.deleteBtn}>Delete</button>
                                </div>
                            </div>

                            <KitchenDetailsSection hostelId={hostelId} />
                        </div>
                    )}

                    {/* ===================== SECURITY DETAILS ===================== */}
                    {activeSection === "security" && hostelId && (
                        <div className={styles.card} id="security">
                            <div className={styles.cardHead}>
                                <h3>Security Information</h3>
                                <div className={styles.cardActions}>
                                    <button className={styles.editBtn}>Update</button>
                                    <button className={styles.deleteBtn}>Delete</button>
                                </div>
                            </div>

                            <SecurityInfoSection hostelId={hostelId} />
                        </div>
                    )}

                    {/* ===================== EXPENSES DETAILS ===================== */}
                    {activeSection === "expenses" && hostelId && (
                        <div className={styles.card} id="expenses">
                            <div className={styles.cardHead}>
                                <h3>Expenses</h3>
                                <div className={styles.cardActions}>
                                    <button className={styles.editBtn}>Update</button>
                                    <button className={styles.deleteBtn}>Delete</button>
                                </div>
                            </div>

                            <ExpensesSection hostelId={hostelId} />
                        </div>
                    )}

                </main>
            </div>
        </>
    );
}