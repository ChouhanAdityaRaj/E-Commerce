import React from 'react'

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-9xl font-bold text-gray-800">404</h1>
            <p className="text-xl md:text-2xl text-gray-600 mt-4 text-center">
                Oops! The page you're looking for doesn't exist.
            </p>
        </div>
    )
}

export default NotFound