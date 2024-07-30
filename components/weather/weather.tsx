import React from 'react';

interface WeatherProps {
    weather: string;
}

export const WeatherCard: React.FC<WeatherProps> = (props) => {
    // Destructure the props if needed
    const { weather } = props;

    return (
        <div>
            {weather}
        </div>
    );
};