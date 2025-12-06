import { useState, useEffect } from 'react';
import styles from "../../styles/AddHostel.module.css";

interface MessDetailsProps {
    hostelId: number | null;
    editingMode: boolean;
    hostelDetails?: any;
}

export default function MessDetailsSection({ 
    hostelId, 
    editingMode
}: MessDetailsProps) {
    const [messTimeCount, setMessTimeCount] = useState("");
    const [dishes, setDishes] = useState<string[]>([""]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [existingMessDetails, setExistingMessDetails] = useState<any>(null);
    const [messId, setMessId] = useState<number | null>(null);
    const [debugInfo, setDebugInfo] = useState<string>("");

    // Fetch existing mess details if editing
    useEffect(() => {
        if (hostelId) {
            fetchMessDetails(hostelId);
        } else {
            // Reset form when not editing
            setMessTimeCount("");
            setDishes([""]);
            setExistingMessDetails(null);
            setMessId(null);
            setDebugInfo("");
        }
    }, [hostelId, editingMode]);

    async function fetchMessDetails(hostelId: number) {
        try {
            setLoading(true);
            setDebugInfo(`Fetching mess details for hostel ID: ${hostelId}`);
            
            // Use query parameters - this is the standard way
            const url = `http://127.0.0.1:8000/faststay_app/display/hostel_mess?p_HostelId=${hostelId}`;
            console.log("Fetching from:", url);
            
            const res = await fetch(url, {
                method: "GET",
                headers: { 
                    "Accept": "application/json"
                }
            });

            const responseText = await res.text();
            setDebugInfo(prev => prev + ` | Status: ${res.status} ${res.statusText}`);
            
            // Log the raw response for debugging
            console.log("Raw response:", responseText.substring(0, 200));
            
            let data;
            try {
                data = JSON.parse(responseText);
                console.log("Parsed data:", data);
            } catch (parseError) {
                console.error("JSON parse error:", parseError);
                setDebugInfo(prev => prev + ` | Response not JSON: ${responseText.substring(0, 100)}`);
                throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
            }

            if (res.ok) {
                console.log("Mess details response:", data);
                setDebugInfo(prev => prev + " | Response OK");
                
                if (data.error) {
                    // Backend returned an error
                    if (data.error.includes("not found") || res.status === 404) {
                        // No mess details found - this is normal for new hostels
                        setExistingMessDetails(null);
                        setMessId(null);
                        setMessTimeCount("");
                        setDishes([""]);
                        setMessage("");
                        setDebugInfo(prev => prev + " | No mess details found (normal for new hostels)");
                    } else {
                        // Other error
                        setMessage(data.error);
                        setDebugInfo(prev => prev + ` | Backend error: ${data.error}`);
                    }
                } else {
                    // Successfully got mess details
                    setExistingMessDetails(data);
                    
                    // Extract mess ID - check different possible field names
                    const extractedMessId = data.p_messid;
                    if (extractedMessId) {
                        setMessId(extractedMessId);
                        setDebugInfo(prev => prev + ` | Found mess ID: ${extractedMessId}`);
                    } else {
                        setDebugInfo(prev => prev + " | No mess ID found in response");
                    }
                    
                    // Extract mess time count
                    const timeCount = data.p_messtimecount;
                    if (timeCount !== undefined && timeCount !== null) {
                        setMessTimeCount(timeCount.toString());
                        setDebugInfo(prev => prev + ` | Mess time count: ${timeCount}`);
                    } else {
                        setMessTimeCount("");
                        setDebugInfo(prev => prev + " | No mess time count in response");
                    }
                    
                    // Handle dishes - could be string or array
                    let dishesArray: string[] = [""];
                    
                    // Check different possible field names and formats
                    const dishesData = data.p_dishes;
                    if (dishesData) {
                        console.log("Dishes data:", dishesData, "Type:", typeof dishesData);
                        if (Array.isArray(dishesData)) {
                            dishesArray = dishesData
                                .filter((d: any) => d !== null && d !== undefined)
                                .map((d: any) => d.toString().trim())
                                .filter((d: string) => d !== "");
                            setDebugInfo(prev => prev + ` | Dishes as array: ${dishesArray.length} items`);
                        } else if (typeof dishesData === 'string') {
                            dishesArray = dishesData.split(',')
                                .map((d: string) => d.trim())
                                .filter((d: string) => d !== "");
                            setDebugInfo(prev => prev + ` | Dishes as string: "${dishesData.substring(0, 50)}..."`);
                        }
                    }
                    
                    if (dishesArray.length === 0) {
                        dishesArray = [""];
                    }
                    setDishes(dishesArray);
                    
                    setMessage("");
                }
            } else {
                // HTTP error
                setExistingMessDetails(null);
                setMessId(null);
                setMessTimeCount("");
                setDishes([""]);
                setMessage(data.error || `Failed to load mess details (HTTP ${res.status})`);
                setDebugInfo(prev => prev + ` | HTTP error: ${res.status} ${res.statusText}`);
            }
        } catch (error) {
            console.error("Error fetching mess details:", error);
            setExistingMessDetails(null);
            setMessId(null);
            setMessTimeCount("");
            setDishes([""]);
            setMessage("Failed to load mess details");
            setDebugInfo(prev => prev + ` | Catch error: ${error}`);
        } finally {
            setLoading(false);
        }
    }

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
        setDebugInfo("Submitting mess details...");

        if (!hostelId) {
            setMessage("Please fill Basic Information first.");
            return;
        }

        // Filter out empty dishes
        const filteredDishes = dishes.filter(d => d.trim() !== "");
        
        if (filteredDishes.length === 0) {
            setMessage("Please add at least one dish");
            return;
        }

        const timeCount = parseInt(messTimeCount);
        if (!messTimeCount || isNaN(timeCount) || timeCount < 1 || timeCount > 3) {
            setMessage("Meals per day must be between 1 and 3");
            return;
        }

        const payload = existingMessDetails && messId
            ? {
                p_MessId: messId,
                p_MessTimeCount: timeCount,
                p_Dishes: filteredDishes
            }
            : {
                p_HostelId: hostelId,
                p_MessTimeCount: timeCount,
                p_Dishes: filteredDishes
            };

        console.log("Submitting payload:", payload);
        setDebugInfo(`Payload: ${JSON.stringify(payload)}`);

        try {
            const url = existingMessDetails && messId
                ? "http://127.0.0.1:8000/faststay_app/messDetails/update/"
                : "http://127.0.0.1:8000/faststay_app/messDetails/add/";

            const method = existingMessDetails && messId ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            console.log("Submit response:", data);
            setDebugInfo(prev => prev + ` | Response status: ${res.status} | Data: ${JSON.stringify(data)}`);

            if (res.ok) {
                const successMessage = data.message || (existingMessDetails 
                    ? "Mess Details Updated Successfully!" 
                    : "Mess Details Added Successfully!");
                
                setMessage(successMessage);
                
                // Refresh data
                if (hostelId) {
                    setTimeout(() => fetchMessDetails(hostelId), 1000);
                }
            } else {
                setMessage(data.error || data.message || "Failed to save mess details.");
            }

        } catch (error) {
            console.error("Error saving mess details:", error);
            setMessage("Server error occurred.");
            setDebugInfo(prev => prev + ` | Submit error: ${error}`);
        }
    }

    async function deleteMessDetails() {
        if (!messId) {
            setMessage("No mess details to delete");
            return;
        }

        if (!window.confirm("Are you sure you want to delete mess details?")) {
            return;
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/faststay_app/messDetails/delete/", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ p_MessId: messId }),
            });

            const data = await res.json();

            if (res.ok && data.result === true) {
                setMessage(data.message || "Mess Details Deleted Successfully!");
                setExistingMessDetails(null);
                setMessId(null);
                setMessTimeCount("");
                setDishes([""]);
            } else {
                setMessage(data.error || data.message || "Failed to delete mess details.");
            }
        } catch (error) {
            console.error("Error deleting mess details:", error);
            setMessage("Server error occurred.");
        }
    }

    return (
        <div className={styles.card} id="mess">
            <div className={styles.cardHead}>
                <h3>
                    Mess Details 
                    {messId && (
                        <span className={styles.hostelIdBadge}>
                            ID: {messId}
                        </span>
                    )}
                </h3>
                <div className={styles.cardActions}>
                    {existingMessDetails && messId && (
                        <>
                            <button type="button" className={styles.editBtn} onClick={handleMessSubmit}>
                                <i className="fa-solid fa-pen-to-square"></i> Update
                            </button>
                            <button type="button" className={styles.deleteBtn} onClick={deleteMessDetails}>
                                <i className="fa-solid fa-trash"></i> Delete
                            </button>
                        </>
                    )}
                </div>
            </div>

            {loading ? (
                <div className={styles.loading}>
                    <i className="fa-solid fa-spinner fa-spin"></i> Loading mess details...
                </div>
            ) : (
                <form onSubmit={handleMessSubmit} className={styles.sectionForm}>
                    {!hostelId && (
                        <div className={`${styles.message} ${styles.warning}`}>
                            Please fill and save Basic Information first before adding mess details.
                        </div>
                    )}

                    {/* Debug information (you can remove this in production) */}
                    {debugInfo && (
                        <div className={`${styles.message}`} style={{ fontSize: '12px', backgroundColor: '#f5f5f5', color: '#666' }}>
                            <strong>Debug:</strong> {debugInfo}
                        </div>
                    )}

                    {hostelId && (
                        <>
                            {/* Mess Time Count */}
                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Meals Per Day *</label>
                                    <input
                                        type="number"
                                        value={messTimeCount}
                                        onChange={(e) => setMessTimeCount(e.target.value)}
                                        placeholder="1-3"
                                        min={1}
                                        max={3}
                                        required
                                    />
                                    <small style={{ color: '#666', fontSize: '12px', marginTop: '5px' }}>
                                        Must be between 1 and 3
                                    </small>
                                </div>
                            </div>

                            {/* Dynamic Dish Inputs */}
                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Dishes *</label>
                                    <small style={{ color: '#666', fontSize: '12px', display: 'block', marginBottom: '10px' }}>
                                        Add at least one dish
                                    </small>

                                    {dishes.map((dish, index) => (
                                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                            <input
                                                type="text"
                                                value={dish}
                                                onChange={(e) => updateDish(index, e.target.value)}
                                                placeholder={`Dish ${index + 1}`}
                                                required={index === 0}
                                                style={{ flex: 1 }}
                                            />

                                            {dishes.length > 1 && (
                                                <button
                                                    type="button"
                                                    className={styles.deleteBtn}
                                                    onClick={() => removeDishField(index)}
                                                    style={{ width: '40px', padding: '8px' }}
                                                >
                                                    <i className="fa-solid fa-trash"></i>
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
                                        <i className="fa-solid fa-plus"></i> Add Dish
                                    </button>
                                </div>
                            </div>

                            <button 
                                className={styles.btn} 
                                style={{ marginTop: "15px" }} 
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <i className="fa-solid fa-spinner fa-spin"></i> Processing...
                                    </>
                                ) : existingMessDetails ? (
                                    "Update Mess Details"
                                ) : (
                                    "Save Mess Details"
                                )}
                            </button>
                        </>
                    )}

                    {message && (
                        <div className={`${styles.message} ${
                            message.includes("Successfully") || 
                            message.includes("successfully") || 
                            message.includes("Added") || 
                            message.includes("Updated") ||
                            message.includes("Deleted")
                                ? styles.success 
                                : styles.error
                        }`}>
                            {message}
                        </div>
                    )}
                </form>
            )}
        </div>
    );
}