import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getStudentProfile, type StudentProfile } from "../api/admin_students_review";
import styles from "../styles/admin_dashboard.module.css";
import studentStyles from "../styles/admin_students_profile.module.css";

const AdminStudentProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id) {
        setError("Student ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const studentId = parseInt(id);
        
        const studentData = await getStudentProfile(studentId);

        if (studentData) {
          setStudent(studentData);
        } else {
          setError(`Student with ID ${studentId} not found`);
        }
      } catch (err) {
        console.error("Error fetching student profile:", err);
        setError("Failed to load student profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  const handleDelete = async () => {
    if (!student) return;
    
    if (window.confirm(`Are you sure you want to delete ${student.fullName}? This action cannot be undone.`)) {
      try {
        // Add your delete API call here
        console.log("Deleting student:", student.userId);
        // await deleteStudent(student.userId);
        
        // Navigate back to students list after deletion
        navigate("/admin/students");
      } catch (err) {
        console.error("Error deleting student:", err);
        alert("Failed to delete student. Please try again.");
      }
    }
  };

  const formatSemester = (semester: number): string => {
    const suffixes: Record<number, string> = {
      1: "st",
      2: "nd",
      3: "rd"
    };
    const suffix = suffixes[semester] || "th";
    return `${semester}${suffix}`;
  };

  const formatDistance = (distance: number): string => {
    return `${distance.toFixed(1)} km`;
  };

  if (loading) {
    return (
      <div>
        {/* NAVBAR */}
        <nav className={styles.navbar}>
          <div className={styles.logo}>
            <i className="fa-solid fa-user-shield"></i> FastStay Admin
          </div>
          <div className={styles.navLinks}>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/hostels">Hostels</Link>
            <Link to="/admin/students" className={styles.active}>Students</Link>
            <Link to="/admin/managers">Managers</Link>
            <Link to="/logout">Logout</Link>
          </div>
        </nav>
        
        <div className={styles.container}>
          <div className={studentStyles.loadingContainer}>
            <i className="fas fa-spinner fa-spin" style={{ marginRight: "10px" }}></i>
            Loading student profile...
          </div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div>
        {/* NAVBAR */}
        <nav className={styles.navbar}>
          <div className={styles.logo}>
            <i className="fa-solid fa-user-shield"></i> FastStay Admin
          </div>
          <div className={styles.navLinks}>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/hostels">Hostels</Link>
            <Link to="/admin/students" className={styles.active}>Students</Link>
            <Link to="/admin/managers">Managers</Link>
            <Link to="/logout">Logout</Link>
          </div>
        </nav>
        
        <div className={styles.container}>
          <div className={studentStyles.errorContainer}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: "48px", marginBottom: "20px" }}></i>
            <h2>Error Loading Student</h2>
            <p>{error || "Student not found"}</p>
            <button 
              className={studentStyles.backButton} 
              onClick={() => navigate("/admin/students")}
              style={{ marginTop: "20px" }}
            >
              <i className="fas fa-arrow-left"></i> Back to Students List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <i className="fa-solid fa-user-shield"></i> FastStay Admin
        </div>
        <div className={styles.navLinks}>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/hostels">Hostels</Link>
          <Link to="/admin/students" className={styles.active}>Students</Link>
          <Link to="/admin/managers">Managers</Link>
          <Link to="/logout">Logout</Link>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className={styles.container}>
        <div className={studentStyles.studentProfileCard}>
          {/* Header with Back Button */}
          <div className={studentStyles.profileHeader}>
            <div>
              <h2 className={styles.pageTitle}>
                <i className="fa-solid fa-user-graduate"></i> Student Profile
              </h2>
              <p className={styles.subtitle}>Complete demographic details of {student.fullName}</p>
            </div>
            <button 
              className={studentStyles.backButton} 
              onClick={() => navigate("/admin/students")}
            >
              <i className="fas fa-arrow-left"></i> Back to List
            </button>
          </div>

          {/* Student Summary Stats */}
          <div className={studentStyles.studentSummary}>
            <div className={studentStyles.summaryItem}>
              <div className={studentStyles.summaryLabel}>Student ID</div>
              <div className={studentStyles.summaryValue}>#{student.userId}</div>
            </div>
            <div className={studentStyles.summaryItem}>
              <div className={studentStyles.summaryLabel}>Age</div>
              <div className={studentStyles.summaryValue}>{student.age} years</div>
            </div>
            <div className={studentStyles.summaryItem}>
              <div className={studentStyles.summaryLabel}>Semester</div>
              <div className={studentStyles.summaryValue}>{formatSemester(student.semester)}</div>
            </div>
            <div className={studentStyles.summaryItem}>
              <div className={studentStyles.summaryLabel}>Batch</div>
              <div className={studentStyles.summaryValue}>{student.batch}</div>
            </div>
          </div>

          {/* Student Information Grid */}
          <div className={studentStyles.infoGrid}>
            {/* Personal Information */}
            <div className={studentStyles.infoItem}>
              <div className={studentStyles.label}>
                <i className="fas fa-user"></i> Full Name
              </div>
              <div className={studentStyles.value}>{student.fullName}</div>
            </div>

            <div className={studentStyles.infoItem}>
              <div className={studentStyles.label}>
                <i className="fas fa-venus-mars"></i> Gender
              </div>
              <div className={studentStyles.value}>{student.gender}</div>
            </div>

            <div className={studentStyles.infoItem}>
              <div className={studentStyles.label}>
                <i className="fas fa-birthday-cake"></i> Age
              </div>
              <div className={studentStyles.value}>{student.age} years</div>
            </div>

            <div className={studentStyles.infoItem}>
              <div className={studentStyles.label}>
                <i className="fas fa-city"></i> City
              </div>
              <div className={studentStyles.value}>{student.city}</div>
            </div>

            {/* Academic Information */}
            <div className={studentStyles.infoItem}>
              <div className={studentStyles.label}>
                <i className="fas fa-graduation-cap"></i> Department
              </div>
              <div className={studentStyles.value}>{student.department}</div>
            </div>

            <div className={studentStyles.infoItem}>
              <div className={studentStyles.label}>
                <i className="fas fa-calendar-alt"></i> Semester
              </div>
              <div className={studentStyles.value}>{formatSemester(student.semester)}</div>
            </div>

            <div className={studentStyles.infoItem}>
              <div className={studentStyles.label}>
                <i className="fas fa-calendar"></i> Batch
              </div>
              <div className={studentStyles.value}>{student.batch}</div>
            </div>

            <div className={studentStyles.infoItem}>
              <div className={studentStyles.label}>
                <i className="fas fa-road"></i> University Distance
              </div>
              <div className={studentStyles.value}>{formatDistance(student.universityDistance)}</div>
            </div>

            {/* Room Information */}
            <div className={studentStyles.infoItem}>
              <div className={studentStyles.label}>
                <i className="fas fa-user-friends"></i> Roommate Preference
              </div>
              <div className={studentStyles.value}>
                {student.roommateCount === 0 ? "Single" : `${student.roommateCount} Roommates`}
              </div>
            </div>

            <div className={studentStyles.infoItem}>
              <div className={studentStyles.label}>
                <i className="fas fa-bed"></i> Bed Type
              </div>
              <div className={studentStyles.value}>{student.bedType}</div>
            </div>

            <div className={studentStyles.infoItem}>
              <div className={studentStyles.label}>
                <i className="fas fa-shower"></i> Washroom Type
              </div>
              <div className={studentStyles.value}>{student.washroomType}</div>
            </div>

            {/* Account Information */}
            <div className={studentStyles.infoItem}>
              <div className={studentStyles.label}>
                <i className="fas fa-id-card"></i> Student ID
              </div>
              <div className={studentStyles.value}>#{student.userId}</div>
            </div>

            <div className={studentStyles.infoItem}>
              <div className={studentStyles.label}>
                <i className="fas fa-sign-in-alt"></i> Login ID
              </div>
              <div className={studentStyles.value}>#{student.loginId}</div>
            </div>

            <div className={studentStyles.infoItem}>
              <div className={studentStyles.label}>
                <i className="fas fa-user-tag"></i> User Type
              </div>
              <div className={studentStyles.value}>{student.userType}</div>
            </div>

            {/* Full Width Items */}
            <div className={`${studentStyles.infoItem} ${studentStyles.fullWidthItem}`}>
              <div className={studentStyles.label}>
                <i className="fas fa-info-circle"></i> Additional Information
              </div>
              <div className={studentStyles.value}>
                {student.firstName} {student.lastName} is a {student.semester}th semester student in {student.department} department.
                Currently residing in {student.city} and studying at FAST University.
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className={studentStyles.preferencesSection}>
            <h3 className={studentStyles.sectionTitle}>
              <i className="fas fa-star"></i> Accommodation Preferences
            </h3>
            <div className={studentStyles.preferencesGrid}>
              <div className={studentStyles.preferenceItem}>
                <div className={studentStyles.preferenceIcon}>
                  <i className={`fas ${student.isAcRoom ? "fa-snowflake" : "fa-fan"}`}></i>
                </div>
                <div className={studentStyles.preferenceLabel}>AC Room</div>
                <div className={`${studentStyles.preferenceValue} ${
                  student.isAcRoom ? studentStyles.booleanTrue : studentStyles.booleanFalse
                }`}>
                  {student.isAcRoom ? "Required" : "Not Required"}
                </div>
              </div>

              <div className={studentStyles.preferenceItem}>
                <div className={studentStyles.preferenceIcon}>
                  <i className={`fas ${student.isMess ? "fa-utensils" : "fa-utensil-spoon"}`}></i>
                </div>
                <div className={studentStyles.preferenceLabel}>Mess Service</div>
                <div className={`${studentStyles.preferenceValue} ${
                  student.isMess ? studentStyles.booleanTrue : studentStyles.booleanFalse
                }`}>
                  {student.isMess ? "Required" : "Not Required"}
                </div>
              </div>

              <div className={studentStyles.preferenceItem}>
                <div className={studentStyles.preferenceIcon}>
                  <i className="fas fa-users"></i>
                </div>
                <div className={studentStyles.preferenceLabel}>Room Capacity</div>
                <div className={studentStyles.preferenceValue}>
                  {student.roommateCount + 1} Persons
                </div>
              </div>

              <div className={studentStyles.preferenceItem}>
                <div className={studentStyles.preferenceIcon}>
                  <i className="fas fa-university"></i>
                </div>
                <div className={studentStyles.preferenceLabel}>Distance to Uni</div>
                <div className={studentStyles.preferenceValue}>
                  {formatDistance(student.universityDistance)}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={studentStyles.studentActions}>
            <button 
              className={studentStyles.primaryButton}
              onClick={() => {
                // Navigate to find suitable hostels for this student
                navigate(`/admin/hostels?student=${student.userId}&ac=${student.isAcRoom}&mess=${student.isMess}`);
              }}
            >
              <i className="fas fa-search"></i> Find Suitable Hostels
            </button>

            <button 
              className={studentStyles.secondaryButton}
              onClick={() => {
                // Edit student functionality
                console.log("Edit student:", student.userId);
                // navigate(`/admin/students/edit/${student.userId}`);
              }}
            >
              <i className="fas fa-edit"></i> Edit Profile
            </button>

            <button 
              className={studentStyles.dangerButton}
              onClick={handleDelete}
            >
              <i className="fas fa-trash-alt"></i> Delete Student
            </button>
          </div>
        </div>
      </div>

      {/* Font Awesome Icons */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" 
      />
    </div>
  );
};

export default AdminStudentProfile;