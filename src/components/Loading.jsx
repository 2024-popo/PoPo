import React from 'react'
import '../asset/Loading.scss';


const Loading = () => {
    return (
        <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    )
};

export default Loading;
