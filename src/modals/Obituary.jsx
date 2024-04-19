import React, { useState, useEffect } from "react";
import './style.css'
import axios from 'axios';

const ObituaryModal = ({ modalVisible, setModalVisible, obituaryData }) => {
    const [data, setData] = useState('');

    useEffect(() => {
        if (obituaryData) {
            // Ensure profile.fullname, profile.startDate, profile.endDate, and profile.location exist
            setData(obituaryData.details || '');
        }

        // Function to disable body scrolling
        const disableBodyScroll = () => {
            document.body.style.overflow = 'hidden';
        };

        // Function to enable body scrolling
        const enableBodyScroll = () => {
            document.body.style.overflow = '';
        };

        // Disable body scrolling when modal is visible
        if (modalVisible) {
            disableBodyScroll();
        } else {
            enableBodyScroll();
        }

        // Cleanup function
        return () => {
            enableBodyScroll();
        };
    }, [modalVisible, obituaryData]); // Dependency array: modalVisible and proData
    // Add proData to the dependency array


    const handleModalVisibility = (visible) => {
        setModalVisible(visible);
    };

    const fadeIn = (el) => {
        el.style.opacity = 0;
        el.style.display = "flex";
        (function fade() {
            let val = parseFloat(el.style.opacity);
            if (!((val += 0.2) > 1)) {
                el.style.opacity = val;
                requestAnimationFrame(fade);
            }
        })();
    };

    const fadeOut = (el) => {
        el.style.opacity = 1;
        (function fade() {
            if ((el.style.opacity -= 0.1) < 0) {
                el.style.display = "none";
            } else {
                requestAnimationFrame(fade);
            }
        })();
    };

    const handleClick = async () => {
        // Retrieve user data from local storage and parse it
        const user = JSON.parse(localStorage.getItem('user'));

        // Alert the user ID (for debugging purposes)
        console.log(user._id); // Change from alert to console.log for better logging

        // Check if user ID is available
        if (!user) {
            alert('User not found.');
            return;
        }

        // Get form input values
        const details = document.getElementById('text').value; // Make sure to change this ID if needed

        // Create a data object to send to the backend
        const data = {
            details
        };

        try {
            // Make a POST request to add the data to the backend
            const response = await axios.post(`http://localhost:8800/Obituary/add?userId=${user._id}`, data);

            // Check the response status
            if (response.status === 200) {
                // Data added successfully, you can handle the success case (e.g., show a success message)
                alert('Data added successfully');
                setModalVisible(false)
            } else {
                // Handle other response statuses
                alert('An error occurred. Please try again.');
            }
        } catch (error) {
            // Handle any errors during the request
            console.error('Error adding data:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="">
            {modalVisible && (
                <div
                    id="modal"
                    className="modal-container pt-4 z-50 transition duration-150 ease-in-out fixed top-0 left-1/2 transform -translate-x-1/2 -translate-y-0 w-full h-full"
                >
                    <div role="alert" className="container mx-auto w-11/12 md:w-2/3 max-w-lg">
                        <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">

                            <h1 className="text-gray-800 font-lg font-bold tracking-normal leading-tight mb-4">
                                Obituary Information
                            </h1>
                            <label
                                htmlFor="name"
                                className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
                            >
                                Obituary
                            </label>
                            <textarea
                                id="text"
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-130 flex items-center pl-3 text-sm border-gray-300 rounded border"
                                placeholder="James"
                                rows={10}
                            />
                            <div className="flex items-center justify-start w-full">
                                <button className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out rounded text-white px-8 py-2 text-sm" style={{ backgroundColor: "#95c6b4" }} onClick={handleClick}>
                                    Submit
                                </button>
                                <button
                                    className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
                                    onClick={() => handleModalVisibility(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                            <button
                                className="cursor-pointer absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600"
                                onClick={() => handleModalVisibility(false)}
                                aria-label="close modal"
                                role="button"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon icon-tabler icon-tabler-x"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2.5"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ObituaryModal;