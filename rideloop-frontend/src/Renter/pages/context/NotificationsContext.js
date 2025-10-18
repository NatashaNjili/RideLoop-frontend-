import React, { createContext, useContext, useState } from "react";

// Create context
const NotificationsContext = createContext();

// Provider component
export const NotificationsProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    // Add a new notification
    const addNotification = (notification) => {
        setNotifications((prev) => [notification, ...prev]);
    };

    return (
        <NotificationsContext.Provider value={{ notifications, addNotification }}>
            {children}
        </NotificationsContext.Provider>
    );
};

// Custom hook for easy access
export const useNotifications = () => useContext(NotificationsContext);
