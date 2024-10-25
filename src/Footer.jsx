import React from 'react';
import './assets/css/footer.css';

function Footer({ forecastData = [] }) { 
    return (
        <div className="container-footer">
            {forecastData.length > 0 ? ( 
                forecastData.map((day, index) => (
                    <div className="content-item" key={index}>
                        <span>{new Date(day.dt * 1000).toLocaleDateString()}</span>
                        <span>{day.main.temp}°</span>
                    </div>
                ))
            ) : (
                <p>{''}</p>
            )}
        </div>
    );
}

export default Footer;
