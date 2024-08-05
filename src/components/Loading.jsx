import React from 'react'
import { GridLoader } from 'react-spinners';
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