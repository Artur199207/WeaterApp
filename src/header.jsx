import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import './assets/css/Header.css';
import './App.css';
function Header({ setCity, handleSearch }) {
    return (
        <>
          <div className="nav">
            <form className='container' onSubmit={handleSearch}>
                <input
                    type="text"
                    id="cityInput"
                    className='contentSearch'
                    placeholder="Enter city name"
                    onChange={(e) => setCity(e.target.value)}
                />
                <button type='submit' className='btn'>Search City</button>
            </form>
        </div>
     
        </>
      
    );
}
function WeatherApp() {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [unit, setUnit] = useState('metric');
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState(0);

    const apiKey = 'f690c2d5841f83d9f311665e5d05d194';

    const fetchWeather = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('City not found');
            }
            const data = await response.json();
            console.log(data);
            setWeatherData(data);
            setError(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchCurrentLocationWeather = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;
                await fetchWeather(url);
            });
        }
    };

    const fetchForecast = async (city) => {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`;
        await fetchWeather(url);
    };

    useEffect(() => {
        fetchCurrentLocationWeather();
    }, [unit]);

    const handleSearch = (event) => {
        event.preventDefault();
        fetchForecast(city);
    };

    const toggleUnit = () => {
        setUnit((prevUnit) => (prevUnit === 'metric' ? 'imperial' : 'metric'));
    };

    const handleDayChange = (index) => {
        setSelectedDay(index);
    };

    const renderDailyForecast = () => {
        if (!weatherData) return null;

        return weatherData.list.filter(item => item.dt_txt.includes("12:00:00")).map((day, index) => (
            <div className="content-old" key={index}>
                <button onClick={() => handleDayChange(index)}>
                    {new Date(day.dt * 1000).toLocaleDateString()}
                </button>
                <p>
                    {day.main.temp}° {unit === 'metric' ? 'C' : 'F'}
                </p>
                <img
                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                    alt={day.weather[0].description}
                />
            </div>
        ));
    };

    const selectedWeather = weatherData?.list[selectedDay];

    return (
        <div>
            <Header setCity={setCity} handleSearch={handleSearch} />
            {error && <div className="error-modal">{error}</div>}
            <div className='content'>
                {selectedWeather && (
                    <div className="weather-display">
                        <h2>{selectedWeather.dt_txt}</h2>
                        <p>
                            {selectedWeather.main.temp}° {unit === 'metric' ? 'C' : 'F'}
                        </p>
                        <img
                            src={`http://openweathermap.org/img/wn/${selectedWeather.weather[0].icon}.png`}
                            alt={selectedWeather.weather[0].description}
                        />
                        <button onClick={toggleUnit}>
                            {unit === 'metric' ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
                        </button>
                    </div>
                )}
                {weatherData && weatherData.list && weatherData.list.length > 0 && (
                    <>
                        <div className="block">
                            {renderDailyForecast()}

                        </div>
                        <Footer forecastData={weatherData.list} />
                    </>

                )}
            </div>
        </div>
    );
}



export default WeatherApp;
