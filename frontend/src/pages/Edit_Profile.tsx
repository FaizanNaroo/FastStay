import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // Extract user_id from URL query parameter
  const queryParams = new URLSearchParams(window.location.search);
  const userId = queryParams.get("user_id");

  useEffect(() => {
    const fetchStudent = async () => {
      if (!userId) {
        setError("No student ID provided.");
        setLoading(false);
        return;
      }

      try {
        // Parallel API calls for faster loading
        const [profileResponse, usersResponse] = await Promise.all([
          axios.post("http://127.0.0.1:8000/faststay_app/UserDetail/display/", {
            p_StudentId: parseInt(userId)
          }),
          axios.get("http://127.0.0.1:8000/faststay_app/users/all/")
        ]);

        const users: StudentDetails[] = usersResponse.data.users;
        const foundUser = users.find((u) => u.userid === parseInt(userId));

        if (profileResponse.data.success && foundUser) {
          setStudent({...profileResponse.data.result, ...foundUser});
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
    setError(null);
    
    try {
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
        // Redirect to profile page after successful update
        setTimeout(() => {
          navigate(`/student/profile?user_id=${userId}`);
        }, 500);
      } else {
        setError("Failed to update profile.");
        setSaving(false);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save changes.");
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/student/profile?user_id=${userId}`);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <i className="fa-solid fa-building-user"></i> FastStay
        </div>
        <div className={styles.navLinks}>
          <a href={`/student/home?user_id=${userId}`} className={styles.navLinkItem}>
            Home
          </a>
          <Link
            to={`/student/profile?user_id=${userId}`}
            className={styles.navLinkItem}
          >
            My Profile
          </Link>
          <Link to={`/student/suggestions?user_id=${userId}`} className={styles.navLinkItem}>
            Suggestions
          </Link>
          <Link to="/" className={styles.navLinkItem}>
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

        {/* Messages below subtitle */}
        {error && (
          <div className={styles.errorMessage}>
            <i className="fa-solid fa-exclamation-circle"></i> {error}
          </div>
        )}

        {successMessage && (
          <div className={styles.successMessage}>
            <i className="fa-solid fa-check-circle"></i> {successMessage}
          </div>
        )}

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading your information...</p>
          </div>
        ) : (
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
                    disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
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
                      disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
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
                      disabled={saving}
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
        )}
      </div>
    </div>
  );
};

export default EditProfile;