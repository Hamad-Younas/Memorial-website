import React, { useState, useEffect } from "react";
import './style.css'
import { FacebookShareButton, TwitterShareButton, EmailShareButton, WhatsappShareButton, InstapaperShareButton, FacebookIcon, TwitterIcon, EmailIcon, WhatsappIcon, InstapaperIcon } from 'react-share'
import axios from 'axios';

const Share = ({ modalVisible, setModalVisible }) => {
    const url = window.location.href;

    useEffect(() => {
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
    }, [modalVisible]); // Dependency array: modalVisible and proData
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

    };

    return (
        <div className="">
            {modalVisible && (
                <div
                    id="modal"
                    className="modal-container pt-4 z-50 transition duration-150 ease-in-out fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full"
                >
                    <div role="alert" className="container mx-auto w-11/12 md:w-2/3 max-w-lg">
                        <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">

                            <h1 className="text-gray-800 font-lg font-bold tracking-normal leading-tight mb-4">
                                Share the profile
                            </h1>

                            <div className="flex justify-between">
                                <FacebookShareButton url={url}>
                                    <FacebookIcon />
                                </FacebookShareButton>
                                <WhatsappShareButton url={url}>
                                    <WhatsappIcon />
                                </WhatsappShareButton>
                                <EmailShareButton url={url}>
                                    <EmailIcon />
                                </EmailShareButton>
                                <InstapaperShareButton url={url}>
                                    <InstapaperIcon />
                                </InstapaperShareButton>
                                <TwitterShareButton url={url}>
                                    <TwitterIcon />
                                </TwitterShareButton>
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

export default Share;