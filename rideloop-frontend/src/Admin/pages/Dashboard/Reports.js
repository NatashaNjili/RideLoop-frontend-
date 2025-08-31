"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { FileText, Download, Eye, Calendar, Clock } from "lucide-react"
import "../../pagescss/Reports.css"
import logo from '../../../assets/logo.png'
import FinancialReport from '../Reports/FinancialReport'

function Reports() {
    const navigate = useNavigate()
    const [selectedReportID, setSelectedReportID] = useState(null)
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch("http://localhost:8080/rideloop/financialReport/getall")
                if (!response.ok) {
                    throw new Error("Failed to fetch reports")
                }
                const data = await response.json()
                console.log("Fetched reports:", data)
                setReports(data)
                setLoading(false)
            } catch (err) {
                console.error("Error fetching reports:", err)
                setError("Failed to load reports. Please try again later.")
                setLoading(false)
            }
        }

        fetchReports()
    }, [])

    const handleLogout = () => {
        navigate("/Login")
    }

    const handleFinancialReportCreate = (reportID) => {
        console.log("Selected Report ID:", reportID)
        navigate("/FinancialReportsAdmin", { state: { reportID } }) // pass ID as state
    }

    const handleFinancialReportUpdate = (reportID) => {
        console.log("Selected Report ID:", reportID)
        navigate("/UpdateReport", { state: { reportID } }) // pass ID as state
    }

    const handleFinancialReportDelete = (reportID) => {
        console.log("Selected Report ID:", reportID)
        navigate("/DeleteReport", { state: { reportID } }) // pass ID as state
    }

    const handleCreateReport = () => {
        navigate("/CreateReport")
    }

    return (
        <>
            <div className="dashboard-container">
                <div className="sidebar">
                    {/* Logo */}
                    <img src={logo} alt="Logo" className="logo" />

                    {/* Navigation */}
                    <nav className="sidebar-nav">

                        <ul>
                            <li><Link to="/" className="sidebar-link">Overview</Link></li>
                            {/* <li><Link to="/admin/manage-users" className="sidebar-link">Manage Users</Link></li> */}
                            <li><Link to="/ManageCars" className="sidebar-link">Manage Cars</Link></li>
                            <li><Link to="/Maintenance" className="sidebar-link">Maintenance</Link></li>
                            {/* <li><Link to="/admin/manage-bookings" className="sidebar-link">Manage Bookings</Link></li> */}
                            <li><Link to="/CustomerApproval" className="sidebar-link">Customer Approval</Link></li>
                            <li><Link to="/Reports" className="sidebar-link">Reports</Link></li>
                        </ul>

                    </nav>

                    {/* Logout Button */}
                    <div className="sidebar-footer">
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </div>

                <div className="main-content">
                    <div className="content-wrapper">
                        <h1 className="page-title">Reports</h1>

                        <div className="content-sections">
                            <div className="card">
                                <div className="card-header">
                                    <h2 className="card-title">
                                        <FileText className="icon" />
                                        Generated Reports
                                    </h2>
                                </div>
                                <div className="card-content">
                                    {loading && (
                                        <div className="loading-state">
                                            <p>Loading reports...</p>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="error-state">
                                            <p>{error}</p>
                                        </div>
                                    )}

                                    {!loading && !error && reports.length > 0 ? (
                                        <div className="table-container">
                                            <table className="reports-table">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Report Format</th>
                                                        <th>Date</th>
                                                        <th>Time Period</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {reports.map((report) => (
                                                        <tr key={report.reportID} className="table-row">
                                                            <td>
                                                                <span className="report-id">{report.reportID}</span>
                                                            </td>
                                                            <td>
                                                                <div className="format-cell">
                                                                    <FileText className="format-icon" />
                                                                    <span>{report.exportFormat}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="date-cell">
                                                                    <Calendar className="date-icon" />
                                                                    <span>{report.generateDate}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="period-cell">
                                                                    <Clock className="period-icon" />
                                                                    <span className={`badge ${report.timePeriod === "Monthly" ? "monthly" : "weekly"}`}>
                                                                        {report.timePeriod}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="actions-cell">
                                                                    {report.status === "Generated" && (
                                                                        <>
                                                                            <button className="action-btn view-btn">
                                                                                <Eye className="btn-icon" />
                                                                            </button>
                                                                            <button className="action-btn download-btn">
                                                                                <Download className="btn-icon" />
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                    <button onClick={() => handleFinancialReportCreate(report.reportID)} className="financial-report-btn">
                                                                        Generate
                                                                    </button>
                                                                    {/* <button onClick={() => handleFinancialReportUpdate(report.reportID)} className="financial-report-btn">
                                                                        Update
                                                                    </button> */}
                                                                    <button onClick={() => handleFinancialReportDelete(report.reportID)} className="financial-report-btn">
                                                                        Delete
                                                                    </button>
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
                                                <p>No reports available.</p>
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
                                        <button onClick={handleCreateReport} className="action-button">Create New Report</button>
                                        <button className="action-button">Learn More About Reports</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Reports