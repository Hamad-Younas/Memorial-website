import React, { useState } from 'react';
import './home-navbar.css';

const HomeNavbar = () => {
    const [activeLink, setActiveLink] = useState('');

    const handleLinkClick = (linkId) => {
        // Set the active link's ID when a link is clicked
        setActiveLink(linkId);
    };

    const renderLink = (linkId, text, imageSrc, altText) => (
        <a
            onClick={() => {
                const targetElement = document.getElementById(linkId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
                // Update the active link's state
                handleLinkClick(linkId);
            }}
            className={`flex gap-2 items-center border-b-2 mx-1.5 sm:mx-12 ${
                activeLink === linkId ? 'border-blue-500' : 'border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500'
            }`}
        >
            <img src={imageSrc} alt={altText} width={20} height={15} />
            <p>{text}</p>
        </a>
    );

    return (
        <div className="nav">
            <nav className="navbar bg-white shadow dark:bg-gray-800">
                <div className="container flex items-center justify-center py-6 px-3 mx-auto text-gray-600 capitalize dark:text-gray-300">
                    {renderLink('obituary', 'Obituary', '/images/obituary.png', 'obituary')}
                    {/* {renderLink('favourite', 'Favourite', '/images/obituary.png', 'obituary')}
                    {renderLink('timeline', 'Timeline', '/images/obituary.png', 'obituary')}
                    {renderLink('gallery', 'Gallery', '/images/obituary.png', 'obituary')} */}
                    {renderLink('memorynpm startwall', 'Memory wall', '/images/obituary.png', 'obituary')}
                    {/* {renderLink('service', 'Service', '/images/obituary.png', 'obituary')} */}
                </div>
            </nav>
        </div>
    );
};

export default HomeNavbar;
