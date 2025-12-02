import { useEffect, useState } from "react";
import styles from "../styles/HostelDashboard.module.css";

interface Hostel {
    p_HostelId: number;
    p_ManagerId: number;
    p_BlockNo: string;
    p_HouseNo: string;
    p_HostelType: string;
    p_isParking: boolean;
    p_NumRooms: number;
    p_NumFloors: number;
    p_WaterTimings: string;
    p_CleanlinessTenure: number;
    p_IssueResolvingTenure: number;
    p_MessProvide: boolean;
    p_GeezerFlag: boolean;
    p_name: string;
}

export default function HostelDashboard() {
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [pics, setPics] = useState<Record<number, string[]>>({});
    const params = new URLSearchParams(window.location.search);
    const managerId = Number(params.get("user_id"));

    console.log(managerId);

    function mapHostel(h: any): Hostel {
        return {
            p_HostelId: h.p_hostelid,
            p_ManagerId: h.p_managerid,
            p_BlockNo: h.p_blockno,
            p_HouseNo: h.p_houseno,
            p_HostelType: h.p_hosteltype,
            p_isParking: h.p_isparking,
            p_NumRooms: h.p_numrooms,
            p_NumFloors: h.p_numfloors,
            p_WaterTimings: h.p_watertimings,
            p_CleanlinessTenure: h.p_cleanlinesstenure,
            p_IssueResolvingTenure: h.p_issueresolvingtenure,
            p_MessProvide: h.p_messprovide,
            p_GeezerFlag: h.p_geezerflag,
            p_name: h.p_name,
        };
    }

    // Fetch all hostels
    useEffect(() => {
        async function fetchHostels() {
            try {
                const res = await fetch("http://127.0.0.1:8000/faststay_app/display/all_hostels");
                const data = await res.json();

                if (data?.hostels) {
                    const mapped = data.hostels.map((h: any) => mapHostel(h));

                    const filtered = mapped.filter(
                        (h: Hostel) => h.p_ManagerId === managerId
                    );
                    setHostels(filtered);

                    // For each hostel → fetch pics
                    filtered.forEach((h: { p_HostelId: number }) => fetchPics(h.p_HostelId));
                }
            } catch (error) {
                console.log("Hostel fetch error", error);
            }
        }
        fetchHostels();
    }, []);

    // Fetch hostel pics for each hostel
    async function fetchPics(hostelId: number) {
        try {
            const res = await fetch(
                `http://127.0.0.1:8000/faststay_app/display/hostel_pic?p_HostelId=${hostelId}`
            );
            const data = await res.json();

            let images: string[] = [];

            if (Array.isArray(data)) {
                images = data.map((item: any) => item.p_photolink);
            } else if (data?.p_photolink) {
                images = [data.p_photolink];
            }

            if (images.length > 0) {
                setPics((prev) => ({
                    ...prev,
                    [hostelId]: images,
                }));
            }
        } catch (err) {
            console.log("Pic fetch error", err);
        }
    }

    // Slide control
    const [slideIndex, setSlideIndex] = useState<Record<number, number>>({});

    const nextPic = (id: number) => {
        const images = pics[id];
        if (!images) return;
        setSlideIndex((p) => ({
            ...p,
            [id]: p[id] === images.length - 1 ? 0 : (p[id] || 0) + 1,
        }));
    };

    const prevPic = (id: number) => {
        const images = pics[id];
        if (!images) return;
        setSlideIndex((p) => ({
            ...p,
            [id]: p[id] === 0 ? images.length - 1 : (p[id] || 0) - 1,
        }));
    };

    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <i className="fa-solid fa-building-user"></i> FastStay
                </div>
                <div className={styles.navLinks}>
                    <a href="#" className={styles.active}>Dashboard</a>
                    <a href="/add_hostel">Add Hostel</a>
                    <a href="/add_room">Add Room</a>
                    <a href="/profile">Your Profile</a>
                    <a href="/logout">Logout</a>
                </div>
            </nav>

            <div className={styles.screen}>
                <div className={styles.container}>

                    <h2 className={styles.pageTitle}>Manager Dashboard</h2>
                    <p className={styles.subtitle}>Manage your hostels and rooms easily.</p>

                    {/* ACTION CARDS */}
                    <div className={styles.actions}>
                        <a href="/add_hostel" className={styles.actionCard}>
                            <i className="fa-solid fa-plus"></i>
                            <h3>Add Hostel</h3>
                        </a>
                        <a href="/add_room" className={styles.actionCard}>
                            <i className="fa-solid fa-bed"></i>
                            <h3>Add Room</h3>
                        </a>
                        <a href="/analytics" className={styles.actionCard}>
                            <i className="fa-solid fa-chart-line"></i>
                            <h3>Analytics</h3>
                        </a>
                    </div>

                    {/* HOSTEL LIST */}
                    <h3 className={styles.sectionTitle}>Your Hostels</h3>

                    <div className={styles.hostelList}>
                        {hostels.length === 0 && (
                            <p>No hostels found for this manager.</p>
                        )}

                        {hostels.map((h) => (
                            <div key={h.p_HostelId} className={styles.hostelCard}>

                                {/* IMAGE SLIDER */}
                                <div className={styles.imageWrapper}>
                                    {pics[h.p_HostelId]?.length > 0 ? (
                                        <>
                                            <img
                                                src={pics[h.p_HostelId][slideIndex[h.p_HostelId] || 0]}
                                                className={styles.cardImg}
                                            />

                                            {/* Only show arrows if more than 1 image */}
                                            {pics[h.p_HostelId].length > 1 && (
                                                <>
                                                    <button
                                                        className={styles.leftArrow}
                                                        onClick={() => prevPic(h.p_HostelId)}
                                                    >
                                                        &#10094;
                                                    </button>

                                                    <button
                                                        className={styles.rightArrow}
                                                        onClick={() => nextPic(h.p_HostelId)}
                                                    >
                                                        &#10095;
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <img
                                            src="https://via.placeholder.com/350x200"
                                            className={styles.cardImg}
                                        />
                                    )}
                                </div>


                                <div className={styles.info}>
                                    <h3>{h.p_name}</h3>
                                    <p><b>House:</b> {h.p_HouseNo}</p>
                                    <p><b>Block:</b> {h.p_BlockNo}</p>
                                    <p><b>Type:</b> {h.p_HostelType}</p>
                                </div>

                                <div className={styles.buttons}>
                                    <button className={`${styles.btn} ${styles.view}`}>View</button>
                                    <button className={`${styles.btn} ${styles.edit}`}>Edit</button>
                                    <button className={`${styles.btn} ${styles.delete}`}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </>
    );
}