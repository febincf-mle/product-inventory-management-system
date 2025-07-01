import { useAppContext } from "../context/AuthContext";
import '../assets/notification.css';

function Notification() {

    const { notifications , removeNotification } = useAppContext()

    return (
        <div className="notification-wrapper">
            {notifications.map(message => {
                return (
                    <div key={message.id} className={`notification-content ${message.type}`}>
                        <span>{message.content}</span>
                        <button onClick={() => removeNotification(message.id)}>X</button>
                    </div>
                )
            })}
        </div>
    )
}

export default Notification;