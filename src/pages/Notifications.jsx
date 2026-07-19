import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyNotifications, markAllAsRead } from "../Reducer/NotificationSlice";
import Loader from "../components/Loader";

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading } = useSelector((s) => s.notification);

  useEffect(() => { dispatch(getMyNotifications()); }, []);

  return (
    <div className="sa-main">
      <div className="page-header">
        <div>
          <div className="page-title">Notifications</div>
          <div className="page-subtitle">{unreadCount} unread</div>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-outline btn-sm" onClick={() => dispatch(markAllAsRead())}>
            Mark all read
          </button>
        )}
      </div>

      {loading ? <Loader text="Loading notifications..." /> : (
        notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔔</div>
            <div className="empty-state-title">No notifications yet</div>
          </div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            {notifications.map((n, i) => (
              <div key={n._id} className={`notif-item ${!n.isRead ? "unread" : ""}`}
                style={{ borderBottom: i < notifications.length - 1 ? "1px solid #F1F5F9" : "none", padding: "16px 20px" }}>
                {!n.isRead && <div className="notif-dot" />}
                <div className="notif-content">
                  <div className="notif-title">{n.title}</div>
                  <div className="notif-msg">{n.message}</div>
                  <div className="notif-time">{timeAgo(n.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Notifications;