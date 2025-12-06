import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "../styles/EditProfile.module.css";

interface StudentDetails {
  userid: number;
  fname?: string;
  lname?: string;
  age?: number;
  gender?: string;
  city?: string;
  usertype?: string;
  email?: string;
  p_Semester?: number;
  p_Department?: string;
  p_Batch?: number;
  p_RoomateCount?: number;
  p_UniDistance?: number;
  p_isAcRoom?: boolean;
  p_isMess?: boolean;
  p_BedType?: string;
  p_WashroomType?: string;
}

const EditProfile: React.FC = () => {
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Extract user_id from URL query parameter
  const queryParams = new URLSearchParams(window.location.search);
  const userId = queryParams.get("user_id") || "5"; // Default for testing

  useEffect(() => {
    const fetchStudent = async () => {
      if (!userId) {
        setError("No student ID provided.");
        setLoading(false);
        return;
      }

      try {
        // Fetch user details from your API
        const response = await axios.post(
          "http://127.0.0.1:8000/faststay_app/UserDetail/display/",
          { p_StudentId: parseInt(userId) }
        );
        
        const response2 = await axios.get("http://127.0.0.1:8000/faststay_app/users/all/");
        const users: StudentDetails[] = response2.data.users;
        const foundUser = users.find((u) => u.userid === parseInt(userId));

        if (response.data.success && foundUser) {
          setStudent({...response.data.result, ...foundUser});
        } else {
          setError("Student not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch student details.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [userId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (student) {
      setStudent({
        ...student,
        [name]: type === "checkbox" 
          ? (e.target as HTMLInputElement).checked 
          : type === "number" 
            ? parseInt(value) || 0
            : value
      });
    }
  };

  const handleSave = async () => {
    if (!student) return;
    
    setSaving(true);
    setSuccessMessage(null);
    
    try {
      // Update user details via API
      const updateData = {
        p_StudentId: student.userid,
        p_Department: student.p_Department,
        p_Batch: student.p_Batch,
        p_Semester: student.p_Semester,
        p_RoomateCount: student.p_RoomateCount,
        p_UniDistance: student.p_UniDistance,
        p_isAcRoom: student.p_isAcRoom,
        p_isMess: student.p_isMess,
        p_BedType: student.p_BedType,
        p_WashroomType: student.p_WashroomType,
      };

      const response = await axios.put(
        "http://127.0.0.1:8000/faststay_app/UserDetail/update/",
        updateData
      );

      if (response.data.result) {
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError("Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    window.location.href = `/student/profile?user_id=${userId}`;
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.pageWrapper}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <i className="fa-solid fa-building-user"></i> FastStay
        </div>
        <div className={styles.navLinks}>
          <a href="/student/home" className={styles.navLinkItem}>
            Home
          </a>
          <Link
            to={`/student/profile?user_id=${userId}`}
            className={styles.navLinkItem}
          >
            My Profile
          </Link>
          <a href="/suggestions" className={styles.navLinkItem}>
            Suggestions
          </a>
          <Link to="/logout" className={styles.navLinkItem}>
            Logout
          </Link>
        </div>
      </nav>

      <div className={styles.container}>
        <h2 className={styles.pageTitle}>
          <i className="fa-solid fa-user-edit"></i> Edit Profile
        </h2>
        <p className={styles.subtitle}>
          Update your account and preferences
        </p>

        {successMessage && (
          <div className={styles.successMessage}>
            <i className="fa-solid fa-check-circle"></i> {successMessage}
          </div>
        )}

        <div className={styles.editGrid}>
          {/* UNIVERSITY INFORMATION */}
          <div className={styles.section}>
            <h3>
              <i className="fa-solid fa-building-columns"></i> University Information
            </h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Department</label>
                <input
                  type="text"
                  name="p_Department"
                  value={student?.p_Department || ""}
                  onChange={handleInputChange}
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Batch</label>
                <input
                  type="number"
                  name="p_Batch"
                  value={student?.p_Batch || ""}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  min="2000"
                  max="2030"
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Semester</label>
                <input
                  type="number"
                  name="p_Semester"
                  value={student?.p_Semester || ""}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  min="1"
                  max="12"
                />
              </div>
            </div>
          </div>

          {/* HOSTEL PREFERENCES */}
          <div className={styles.section}>
            <h3>
              <i className="fa-solid fa-bed"></i> Hostel Preferences
            </h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Roommate Count</label>
                <select
                  name="p_RoomateCount"
                  value={student?.p_RoomateCount || 1}
                  onChange={handleInputChange}
                  className={styles.selectField}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Preferred Distance (km)</label>
                <input
                  type="number"
                  name="p_UniDistance"
                  value={student?.p_UniDistance || 2}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  min="1"
                  max="20"
                  step="0.5"
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="p_isAcRoom"
                    checked={student?.p_isAcRoom || false}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                  />
                  AC Room Required
                </label>
              </div>
              <div className={styles.formGroup}>
                <label>Bed Type</label>
                <select
                  name="p_BedType"
                  value={student?.p_BedType || "Bed"}
                  onChange={handleInputChange}
                  className={styles.selectField}
                >
                  <option value="Bed">Bed</option>
                  <option value="Matress">Matress</option>
                  <option value="Anyone">Any</option>
                </select>
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Washroom Type</label>
                <select
                  name="p_WashroomType"
                  value={student?.p_WashroomType || "RoomAttached"}
                  onChange={handleInputChange}
                  className={styles.selectField}
                >
                  <option value="RoomAttached">Room Attached</option>
                  <option value="Community">Community</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="p_isMess"
                    checked={student?.p_isMess || false}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                  />
                  Mess Required
                </label>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className={styles.buttonSection}>
            <button
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={handleCancel}
              disabled={saving}
            >
              <i className="fa-solid fa-times"></i> Cancel
            </button>
            <button
              className={`${styles.button} ${styles.saveButton}`}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Saving...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-save"></i> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;