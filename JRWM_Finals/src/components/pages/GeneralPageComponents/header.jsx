import "/src/components/generalPageStyles/general.css";
import "./header.css";
import { React, useState } from 'react';
import { useNavigate } from "react-router-dom";
import  Notification  from "./notification";

const header = () => {
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState(false);
  
    const handleNotification = () => {
        setShowNotification(!showNotification);
    }

    const handleLogout = () => {
        navigate("/");
    }

    const handleHomepage = () => {
        navigate("/product_database");
    }

    const handleOrderLog = () => {
        navigate("/order_log");
    }

    const handleReportAnalysis = () => {
        navigate("/inventory_analysis");
    }
    
    return (
        <div>
            <div className="header">
                <div className="leftSection">
                    <img className="inventory-sys-icon" src="src/assets/icons/inventory-sys-icon.svg" alt="inventory icon" />
                    <span className="brand-name">JeRango</span>
                </div>
                <div className="middleSection"></div>
                <div className="rightSection">
                    <button onClick={handleHomepage} className="homepage-button">
                        <span className="homepage-button-text">product database</span>
                    </button>
                    <button onClick={handleOrderLog} className="inventory-button">
                        <span className="inventory-button-text">order log</span>
                    </button>
                    {/* <div className="dropdown">
                        <div className="dropdown-content">
                        </div>
                        <button className="notification-button">
                            <img src="src/icons/notif-icon.svg" alt="notification" className="notif" />
                        </button>
                    </div> */}
                    <button onClick={handleReportAnalysis} className="report-analysis-button">
                        <span className="report-analysis-button-text">report analysis</span>
                    </button>
                    <button onClick={handleNotification} className="notification-button">
                        <img src="src/assets/icons/notif-icon.svg" alt="notification" className="notification" />
                    </button>
                    <button onClick={handleLogout} className="logout-button">
                        <img src="src/assets/icons/logout-icon.svg" alt="logout" className="logout" />
                    </button>
                </div>
            </div>
            {showNotification && <Notification className = "link"/>} 
        </div>
    );  
  };
  
  
  export default header;