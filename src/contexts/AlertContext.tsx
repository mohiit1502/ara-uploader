import React, { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Alert, AlertType } from "@components/AlertStackManager/AlertStackManager";

interface AlertContextType {
	alerts: Alert[];
	showAlert: (message: string, type: AlertType) => void;
	removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

let alertId = 0;

export function AlertProvider({ children }: { children: ReactNode }) {
	const [alerts, setAlerts] = useState<Alert[]>([]);

	const showAlert = useCallback((message: string, type: AlertType) => {
		const id = `alert-${Date.now()}-${alertId++}`;
		setAlerts((prev) => [{ id, message, type }, ...prev]);
		// Timeout logic: first alert 5s, others 1s
		setTimeout(() => {
			setAlerts((prev) => prev.filter((a) => a.id !== id));
		}, alerts.length === 0 ? 5000 : 1000);
	}, [alerts.length]);

	const removeAlert = useCallback((id: string) => {
		setAlerts((prev) => prev.filter((a) => a.id !== id));
	}, []);

	return (
		<AlertContext.Provider value={{ alerts, showAlert, removeAlert }}>
			{children}
		</AlertContext.Provider>
	);
}

export function useAlert() {
	const ctx = useContext(AlertContext);
	if (!ctx) throw new Error("useAlert must be used within an AlertProvider");
	return ctx;
}
