import React from "react";
import { useNotifications } from "../context/NotificationsContext";

const Notifications = () => {
    const { notifications } = useNotifications();

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <h1 style={{ marginBottom: "20px" }}>Notifications</h1>

            {notifications.length === 0 && (
                <p style={{ fontStyle: "italic", color: "#555" }}>
                    No notifications yet.
                </p>
            )}

            <ul style={{ listStyle: "none", padding: 0 }}>
                {notifications.map((note) => (
                    <li
                        key={note.id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "15px",
                            marginBottom: "12px",
                            backgroundColor: "#f9f9f9",
                        }}
                    >
                        <strong style={{ display: "block", marginBottom: "5px" }}>
                            {note.title}
                        </strong>
                        <p style={{ margin: "0 0 5px 0" }}>{note.message}</p>
                        <small style={{ color: "#888" }}>
                            {new Date(note.date).toLocaleString()}
                        </small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;
