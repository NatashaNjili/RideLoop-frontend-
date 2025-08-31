"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import "../../../Authentication/pagescss/Register.css"

function DeleteReport() {
    const navigate = useNavigate()
    const location = useLocation()
    const reportID = location.state?.reportID // get reportID from navigation
    const [reportDetails, setReportDetails] = useState(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    // Fetch report details on mount for confirmation
    useEffect(() => {
        if (reportID) {
            fetchReport(reportID)
        }
    }, [reportID])

    const fetchReport = async (id) => {
        setLoading(true)
        try {
            const response = await axios.get(`http://localhost:8080/rideloop/financialReport/read/${id}`)
            if (response.status === 200 && response.data) {
                setReportDetails(response.data)
            } else {
                setMessage("Failed to load report details.")
            }
        } catch (error) {
            console.error("Error fetching report:", error)
            setMessage("Server error. Try again later.")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        setLoading(true)
        try {
            const response = await axios.delete(`http://localhost:8080/rideloop/financialReport/delete/${reportID}`)
            console.log("Delete Response:", response)
            if (response.status === 200) {
                setMessage("Report deleted successfully!")
                // setTimeout(() => navigate("/Reports"), 1000) // redirect after 1 second
            } else {
                setMessage("Failed to delete report.")
            }
        } catch (error) {
            console.error("Error deleting report:", error)
            setMessage(error.response?.data?.message || "Server error. Try again later.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="App">
            <div style={{ position: "absolute", top: 24, left: 24, zIndex: 10 }}>
                <button
                    type="button"
                    onClick={() => navigate("/Reports")}
                    style={{
                        background: "none",
                        border: "none",
                        color: "#55d659",
                        fontSize: 18,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <span style={{ fontSize: 22, marginRight: 4 }}>&larr;</span> Back to Reports
                </button>
            </div>

            <form className="register-form">
                <h2 className="register-title">Delete Financial Report</h2>

                {loading && <p>Loading...</p>}
                {message && <p className="error-message-fr">{message}</p>}

                {reportDetails && (
                    <div
                        style={{
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            padding: "20px",
                            borderRadius: "8px",
                            marginTop: "20px",
                            textAlign: "left",
                        }}
                    >
                        <h3 style={{ color: "#ff4d4f", marginBottom: "15px" }}>
                            Report #{reportDetails.reportID} ({reportDetails.timePeriod})
                        </h3>

                        <p><strong>Generate Date:</strong> {reportDetails.generateDate}</p>
                        <p><strong>Export Format:</strong> {reportDetails.exportFormat}</p>
                        <p><strong>Total Revenue:</strong> {reportDetails.totalRevenue}</p>
                        <p><strong>Rental Income:</strong> {reportDetails.rentalIncome}</p>
                        <p><strong>Additional Charges:</strong> {reportDetails.additionalCharges}</p>
                        <p><strong>Insurance Income:</strong> {reportDetails.insuranceIncome}</p>
                        <p><strong>Expenses:</strong> {reportDetails.expenses}</p>
                        <p><strong>Net Profit:</strong> {reportDetails.netProfit}</p>

                        <button
                            onClick={() => handleDelete}
                            className="register-button"
                            style={{ marginTop: "25px", backgroundColor: "#ff4d4f" }}
                            disabled={loading}
                        >
                            {loading ? "Deleting..." : "Delete Report"}
                        </button>
                    </div>
                )}

                {!loading && !reportDetails && !message && (
                    <p>No report details available to delete.</p>
                )}
            </form>
        </div>
    )
}

export default DeleteReport
