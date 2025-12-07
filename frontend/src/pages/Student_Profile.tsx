import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from "../styles/StudentProfile.module.css"; // CSS Module

interface StudentDetails {
  // Account info
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


const StudentProfile: React.FC = () => {
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Extract user_id from URL query parameter (static for testing)
  // const queryParams = new URLSearchParams(window.location.search);
  // const userId = queryParams.get("user_id");
  const userId = "5";

  useEffect(() => {
    const fetchStudent = async () => {
      if (!userId) {
        setError("No student ID provided.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/faststay_app/UserDetail/display/",
          { p_StudentId: parseInt(userId) }
        );
        
        const response2 = await axios.get("http://127.0.0.1:8000/faststay_app/users/all/");

        const users: StudentDetails[] = response2.data.users;
        const foundUser = users.find((u) => u.userid === parseInt(userId));
        console.log(foundUser);

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

  if (loading) return <p className={styles.loading} style={{textAlign:"center"}}>Loading...</p>;
  if (error) return <p className={styles.error} style={{textAlign:"center"}}>{error}</p>;

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
          <a
            href="/student/profile"
            className={`${styles.navLinkItem} ${styles.active}`}
          >
            My Profile
          </a>
          <Link to={`/student/suggestions?user-id=${userId}`} className={styles.navLinkItem}>
            Suggestions
          </Link>
          <a href="/" className={styles.navLinkItem}>
            Logout
          </a>
        </div>
      </nav>

      <div className={styles.container}>
        <h2 className={styles.pageTitle}>
          <i className="fa-solid fa-user-circle"></i> My Profile
        </h2>
        <p className={styles.subtitle}>
          View and manage your account & preferences
        </p>

        <div className={styles.profileGrid}>
          {/* LEFT: PROFILE CARD */}
          <div className={styles.profileCard}>
            <h3 className={styles.name}>
              <i className="fa-solid fa-user"></i>{" "}
              {student ? `${student.fname} ${student.lname}` : `Student #${userId}`}
            </h3>
            <button
              className={styles.editBtn}
              onClick={() => navigate(`/student/profile/edit?user_id=${userId}`)}
            >
              <i className="fa-solid fa-pen"></i> Edit Profile
            </button>
          </div>

          {/* RIGHT: INFO SECTIONS */}
          <div className={styles.infoSections}>
            {/* ACCOUNT INFO */}
            <div className={styles.section}>
              <h3>
                <i className="fa-solid fa-id-card"></i> Account Information
              </h3>
              <div className={styles.row}>
                <p>
                  <b>First Name:</b> {student?.fname}
                </p>
                <p>
                  <b>Last Name:</b> {student?.lname}
                </p>
              </div>
              <div className={styles.row}>
                <p>
                  <b>Age:</b> {student?.age}
                </p>
                <p>
                  <b>Gender:</b> {student?.gender}
                </p>
              </div>
              <div className={styles.row}>
                <p>
                  <b>City:</b> {student?.city}
                </p>
                <p>
                  <b>Type:</b> {student?.usertype}
                </p>
              </div>
            </div>

            {/* UNIVERSITY INFO */}
            <div className={styles.section}>
              <h3>
                <i className="fa-solid fa-building-columns"></i> University
                Information
              </h3>
              <div className={styles.row}>
                <p>
                  <b>Department:</b> {student?.p_Department}
                </p>
                <p>
                  <b>Batch:</b> {student?.p_Batch}
                </p>
              </div>
              <div className={styles.row}>
                <p>
                  <b>Semester:</b> {student?.p_Semester}
                </p>
              </div>
            </div>

            {/* HOSTEL PREFERENCES */}
            <div className={styles.section}>
              <h3>
                <i className="fa-solid fa-bed"></i> Hostel Preferences
              </h3>
              <div className={styles.row}>
                <p>
                  <b>Roommate Count:</b> {student?.p_RoomateCount}
                </p>
                <p>
                  <b>Preferred Distance:</b> {student?.p_UniDistance} km
                </p>
              </div>
              <div className={styles.row}>
                <p>
                  <b>AC Room:</b> {student?.p_isAcRoom ? "Yes" : "No"}
                </p>
                <p>
                  <b>Bed Type:</b> {student?.p_BedType}
                </p>
              </div>
              <div className={styles.row}>
                <p>
                  <b>Washroom Type:</b> {student?.p_WashroomType}
                </p>
                <p>
                  <b>Mess Required:</b> {student?.p_isMess ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
