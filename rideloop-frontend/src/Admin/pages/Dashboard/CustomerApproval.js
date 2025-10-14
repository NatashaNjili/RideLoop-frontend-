"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { UserCheck, UserX, Eye, Delete } from "lucide-react"
import "../../pagescss/Reports.css" // reuse the same css
import logo from "../../../assets/logo.png"
import axios from "axios"

const API_URL = "http://localhost:8080/rideloop/customerapproval/getall"

function CustomerApproval() {
    const navigate = useNavigate()
    const [profiles, setProfiles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [filter, setFilter] = useState("all")

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const url = filter === "all" ? API_URL : `${API_URL}?status=${filter}`
                const response = await axios.get(url)
                console.log("Profiles Response:", response)
                setProfiles(response.data)
                setLoading(false)
            } catch (err) {
                console.error("Error fetching profiles:", err)
                setError("Failed to load customer profiles. Please try again later.")
                setLoading(false)
            }
        }

        fetchProfiles()
    }, [filter])

    const handleLogout = () => {
        navigate("/Login")
    }

    const handleViewProfile = (approvalId) => {
        console.log("Selected Report ID:", approvalId)
        navigate("/Approval", { state: { approvalId } })
    }

    // const handleApproveProfile = async (profileID) => {
    //     try {
    //         await axios.put(`${API_URL}/${profileID}/status?status=approved`)
    //         setProfiles((prev) =>
    //             prev.map((p) =>
    //                 p.profileID === profileID ? { ...p, status: "approved" } : p
    //             )
    //         )
    //     } catch (err) {
    //         console.error("Error approving profile:", err)
    //     }
    // }

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <img src={logo} alt="Logo" className="logo" />

                <nav className="sidebar-nav">
                    <ul>
                        <li><Link to="/" className="sidebar-link">Overview</Link></li>
                        <li><Link to="/ManageCars" className="sidebar-link">Manage Cars</Link></li>
                        <li><Link to="/Maintenance" className="sidebar-link">Maintenance</Link></li>
                        <li><Link to="/CustomerApproval" className="sidebar-link">Customer Approval</Link></li>
                        <li><Link to="/Reports" className="sidebar-link">Reports</Link></li>
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="content-wrapper">
                    <h1 className="page-title">Customer Approval</h1>

                    <div className="content-sections">
                        {/* Profiles Table */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Customer Profiles</h2>
                                {/* <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="filter-dropdown"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                </select> */}
                            </div>

                            <div className="card-content">
                                {loading && (
                                    <div className="loading-state">
                                        <p>Loading customers...</p>
                                    </div>
                                )}

                                {error && (
                                    <div className="error-state">
                                        <p>{error}</p>
                                    </div>
                                )}

                                {!loading && !error && profiles.length > 0 ? (
                                    <div className="table-container">
                                        <table className="reports-table">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>License Number</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {profiles.map((profile) => (
                                                    <tr key={profile.customerApprovalId
                                                    } className="table-row">
                                                        <td>{profile.customerApprovalId
                                                        }</td>
                                                        <td>{profile.licenseNumber}</td>

                                                        <td>
                                                            <span
                                                                className={`badge ${profile.approval === true ? "approved" : "pending"
                                                                    }`}
                                                            >
                                                                {profile.approval === true ? "Approved" : "Pending"}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="actions-cell">
                                                                <button
                                                                    onClick={() => handleViewProfile(profile.customerApprovalId)}
                                                                    className="action-btn view-btn"
                                                                >
                                                                    <Eye className="btn-icon" />
                                                                </button>
                                                                {profile.approval === false && (
                                                                    <button
                                                                        className="action-btn approve-btn"
                                                                    >
                                                                        <UserCheck className="btn-icon" />
                                                                    </button>
                                                                )}
                                                                {profile.approval === true && (
                                                                    <button
                                                                        className="action-btn disabled-btn"
                                                                        disabled
                                                                    >
                                                                        <UserX className="btn-icon" />
                                                                    </button>
                                                                )}
                                                                {/* <button>
                                                                    <Delete className="btn-icon" />
                                                                </button> */}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    !loading &&
                                    !error && (
                                        <div className="empty-state">
                                            <p>No customer profiles available.</p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Quick Actions</h2>
                            </div>
                            <div className="card-content">
                                <div className="quick-actions">
                                    <button
                                        onClick={() => setFilter("pending")}
                                        className="action-button"
                                    >
                                        Show Pending Approvals
                                    </button>
                                    <button
                                        onClick={() => setFilter("approved")}
                                        className="action-button"
                                    >
                                        Show Approved Customers
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerApproval
