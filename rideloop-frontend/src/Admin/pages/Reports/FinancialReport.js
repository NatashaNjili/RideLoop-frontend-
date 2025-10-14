"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "../../../Authentication/pagescss/Register.css"

function FinancialReport() {
    const navigate = useNavigate()
    const [reportData, setReportData] = useState({
        reportID: "",
        generateDate: ""
    })
    const [reportResults, setReportResults] = useState(null)
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setReportData({ ...reportData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage("")
        setLoading(true)

        if (!reportData.reportID) {
            setMessage("Please enter a Report ID.")
            setLoading(false)
            return
        }

        try {
            // get all reports
            const response = await axios.get("http://localhost:8080/rideloop/financialReport/getall")
            console.log("Response:", response)

            if (response.status === 200) {
                // find the report that matches the reportID entered by user
                const foundReport = response.data.find(
                    (report) => report.reportID === parseInt(reportData.reportID)
                )

                if (foundReport) {
                    setReportResults(foundReport)
                    setMessage("Report found successfully!")
                } else {
                    setReportResults(null)
                    setMessage(`No report found with Report ID ${reportData.reportID}`)
                }
            } else {
                setMessage("Unexpected server response.")
            }
        } catch (error) {
            console.error("Error:", error)
            setMessage(error.response?.data?.message || "Server error. Try again later.")
        } finally {
            setLoading(false)
        }
    }


    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount || 0)
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
                    <span style={{ fontSize: 22, marginRight: 4 }}>&larr;</span> Back to Dashboard
                </button>
            </div>

            <form className="register-form" onSubmit={handleSubmit}>
                <h2 className="register-title">Fetch Financial Report</h2>

                {message && <p className="error-message-fr">{message}</p>}

                <div>
                    <label className="register-label">Report ID</label>
                    <input
                        type="number"
                        name="reportID"
                        className="register-input"
                        value={reportData.reportID}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label className="register-label">Generate Date</label>
                    <input
                        type="date"
                        name="generateDate"
                        className="register-input"
                        value={reportData.generateDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="register-button" style={{ marginTop: "25px" }} disabled={loading}>
                    {loading ? "Fetching..." : "Fetch Report"}
                </button>

                {reportResults && (
                    <div
                        style={{
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            padding: "20px",
                            borderRadius: "8px",
                            marginTop: "20px",
                            textAlign: "left",
                        }}
                    >
                        <h3 style={{ color: "#55d659", marginBottom: "15px" }}>
                            Report #{reportResults.reportID} ({reportResults.timePeriod})
                        </h3>

                        <p><strong>Generate Date:</strong> {reportResults.generateDate}</p>
                        <p><strong>Export Format:</strong> {reportResults.exportFormat}</p>
                        <p><strong>Total Revenue:</strong> {formatCurrency(reportResults.totalRevenue)}</p>
                        <p><strong>Expenses:</strong> {formatCurrency(reportResults.expenses)}</p>
                        <p><strong>Net Profit:</strong> {formatCurrency(reportResults.netProfit)}</p>
                        <p><strong>Rental Income:</strong> {formatCurrency(reportResults.rentalIncome)}</p>
                        <p><strong>Insurance Income:</strong> {formatCurrency(reportResults.insuranceIncome)}</p>
                        <p><strong>Additional Charges:</strong> {formatCurrency(reportResults.additionalCharges)}</p>
                    </div>
                )}
            </form>
        </div>
    )
}

export default FinancialReport
