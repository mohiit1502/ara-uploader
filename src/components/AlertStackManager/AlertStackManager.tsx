import React from "react";
import "./AlertStackManager.component.scss";

export type AlertType = "success" | "error" | "warning";

export interface Alert {
  id: string;
  message: string;
  type: AlertType;
}

interface AlertStackManagerProps {
  alerts: Alert[];
  onRemove: (id: string) => void;
}

const AlertStackManager = ({ alerts, onRemove }: AlertStackManagerProps): JSX.Element => {
  return (
    <div className="c-AlertStackManager" style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 2000, display: 'flex', flexDirection: 'column-reverse', alignItems: 'flex-end', gap: 12 }}>
      {alerts.map((alert, idx) => (
        <div
          key={alert.id}
          className={`alert-stack-item alert-${alert.type}`}
          style={{
            minWidth: 320,
            maxWidth: 400,
            marginBottom: idx === 0 ? 0 : -32,
            boxShadow: '0 4px 24px 0 rgba(30,60,90,0.10)',
            borderRadius: 12,
            background: '#fff',
            borderLeft: `6px solid ${alert.type === 'success' ? '#1a8917' : alert.type === 'error' ? '#e53e3e' : '#f6ad55'}`,
            padding: '18px 24px 18px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            position: 'relative',
            transform: `translateY(-${(alerts.length - idx - 1) * 8}px)`,
            opacity: 1 - (alerts.length - idx - 1) * 0.12,
            transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
          }}
        >
          <span className={`alert-icon alert-icon-${alert.type}`} style={{ fontSize: 22, marginRight: 8 }}>
            {alert.type === 'success' ? '✔️' : alert.type === 'error' ? '❌' : '⚠️'}
          </span>
          <span className="alert-message" style={{ flex: 1, fontWeight: 500, color: '#2d3748' }}>{alert.message}</span>
          <button className="alert-close" style={{ background: 'none', border: 'none', fontSize: 20, color: '#aaa', cursor: 'pointer', marginLeft: 8 }} onClick={() => onRemove(alert.id)} aria-label="Close alert">&times;</button>
        </div>
      ))}
    </div>
  );
};

export default AlertStackManager;
