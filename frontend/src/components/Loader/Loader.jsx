import React from "react";

const Loader = () => {
    return (
        <div className="container-fluid">
            <div className="d-flex flex-column align-items-center">
                <h1 className="display-4">Loading...</h1>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    )
}

export default Loader;