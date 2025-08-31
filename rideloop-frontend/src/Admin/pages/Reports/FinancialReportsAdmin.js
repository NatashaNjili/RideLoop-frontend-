"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import "../../../Authentication/pagescss/Register.css"

function FinancialReport() { // accept reportID as a prop
    const navigate = useNavigate()
    const [reportResults, setReportResults] = useState(null)
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const reportID = location.state?.reportID

    console.log("FinancialReport component loaded with reportID:", reportID)

    useEffect(() => {
        if (reportID) {
            fetchReport(reportID)
        }
    }, [reportID])

    const fetchReport = async (id) => {
        setMessage("")
        setLoading(true)
        console.log("Fetching report with ID:", id)
        try {
            const response = await axios.get(`http://localhost:8080/rideloop/financialReport/read/${id}`)
            console.log("Response:", response)
            if (response.status === 200 && response.data) {
                setReportResults(response.data)
                setMessage("Report loaded successfully!")
            } else {
                setReportResults(null)
                setMessage(`No report found with Report ID ${id}`)
            }
        } catch (error) {
            console.error("Error:", error)
            setReportResults(null)
            setMessage(error.response?.data?.message || "Server error. Try again later.")
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-ZA", {
            style: "currency",
            currency: "ZAR",
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

            <form className="register-form">
                <h2 className="register-title">Financial Report Details</h2>

                {loading && <p>Loading report...</p>}
                {message && <p className="error-message-fr">{message}</p>}

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
