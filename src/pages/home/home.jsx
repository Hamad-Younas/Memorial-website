import React, { useState, useEffect, useRef } from 'react';
import './home.css';
import HomeNavbar from '../../components/navbar/home-navbar';
import Footer from '../../components/footer/footer';
import ProfileModal from '../../modals/profileModal';
import axios from 'axios';
import ObituaryModal from '../../modals/Obituary';
import MemoryWallModal from '../../modals/memoryWall';
import Share from '../../modals/share';

const Home = () => {
  const [imageSrc, setImageSrc] = useState('https://www.online-tribute.com/memorial/static/white-lily.jpg');
  const [hideProfile, setHideProfile] = useState(false);
  const [hideTopNav, setHideTopNav] = useState(true);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOModalVisible, setIsOModalVisible] = useState(false);
  const [isWModalVisible, setIsWModalVisible] = useState(false);
  const [isSModalVisible, setIsSModalVisible] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [obituaryData, setobituaryData] = useState(null);
  const [walldata, setWallData] = useState([])
  const [error, setError] = useState(null);
  const bgImgInputRef = useRef(null);
  const proImgInputRef = useRef(null);
  const [currBG, setCurrBG] = useState('');
  const [currPro, setCurrPro] = useState('');

  const changeImage = () => {
    // bgImgInputRef.current.click();
    // setImageSrc(prevSrc =>
    //   prevSrc === 'https://www.online-tribute.com/memorial/static/white-lily.jpg'
    //     ? 'https://www.online-tribute.com/memorial/static/black-ribbon.jpg'
    //     : 'https://www.online-tribute.com/memorial/static/white-lily.jpg'
    // );
  };
  const changeProImage = () => {
    proImgInputRef.current.click();
  }
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {

      const user = JSON.parse(localStorage.getItem('user'));

      // Alert the user ID (for debugging purposes)
      console.log(user._id); // Change from alert to console.log for better logging

      // Check if user ID is available
      if (!user) {
        alert('User not found.');
        return;
      }

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "qyipkvm1");
      data.append("cloud_name", "dvojlf2hl");

      try {
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dvojlf2hl/image/upload",
          data
        );

        const { url } = uploadRes.data;

        const response = await axios.post(`http://localhost:8800/bg/add?userId=${user._id}`, {
          img: url
        });
        if (response.status === 200) {
          const reader = new FileReader();

          // Define the onload event handler
          reader.onload = () => {
            // Set the image URL to the data URL of the file
            setCurrBG(reader.result);
          };

          // Read the file as a data URL
          reader.readAsDataURL(file);
        } else {
          // Handle other response statuses
          alert('An error occurred. Please try again.');
        }
      } catch (err) {
        console.log(err)
      }
    }
  };

  const handleProFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {

      const user = JSON.parse(localStorage.getItem('user'));

      // Alert the user ID (for debugging purposes)
      console.log(user._id); // Change from alert to console.log for better logging

      // Check if user ID is available
      if (!user) {
        alert('User not found.');
        return;
      }

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "qyipkvm1");
      data.append("cloud_name", "dvojlf2hl");

      try {
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dvojlf2hl/image/upload",
          data
        );

        const { url } = uploadRes.data;

        const response = await axios.post(`http://localhost:8800/image/add?userId=${user._id}`, {
          img: url
        });
        if (response.status === 200) {
          const reader = new FileReader();

          // Define the onload event handler
          reader.onload = () => {
            // Set the image URL to the data URL of the file
            setCurrPro(reader.result);
          };

          // Read the file as a data URL
          reader.readAsDataURL(file);
        } else {
          // Handle other response statuses
          alert('An error occurred. Please try again.');
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  useEffect(() => {
    let lastHiddenPosition = 0; // Variable to store the position where profile was last hidden
    let prevScrollPosition = 0; // Variable to store the previous scroll position
    let isProfileHidden = false; // Variable to track whether the profile is currently hidden or not

    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      const profileCard = document.getElementById('profileCard');
      const middleOfScreen = window.innerHeight / 2;

      if (currentScrollPosition > prevScrollPosition) {
        // Scrolling down
        if (!isProfileHidden && profileCard.getBoundingClientRect().bottom < middleOfScreen) {
          setHideProfile(true);
          setHideTopNav(false);
          isProfileHidden = true;
        }
      } else {
        // Scrolling up
        if (isProfileHidden && currentScrollPosition <= lastHiddenPosition + 500) {
          setHideProfile(false);
          setHideTopNav(true);
          isProfileHidden = false;
        }
      }

      prevScrollPosition = currentScrollPosition;
      if (isProfileHidden && currentScrollPosition < lastHiddenPosition) {
        lastHiddenPosition = currentScrollPosition;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Define a function to fetch the user profile data
    const fetchProfileData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const Id = user._id

        // Check if user ID is available
        if (!user) {
          return;
        }
        // Make a GET request to the backend API to fetch the user's profile data
        const response = await axios.get(`http://localhost:8800/profile/get/${Id}`);

        // If the request is successful, update the state with the fetched data
        setProfileData(response.data);
      } catch (err) {
        // Handle any errors that occur during the request
        console.error('Error fetching user profile data:', err);
        setError('Failed to fetch user profile data.');
      }
    };

    const fetchObituaryData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const Id = user._id

        // Check if user ID is available
        if (!user) {
          return;
        }
        // Make a GET request to the backend API to fetch the user's profile data
        const response = await axios.get(`http://localhost:8800/Obituary/get/${Id}`);

        // If the request is successful, update the state with the fetched data
        console.log(response.data, "obityds")
        setobituaryData(response.data);
      } catch (err) {
        // Handle any errors that occur during the request
        console.error('Error fetching user profile data:', err);
        setError('Failed to fetch user profile data.');
      }
    };

    const fetchbgimage = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const Id = user._id

        // Check if user ID is available
        if (!user) {
          return;
        }
        // Make a GET request to the backend API to fetch the user's profile data
        const response = await axios.get(`http://localhost:8800/bg/get/${Id}`);

        // If the request is successful, update the state with the fetched data
        setCurrBG(response.data.img)
        // setCurrBG(response.data[0].im);
      } catch (err) {
        // Handle any errors that occur during the request
        console.error('Error fetching user profile data:', err);
        setError('Failed to fetch user profile data.');
      }
    };

    const fetchProimage = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const Id = user._id

        // Check if user ID is available
        if (!user) {
          return;
        }
        // Make a GET request to the backend API to fetch the user's profile data
        const response = await axios.get(`http://localhost:8800/image/get/${Id}`);

        // If the request is successful, update the state with the fetched data
        setCurrPro(response.data.img)
        // setCurrBG(response.data[0].im);
      } catch (err) {
        // Handle any errors that occur during the request
        console.error('Error fetching user profile data:', err);
        setError('Failed to fetch user profile data.');
      }
    };

    const fetchWallimages = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const Id = user._id

        // Check if user ID is available
        if (!user) {
          return;
        }
        // Make a GET request to the backend API to fetch the user's profile data
        const response = await axios.get(`http://localhost:8800/wall/get/${Id}`);

        // If the request is successful, update the state with the fetched data
        console.log(response.data)
        setWallData(response.data)
        // setCurrBG(response.data[0].im);
      } catch (err) {
        // Handle any errors that occur during the request
        console.error('Error fetching user profile data:', err);
        setError('Failed to fetch user profile data.');
      }
    };

    // Call the function to fetch the data
    fetchWallimages()
    fetchObituaryData()
    fetchProimage()
    fetchProfileData();
    fetchbgimage();
  }, [isModalVisible, isOModalVisible, isWModalVisible]); // Depend on userId to refetch data if it changes

  const registerclick = () => {
    window.location.href = '/register';
  }

  // Function to open the modal
  const openModal = () => {
    setIsModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalVisible(false);
  };


  function formatDate(dateString) {
    // Parse the date string into a Date object
    const date = new Date(dateString);

    // Create an array of month names
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Get the day, month, and year from the date object
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Determine the appropriate suffix for the day
    const getDaySuffix = (day) => {
      if (day > 3 && day < 21) {
        return 'th';
      }
      switch (day % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    };

    // Format the date in the desired format
    const formattedDate = `${month} ${day}${getDaySuffix(day)}, ${year}`;

    return formattedDate;
  }

  const OpenObituaryModal = () => {
    setIsOModalVisible(true)
  }

  const handleContributeClick = () => {
    setIsWModalVisible(true)
  }

  const handleShare = () => {
    setIsSModalVisible(true);
  }

  return (
    <div id="page">
      <div className='register-footer'>
        <button onClick={registerclick} className='register-btn'>Register Now</button>
        <p>Don't forget to save the page</p>
      </div>
      <div className='background'>
        <img src={"https://www.online-tribute.com/memorial/static/white-lily.jpg"} className='background-img' />
        <div className='btn-container' onClick={changeImage}>
          <input
            type="file"
            accept="image/*" // Only allow image file types
            ref={bgImgInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }} // Hide the file input element
          />
          <img src='/images/img ph.png' width={20} height={20} />
          <button className='ch-bg-btn z-40'>Change Background</button>
        </div>
      </div>
      <div className={`${hideTopNav ? 'hide-top-nav' : 'top-nav'}`}>
        <div className='top-nav-content'>
          <div className='nav-img'>
            <img src={currPro ? currPro : "https://www.online-tribute.com/memorial/static/white-lily.jpg"} width={40} height={40} />
          </div>
          <p>{profileData && profileData.length > 0 ? profileData[0].fullname : "Your Name"}</p>
        </div>
      </div>
      <div className='set-height'>
        <div className={`profile-card ${hideProfile ? 'hide-profile' : ''}`} id='profileCard'>
          <div className='profile-img' style={{ backgroundImage: `url(${currPro ? currPro : "https://www.online-tribute.com/memorial/static/white-lily.jpg"})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
            <div className='adj-img'>
              <img onClick={handleShare} src='/images/adj.png' width={25} height={20} />
            </div>
            <div className='profile-btn-container' onClick={changeProImage}>
              <input
                type="file"
                accept="image/*" // Only allow image file types
                ref={proImgInputRef}
                onChange={handleProFileChange}
                style={{ display: 'none' }} // Hide the file input element
              />
              <img src='/images/img ph.png' width={20} height={20} />
              <button className='ch-bg-btn'>Change Image</button>
            </div>
          </div>
          <div className='profile-input' onClick={openModal}>
            <div className='pro-name'>
              <p>{profileData && profileData.length > 0 ? profileData[0].fullname : "Your Name"}</p>
            </div>
            <div className='datepicker'>
              <img src="/images/date.png" alt="date" width={30} height={30} />
              <p>{profileData && profileData.length > 0 ? formatDate(profileData[0].startDate) : "Start Date"}</p>
              <img src="/images/dot.png" alt="dot" width={30} height={30} />
              <p>{profileData && profileData.length > 0 ? formatDate(profileData[0].endDate) : "End Date"}</p>
            </div>
            <div className='pro-loc'>
              <img src="/images/location.png" alt="location" width={30} height={30} />
              <p>{profileData && profileData.length > 0 ? profileData[0].location : "Your location"}</p>
            </div>
          </div>
        </div>
      </div>
      <HomeNavbar />
      <div className='paragraph'>
        <div className='para-content'>
          <img src="/images/quotes.png" alt="" width={30} height={30} />
          <p>Death leaves a heartache no one can heal, love leaves a memory no one can steal.</p>
        </div>
      </div>
      <div id='obituary' className='section1'>
        <div className='input-fields'>
          <div className='title'>
            <p className='f'>Obituary</p>
            <img onClick={OpenObituaryModal} src="/images/edit.png" alt="edit" width={30} height={30} />
          </div>
          <div className='label-border'></div>
          <p className="para-style" id='Obituary'>
            {obituaryData ? obituaryData.details : "Evelyn Wilson, a beloved wife, mother, and dedicated community member, peacefully passed away on March 25, 2023 - at the age of 73." +
              "Born on March 10, 1950, Evelyn grew up with strong family values and a deep sense of community." +

              "She excelled academically and athletically in high school, eventually earning a Bachelor's degree in Business Administration." +
              "In 1975, Evelyn married her love, Anthony, and they shared 48 years of a loving marriage, raising two children, Emily and Michael, and becoming adoring grandparents to Grace, Ethan, and Lily." +
              "Professionally, Evelyn had a distinguished career in finance, marked by her integrity and mentorship of young professionals. She also dedicated her time to various charitable causes, leaving a positive impact on her community." +
              "Evelyn had a passion for the outdoors, often spending weekends camping, fishing, and hiking with her family, instilling a love for nature in her loved ones." +

              "Evelyn is survived by her wife, children, grandchildren, and siblings, Robert Jr. and Susan. A memorial service will be held on October 2, 2023, at St. Mary's Community Church at 2:00 PM." +
              "In lieu of flowers, the family requests donations to the Evelyn Wilson Memorial Scholarship Fund, supporting underprivileged youth's education in the community. Evelyn's legacy lives on through the countless lives he touched, the values he upheld, and the love she shared. She will be deeply missed but forever cherished."}
          </p>
        </div>
      </div>
      {/* <div id='favourite' className='section1'>
        <div className='input-fields'>
          <p className='f'>Favorites</p>
          <div className='label-border'></div>
          <section>
            <div class="text-gray-500 -mx-1">
              <div class="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div class="relative group overflow-hidden p-8 rounded-xl bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
                  <div aria-hidden="true" class="inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b from-blue-500 to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10"></div>
                  <div class="relative">
                    <div class="border border-blue-500/10 flex relative *:relative *:size-6 *:m-auto size-12 rounded-lg dark:bg-gray-900 dark:border-white/15 before:rounded-[7px] before:absolute before:inset-0 before:border-t before:border-white before:from-blue-100 dark:before:border-white/20 before:bg-gradient-to-b dark:before:from-white/10 dark:before:to-transparent before:shadow dark:before:shadow-gray-950">
                      <svg class="text-[#000014] dark:text-white" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 128 128">
                        <defs>
                          <linearGradient id="deviconAstro0" x1="882.997" x2="638.955" y1="27.113" y2="866.902" gradientTransform="scale(.1)" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stop-color="currentColor"></stop>
                            <stop offset="1" stop-color="currentColor"></stop>
                          </linearGradient>
                          <linearGradient id="deviconAstro1" x1="1001.68" x2="790.326" y1="652.45" y2="1094.91" gradientTransform="scale(.1)" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stop-color="#ff1639"></stop>
                            <stop offset="1" stop-color="#ff1639" stop-opacity="0"></stop>
                          </linearGradient>
                        </defs>
                        <path fill="url(#deviconAstro0)" d="M81.504 9.465c.973 1.207 1.469 2.836 2.457 6.09l21.656 71.136a90.079 90.079 0 0 0-25.89-8.765L65.629 30.28a1.833 1.833 0 0 0-3.52.004L48.18 77.902a90.104 90.104 0 0 0-26.003 8.778l21.758-71.14c.996-3.25 1.492-4.876 2.464-6.083a8.023 8.023 0 0 1 3.243-2.398c1.433-.575 3.136-.575 6.535-.575H71.72c3.402 0 5.105 0 6.543.579a7.988 7.988 0 0 1 3.242 2.402Zm0 0"></path>
                        <path fill="#ff5d01" d="M84.094 90.074c-3.57 3.055-10.696 5.137-18.903 5.137c-10.07 0-18.515-3.137-20.754-7.356c-.8 2.418-.98 5.184-.98 6.954c0 0-.527 8.675 5.508 14.71a5.671 5.671 0 0 1 5.672-5.671c5.37 0 5.367 4.683 5.363 8.488v.336c0 5.773 3.527 10.719 8.543 12.805a11.62 11.62 0 0 1-1.172-5.098c0-5.508 3.23-7.555 6.988-9.938c2.989-1.894 6.309-4 8.594-8.222a15.513 15.513 0 0 0 1.875-7.41a15.55 15.55 0 0 0-.734-4.735m0 0"></path>
                        <path fill="url(#deviconAstro1)" d="M84.094 90.074c-3.57 3.055-10.696 5.137-18.903 5.137c-10.07 0-18.515-3.137-20.754-7.356c-.8 2.418-.98 5.184-.98 6.954c0 0-.527 8.675 5.508 14.71a5.671 5.671 0 0 1 5.672-5.671c5.37 0 5.367 4.683 5.363 8.488v.336c0 5.773 3.527 10.719 8.543 12.805a11.62 11.62 0 0 1-1.172-5.098c0-5.508 3.23-7.555 6.988-9.938c2.989-1.894 6.309-4 8.594-8.222a15.513 15.513 0 0 0 1.875-7.41a15.55 15.55 0 0 0-.734-4.735m0 0"></path>
                      </svg>
                    </div>

                    <div class="mt-6 pb-6 rounded-b-[--card-border-radius]">
                      <p class="text-gray-700 dark:text-gray-300">Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.</p>
                    </div>

                    <div class="flex gap-3 -mb-8 py-4 border-t border-gray-200 dark:border-gray-800">
                      <a href="#" download="/" class="group rounded-xl disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-gray-950 disabled:border-gray-200 disabled:bg-gray-100 dark:disabled:border-gray-800/50 disabled:dark:bg-gray-900 dark:*:disabled:!text-white text-gray-950 bg-gray-100 hover:bg-gray-200/75 active:bg-gray-100 dark:text-white dark:bg-gray-500/10 dark:hover:bg-gray-500/15 dark:active:bg-gray-500/10 flex gap-1.5 items-center text-sm h-8 px-3.5 justify-center">
                        <span>Download</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17 13l-5 5m0 0l-5-5m5 5V6"></path></svg>
                      </a>
                      <a href="#" class="group flex items-center rounded-xl disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-gray-950 disabled:border-gray-200 disabled:bg-gray-100 dark:disabled:border-gray-800/50 disabled:dark:bg-gray-900 dark:*:disabled:!text-white text-gray-950 bg-gray-100 hover:bg-gray-200/75 active:bg-gray-100 dark:text-white dark:bg-gray-500/10 dark:hover:bg-gray-500/15 dark:active:bg-gray-500/10 size-8 justify-center">
                        <span class="sr-only">Source Code</span>
                        <svg class="size-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"></path></svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div href="#" class="relative group overflow-hidden p-8 rounded-xl bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
                  <div aria-hidden="true" class="inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b from-green-500 to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10"></div>
                  <div class="relative">
                    <div class="border border-green-500/10 flex relative *:relative *:size-6 *:m-auto size-12 rounded-lg dark:bg-gray-900 dark:border-white/15 before:rounded-[7px] before:absolute before:inset-0 before:border-t before:border-white before:from-green-100 dark:before:border-white/20 before:bg-gradient-to-b dark:before:from-white/10 dark:before:to-transparent before:shadow dark:before:shadow-gray-950">
                      <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 263"><defs><linearGradient id="logosSupabaseIcon0" x1="20.862%" x2="63.426%" y1="20.687%" y2="44.071%"><stop offset="0%" stop-color="#249361"></stop><stop offset="100%" stop-color="#3ecf8e"></stop></linearGradient><linearGradient id="logosSupabaseIcon1" x1="1.991%" x2="21.403%" y1="-13.158%" y2="34.708%"><stop offset="0%"></stop><stop offset="100%" stop-opacity="0"></stop></linearGradient></defs><path fill="url(#logosSupabaseIcon0)" d="M149.602 258.579c-6.718 8.46-20.338 3.824-20.5-6.977l-2.367-157.984h106.229c19.24 0 29.971 22.223 18.007 37.292z"></path><path fill="url(#logosSupabaseIcon1)" fill-opacity="0.2" d="M149.602 258.579c-6.718 8.46-20.338 3.824-20.5-6.977l-2.367-157.984h106.229c19.24 0 29.971 22.223 18.007 37.292z"></path><path fill="#3ecf8e" d="M106.399 4.37c6.717-8.461 20.338-3.826 20.5 6.976l1.037 157.984H23.037c-19.241 0-29.973-22.223-18.008-37.292z"></path></svg>
                    </div>

                    <div class="mt-6 pb-6 rounded-b-[--card-border-radius]">
                      <p class="text-gray-700 dark:text-gray-300">Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.</p>
                    </div>

                    <div class="flex gap-3 -mb-8 py-4 border-t border-gray-200 dark:border-gray-800">
                      <a href="#" download="/" class="group rounded-xl disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-gray-950 disabled:border-gray-200 disabled:bg-gray-100 dark:disabled:border-gray-800/50 disabled:dark:bg-gray-900 dark:*:disabled:!text-white text-gray-950 bg-gray-100 hover:bg-gray-200/75 active:bg-gray-100 dark:text-white dark:bg-gray-500/10 dark:hover:bg-gray-500/15 dark:active:bg-gray-500/10 flex gap-1.5 items-center text-sm h-8 px-3.5 justify-center">
                        <span>Download</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17 13l-5 5m0 0l-5-5m5 5V6"></path></svg>
                      </a>
                      <a href="#i" class="group flex items-center rounded-xl disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-gray-950 disabled:border-gray-200 disabled:bg-gray-100 dark:disabled:border-gray-800/50 disabled:dark:bg-gray-900 dark:*:disabled:!text-white text-gray-950 bg-gray-100 hover:bg-gray-200/75 active:bg-gray-100 dark:text-white dark:bg-gray-500/10 dark:hover:bg-gray-500/15 dark:active:bg-gray-500/10 size-8 justify-center">
                        <span class="sr-only">Source Code</span>
                        <svg class="size-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"></path></svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="relative group overflow-hidden p-8 rounded-xl bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
                  <div aria-hidden="true" class="inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b from-red-500 to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10"></div>
                  <div class="relative">
                    <div class="border border-red-500/10 flex relative *:relative *:size-6 *:m-auto size-12 rounded-lg dark:bg-gray-900 dark:border-white/15 before:rounded-[7px] before:absolute before:inset-0 before:border-t before:border-white before:from-red-100 dark:before:border-white/20 before:bg-gradient-to-b dark:before:from-white/10 dark:before:to-transparent before:shadow dark:before:shadow-gray-950">
                      <svg xmlns="http://www.w3.org/2000/svg" width="0.95em" height="1em" viewBox="0 0 256 271"><defs><linearGradient id="logosAngularIcon0" x1="25.071%" x2="96.132%" y1="90.929%" y2="55.184%"><stop offset="0%" stop-color="#e40035"></stop><stop offset="24%" stop-color="#f60a48"></stop><stop offset="35.2%" stop-color="#f20755"></stop><stop offset="49.4%" stop-color="#dc087d"></stop><stop offset="74.5%" stop-color="#9717e7"></stop><stop offset="100%" stop-color="#6c00f5"></stop></linearGradient><linearGradient id="logosAngularIcon1" x1="21.863%" x2="68.367%" y1="12.058%" y2="68.21%"><stop offset="0%" stop-color="#ff31d9"></stop><stop offset="100%" stop-color="#ff5be1" stop-opacity="0"></stop></linearGradient></defs><path fill="url(#logosAngularIcon0)" d="m256 45.179l-9.244 145.158L158.373 0zm-61.217 187.697l-66.782 38.105l-66.784-38.105L74.8 199.958h106.4zM128.001 72.249l34.994 85.076h-69.99zM9.149 190.337L0 45.179L97.627 0z"></path><path fill="url(#logosAngularIcon1)" d="m256 45.179l-9.244 145.158L158.373 0zm-61.217 187.697l-66.782 38.105l-66.784-38.105L74.8 199.958h106.4zM128.001 72.249l34.994 85.076h-69.99zM9.149 190.337L0 45.179L97.627 0z"></path></svg>
                    </div>

                    <div class="mt-6 pb-6 rounded-b-[--card-border-radius]">
                      <p class="text-gray-700 dark:text-gray-300">Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.</p>
                    </div>
                    <div class="flex gap-3 -mb-8 py-4 border-t border-gray-200 dark:border-gray-800">
                      <a href="#" download="/" class="group rounded-xl disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-gray-950 disabled:border-gray-200 disabled:bg-gray-100 dark:disabled:border-gray-800/50 disabled:dark:bg-gray-900 dark:*:disabled:!text-white text-gray-950 bg-gray-100 hover:bg-gray-200/75 active:bg-gray-100 dark:text-white dark:bg-gray-500/10 dark:hover:bg-gray-500/15 dark:active:bg-gray-500/10 flex gap-1.5 items-center text-sm h-8 px-3.5 justify-center">
                        <span>Download</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17 13l-5 5m0 0l-5-5m5 5V6"></path></svg>
                      </a>
                      <a href="#" class="group flex items-center rounded-xl disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-gray-950 disabled:border-gray-200 disabled:bg-gray-100 dark:disabled:border-gray-800/50 disabled:dark:bg-gray-900 dark:*:disabled:!text-white text-gray-950 bg-gray-100 hover:bg-gray-200/75 active:bg-gray-100 dark:text-white dark:bg-gray-500/10 dark:hover:bg-gray-500/15 dark:active:bg-gray-500/10 size-8 justify-center">
                        <span class="sr-only">Source Code</span>
                        <svg class="size-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"></path></svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="relative group overflow-hidden p-8 rounded-xl bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
                  <div aria-hidden="true" class="inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b from-gray-500 to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10"></div>
                  <div class="relative">
                    <div class="border border-gray-500/10 flex relative *:relative *:size-6 *:m-auto  text-gray-950 dark:text-white size-12 rounded-lg dark:bg-gray-900 dark:border-white/15 before:rounded-[7px] before:absolute before:inset-0 before:border-t before:border-white before:from-gray-100 dark:before:border-white/20 before:bg-gradient-to-b dark:before:from-white/10 dark:before:to-transparent before:shadow dark:before:shadow-gray-950">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15"><path fill="currentColor" d="m4.5 4.5l.405-.293A.5.5 0 0 0 4 4.5zm3 9.5A6.5 6.5 0 0 1 1 7.5H0A7.5 7.5 0 0 0 7.5 15zM14 7.5A6.5 6.5 0 0 1 7.5 14v1A7.5 7.5 0 0 0 15 7.5zM7.5 1A6.5 6.5 0 0 1 14 7.5h1A7.5 7.5 0 0 0 7.5 0zm0-1A7.5 7.5 0 0 0 0 7.5h1A6.5 6.5 0 0 1 7.5 1zM5 12V4.5H4V12zm-.905-7.207l6.5 9l.81-.586l-6.5-9zM10 4v6h1V4z"></path></svg>
                    </div>

                    <div class="mt-6 pb-6 rounded-b-[--card-border-radius]">
                      <p class="text-gray-700 dark:text-gray-300">Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.</p>
                    </div>
                    <div class="flex gap-3 -mb-8 py-4 border-t border-gray-200 dark:border-gray-800">
                      <a href="#" download="/" class="group rounded-xl disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-gray-950 disabled:border-gray-200 disabled:bg-gray-100 dark:disabled:border-gray-800/50 disabled:dark:bg-gray-900 dark:*:disabled:!text-white text-gray-950 bg-gray-100 hover:bg-gray-200/75 active:bg-gray-100 dark:text-white dark:bg-gray-500/10 dark:hover:bg-gray-500/15 dark:active:bg-gray-500/10 flex gap-1.5 items-center text-sm h-8 px-3.5 justify-center">
                        <span>Download</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17 13l-5 5m0 0l-5-5m5 5V6"></path></svg>
                      </a>
                      <a href="#" class="group flex items-center rounded-xl disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-gray-950 disabled:border-gray-200 disabled:bg-gray-100 dark:disabled:border-gray-800/50 disabled:dark:bg-gray-900 dark:*:disabled:!text-white text-gray-950 bg-gray-100 hover:bg-gray-200/75 active:bg-gray-100 dark:text-white dark:bg-gray-500/10 dark:hover:bg-gray-500/15 dark:active:bg-gray-500/10 size-8 justify-center">
                        <span class="sr-only">Source Code</span>
                        <svg class="size-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"></path></svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="relative group overflow-hidden p-8 rounded-xl bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
                  <div aria-hidden="true" class="inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b from-yellow-500 to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10"></div>
                  <div class="relative">
                    <div class="border border-yellow-500/10 flex relative *:relative *:size-6 *:m-auto size-12 rounded-lg dark:bg-gray-900 dark:border-white/15 before:rounded-[7px] before:absolute before:inset-0 before:border-t before:border-white before:from-yellow-100 dark:before:border-white/20 before:bg-gradient-to-b dark:before:from-white/10 dark:before:to-transparent before:shadow dark:before:shadow-gray-950">
                      <svg xmlns="http://www.w3.org/2000/svg" width="0.73em" height="1em" viewBox="0 0 256 351"><defs><filter id="logosFirebase0" width="200%" height="200%" x="-50%" y="-50%" filterUnits="objectBoundingBox"><feGaussianBlur in="SourceAlpha" result="shadowBlurInner1" stdDeviation="17.5"></feGaussianBlur><feOffset in="shadowBlurInner1" result="shadowOffsetInner1"></feOffset><feComposite in="shadowOffsetInner1" in2="SourceAlpha" k2="-1" k3="1" operator="arithmetic" result="shadowInnerInner1"></feComposite><feColorMatrix in="shadowInnerInner1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"></feColorMatrix></filter><filter id="logosFirebase1" width="200%" height="200%" x="-50%" y="-50%" filterUnits="objectBoundingBox"><feGaussianBlur in="SourceAlpha" result="shadowBlurInner1" stdDeviation="3.5"></feGaussianBlur><feOffset dx="1" dy="-9" in="shadowBlurInner1" result="shadowOffsetInner1"></feOffset><feComposite in="shadowOffsetInner1" in2="SourceAlpha" k2="-1" k3="1" operator="arithmetic" result="shadowInnerInner1"></feComposite><feColorMatrix in="shadowInnerInner1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"></feColorMatrix></filter><path id="logosFirebase2" d="m1.253 280.732l1.605-3.131l99.353-188.518l-44.15-83.475C54.392-1.283 45.074.474 43.87 8.188z"></path><path id="logosFirebase3" d="m134.417 148.974l32.039-32.812l-32.039-61.007c-3.042-5.791-10.433-6.398-13.443-.59l-17.705 34.109l-.53 1.744z"></path></defs><path fill="#ffc24a" d="m0 282.998l2.123-2.972L102.527 89.512l.212-2.017L58.48 4.358C54.77-2.606 44.33-.845 43.114 6.951z"></path><use fill="#ffa712" fill-rule="evenodd" href="#logosFirebase2"></use><use filter="url(#logosFirebase0)" href="#logosFirebase2"></use><path fill="#f4bd62" d="m135.005 150.38l32.955-33.75l-32.965-62.93c-3.129-5.957-11.866-5.975-14.962 0L102.42 87.287v2.86z"></path><use fill="#ffa50e" fill-rule="evenodd" href="#logosFirebase3"></use><use filter="url(#logosFirebase1)" href="#logosFirebase3"></use><path fill="#f6820c" d="m0 282.998l.962-.968l3.496-1.42l128.477-128l1.628-4.431l-32.05-61.074z"></path><path fill="#fde068" d="m139.121 347.551l116.275-64.847l-33.204-204.495c-1.039-6.398-8.888-8.927-13.468-4.34L0 282.998l115.608 64.548a24.126 24.126 0 0 0 23.513.005"></path><path fill="#fcca3f" d="M254.354 282.16L221.402 79.218c-1.03-6.35-7.558-8.977-12.103-4.424L1.29 282.6l114.339 63.908a23.943 23.943 0 0 0 23.334.006z"></path><path fill="#eeab37" d="M139.12 345.64a24.126 24.126 0 0 1-23.512-.005L.931 282.015l-.93.983l115.607 64.548a24.126 24.126 0 0 0 23.513.005l116.275-64.847l-.285-1.752z"></path></svg>
                    </div>

                    <div class="mt-6 pb-6 rounded-b-[--card-border-radius]">
                      <p class="text-gray-700 dark:text-gray-300">Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.</p>
                    </div>
                    <div class="flex gap-3 -mb-8 py-4 border-t border-gray-200 dark:border-gray-800">
                      <a href="#" download="/" class="group rounded-xl disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-gray-950 disabled:border-gray-200 disabled:bg-gray-100 dark:disabled:border-gray-800/50 disabled:dark:bg-gray-900 dark:*:disabled:!text-white text-gray-950 bg-gray-100 hover:bg-gray-200/75 active:bg-gray-100 dark:text-white dark:bg-gray-500/10 dark:hover:bg-gray-500/15 dark:active:bg-gray-500/10 flex gap-1.5 items-center text-sm h-8 px-3.5 justify-center">
                        <span>Download</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17 13l-5 5m0 0l-5-5m5 5V6"></path></svg>
                      </a>
                      <a href="#" class="group flex items-center rounded-xl disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-gray-950 disabled:border-gray-200 disabled:bg-gray-100 dark:disabled:border-gray-800/50 disabled:dark:bg-gray-900 dark:*:disabled:!text-white text-gray-950 bg-gray-100 hover:bg-gray-200/75 active:bg-gray-100 dark:text-white dark:bg-gray-500/10 dark:hover:bg-gray-500/15 dark:active:bg-gray-500/10 size-8 justify-center">
                        <span class="sr-only">Source Code</span>
                        <svg class="size-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"></path></svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="relative group overflow-hidden p-8 rounded-xl bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
                  <div aria-hidden="true" class="inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b from-sky-500 to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10"></div>
                  <div class="relative">
                    <div class="border border-sky-500/10 flex relative *:relative *:size-6 *:m-auto size-12 rounded-lg dark:bg-gray-900 dark:border-white/15 before:rounded-[7px] before:absolute before:inset-0 before:border-t before:border-white before:from-sky-100 dark:before:border-white/20 before:bg-gradient-to-b dark:before:from-white/10 dark:before:to-transparent before:shadow dark:before:shadow-gray-950">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 128 128"><path fill="#0080ff" d="M64.142 102.96H39.24V78.522h24.903ZM39.24 122.131H20.373v-19.173H39.24Zm-18.866-19.173H4.53V87.167h15.843Zm43.394 24.814v-24.814c26.41 0 46.784-25.94 36.597-53.388c-3.775-10.15-11.694-18.42-22.26-22.181c-27.167-9.772-53.2 10.527-53.2 36.468H0c0-41.354 40.37-74.064 84.52-60.53c19.242 6.017 34.334 21.055 40.37 40.23c13.581 43.985-19.245 84.214-61.123 84.214Zm0 0"></path></svg>
                    </div>

                    <div class="mt-6 pb-6 rounded-b-[--card-border-radius]">
                      <p class="text-gray-700 dark:text-gray-300">Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.</p>
                    </div>
                    <div class="flex gap-3 -mb-8 py-4 border-t border-gray-200 dark:border-gray-800">
                      <a href="#" download="/" class="group rounded-xl disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-gray-950 disabled:border-gray-200 disabled:bg-gray-100 dark:disabled:border-gray-800/50 disabled:dark:bg-gray-900 dark:*:disabled:!text-white text-gray-950 bg-gray-100 hover:bg-gray-200/75 active:bg-gray-100 dark:text-white dark:bg-gray-500/10 dark:hover:bg-gray-500/15 dark:active:bg-gray-500/10 flex gap-1.5 items-center text-sm h-8 px-3.5 justify-center">
                        <span>Download</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17 13l-5 5m0 0l-5-5m5 5V6"></path></svg>
                      </a>
                      <a href="#" class="group flex items-center rounded-xl disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-gray-950 disabled:border-gray-200 disabled:bg-gray-100 dark:disabled:border-gray-800/50 disabled:dark:bg-gray-900 dark:*:disabled:!text-white text-gray-950 bg-gray-100 hover:bg-gray-200/75 active:bg-gray-100 dark:text-white dark:bg-gray-500/10 dark:hover:bg-gray-500/15 dark:active:bg-gray-500/10 size-8 justify-center">
                        <span class="sr-only">Source Code</span>
                        <svg class="size-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"></path></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div> */}
      {/* <div id='timeline' className='section1'>
        <div className='input-fields'>
          <p className='f'>Timeline</p>
          <div className='label-border'></div>
          <div class="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-[8.75rem] md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">

            <div class="relative">
              <div class="md:flex items-center md:space-x-4 mb-3">
                <div class="flex items-center space-x-4 md:space-x-2 md:space-x-reverse">

                  <div class="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow md:order-1">
                    <svg class="fill-emerald-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                      <path d="M8 0a8 8 0 1 0 8 8 8.009 8.009 0 0 0-8-8Zm0 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
                    </svg>
                  </div>

                  <time class="font-caveat font-medium text-xl text-indigo-500 md:w-28">Apr 7, 2024</time>
                </div>

                <div class="text-slate-500 ml-14"><span class="text-slate-900 font-bold">Mark Mikrol</span> opened the request</div>
              </div>

              <div class="bg-white p-4 rounded border border-slate-200 text-slate-500 shadow ml-14 md:ml-44">Various versions have evolved over the years, sometimes by accident, sometimes on purpose injected humour and the like.</div>
            </div>

            <div class="relative">
              <div class="md:flex items-center md:space-x-4 mb-3">
                <div class="flex items-center space-x-4 md:space-x-2 md:space-x-reverse">

                  <div class="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow md:order-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                      <path class="fill-slate-300" d="M14.853 6.861C14.124 10.348 10.66 13 6.5 13c-.102 0-.201-.016-.302-.019C7.233 13.618 8.557 14 10 14c.51 0 1.003-.053 1.476-.143L14.2 15.9a.499.499 0 0 0 .8-.4v-3.515c.631-.712 1-1.566 1-2.485 0-.987-.429-1.897-1.147-2.639Z" />
                      <path class="fill-slate-500" d="M6.5 0C2.91 0 0 2.462 0 5.5c0 1.075.37 2.074 1 2.922V11.5a.5.5 0 0 0 .8.4l1.915-1.436c.845.34 1.787.536 2.785.536 3.59 0 6.5-2.462 6.5-5.5S10.09 0 6.5 0Z" />
                    </svg>
                  </div>

                  <time class="font-caveat font-medium text-xl text-indigo-500 md:w-28">Apr 7, 2024</time>
                </div>

                <div class="text-slate-500 ml-14"><span class="text-slate-900 font-bold">John Mirkovic</span> commented the request</div>
              </div>

              <div class="bg-white p-4 rounded border border-slate-200 text-slate-500 shadow ml-14 md:ml-44">If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.</div>
            </div>


            <div class="relative">
              <div class="md:flex items-center md:space-x-4 mb-3">
                <div class="flex items-center space-x-4 md:space-x-2 md:space-x-reverse">

                  <div class="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow md:order-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                      <path class="fill-slate-300" d="M14.853 6.861C14.124 10.348 10.66 13 6.5 13c-.102 0-.201-.016-.302-.019C7.233 13.618 8.557 14 10 14c.51 0 1.003-.053 1.476-.143L14.2 15.9a.499.499 0 0 0 .8-.4v-3.515c.631-.712 1-1.566 1-2.485 0-.987-.429-1.897-1.147-2.639Z" />
                      <path class="fill-slate-500" d="M6.5 0C2.91 0 0 2.462 0 5.5c0 1.075.37 2.074 1 2.922V11.5a.5.5 0 0 0 .8.4l1.915-1.436c.845.34 1.787.536 2.785.536 3.59 0 6.5-2.462 6.5-5.5S10.09 0 6.5 0Z" />
                    </svg>
                  </div>

                  <time class="font-caveat font-medium text-xl text-indigo-500 md:w-28">Apr 8, 2024</time>
                </div>

                <div class="text-slate-500 ml-14"><span class="text-slate-900 font-bold">Vlad Patterson</span> commented the request</div>
              </div>

              <div class="bg-white p-4 rounded border border-slate-200 text-slate-500 shadow ml-14 md:ml-44">Letraset sheets containing passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Ipsum.</div>
            </div>
            <div class="relative">
              <div class="md:flex items-center md:space-x-4 mb-3">
                <div class="flex items-center space-x-4 md:space-x-2 md:space-x-reverse">
                  <div class="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow md:order-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                      <path class="fill-slate-300" d="M14.853 6.861C14.124 10.348 10.66 13 6.5 13c-.102 0-.201-.016-.302-.019C7.233 13.618 8.557 14 10 14c.51 0 1.003-.053 1.476-.143L14.2 15.9a.499.499 0 0 0 .8-.4v-3.515c.631-.712 1-1.566 1-2.485 0-.987-.429-1.897-1.147-2.639Z" />
                      <path class="fill-slate-500" d="M6.5 0C2.91 0 0 2.462 0 5.5c0 1.075.37 2.074 1 2.922V11.5a.5.5 0 0 0 .8.4l1.915-1.436c.845.34 1.787.536 2.785.536 3.59 0 6.5-2.462 6.5-5.5S10.09 0 6.5 0Z" />
                    </svg>
                  </div>
                  <time class="font-caveat font-medium text-xl text-indigo-500 md:w-28">Apr 8, 2024</time>
                </div>
                <div class="text-slate-500 ml-14"><span class="text-slate-900 font-bold">Mila Capentino</span> commented the request</div>
              </div>
              <div class="bg-white p-4 rounded border border-slate-200 text-slate-500 shadow ml-14 md:ml-44">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</div>
            </div>
            <div class="relative">
              <div class="md:flex items-center md:space-x-4 mb-3">
                <div class="flex items-center space-x-4 md:space-x-2 md:space-x-reverse">
                  <div class="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow md:order-1">
                    <svg class="fill-red-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                      <path d="M8 0a8 8 0 1 0 8 8 8.009 8.009 0 0 0-8-8Zm0 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
                    </svg>
                  </div>
                  <time class="font-caveat font-medium text-xl text-indigo-500 md:w-28">Apr 9, 2024</time>
                </div>
                <div class="text-slate-500 ml-14"><span class="text-slate-900 font-bold">Mark Mikrol</span> closed the request</div>
              </div>
              <div class="bg-white p-4 rounded border border-slate-200 text-slate-500 shadow ml-14 md:ml-44">If you are going to use a passage of Lorem Ipsum!</div>
            </div>

          </div>
        </div>
      </div> */}
      {/* <div id='gallery' className='section1'>
        <div className='input-fields'>
          <p className='f'>Gallery</p>
          <div className='label-border'></div>
          <div className='flex gap-10'>
            <div className='profile-btn-container'>
              <img src='/images/img ph.png' width={20} height={20} />
              <button onClick={changeImage} className='ch-bg-btn'>Change Image</button>
            </div>
            <div className='profile-btn-container'>
              <img src='/images/img ph.png' width={20} height={20} />
              <button onClick={changeImage} className='ch-bg-btn'>Change Image</button>
            </div>
          </div>
          <div class="dark:bg-gray-800 lg:py-12">
            <div class="mx-auto">

              <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 xl:gap-8">

                <a href="#"
                  class="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80">
                  <img src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&q=75&fit=crop&w=600" loading="lazy" alt="Photo by Minh Pham" class="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

                  <div
                    class="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50">
                  </div>

                  <span class="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">VR</span>
                </a>



                <a href="#"
                  class="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:col-span-2 md:h-80">
                  <img src="https://images.unsplash.com/photo-1542759564-7ccbb6ac450a?auto=format&q=75&fit=crop&w=1000" loading="lazy" alt="Photo by Magicle" class="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

                  <div
                    class="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50">
                  </div>

                  <span class="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">Tech</span>
                </a>



                <a href="#"
                  class="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:col-span-2 md:h-80">
                  <img src="https://images.unsplash.com/photo-1610465299996-30f240ac2b1c?auto=format&q=75&fit=crop&w=1000" loading="lazy" alt="Photo by Martin Sanchez" class="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

                  <div
                    class="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50">
                  </div>

                  <span class="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">Dev</span>
                </a>



                <a href="#"
                  class="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80">
                  <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&q=75&fit=crop&w=600" loading="lazy" alt="Photo by Lorenzo Herrera" class="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

                  <div
                    class="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50">
                  </div>

                  <span class="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">Retro</span>
                </a>

              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div id='memorywall' className='section1'>
        <div className='input-fields'>
          <p className='f'>Memory wall</p>
          <div className='label-border'></div>
          <div className="bg-white dark:bg-gray-800 py-6">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
              <div className="mb-4 flex items-center justify-between gap-8 sm:mb-8 md:mb-12">
                <div className="flex items-center gap-12">
                  <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl dark:text-white">Wall</h2>

                  <p className="hidden max-w-screen-sm text-gray-500 dark:text-gray-300 md:block">
                    This is a section of some simple filler text,
                    also known as placeholder text. It shares some characteristics of a real written text.
                  </p>
                </div>

                <a
                  onClick={handleContributeClick}
                  className="cursor-pointer inline-block rounded-lg border bg-white dark:bg-gray-700 dark:border-none px-4 py-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-200 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:px-8 md:py-3 md:text-base">
                  Contribute
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 xl:gap-8">
                {walldata ? walldata?.imgs?.map((imgUrl, index) => (
                  <a
                    href="#"
                    key={index} // Unique key for each item in the list
                    className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80"
                  >
                    {/* Image */}
                    <img
                      src={imgUrl} // Set the src attribute to the current image URL
                      loading="lazy"
                      alt="Photo"
                      className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                    />

                    {/* Gradient overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>

                    {/* Details */}
                    <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">
                      {walldata?.details[index]} {/* Display the details */}
                    </span>
                  </a>
                )) : (<a href="#"
                  class="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80">
                  <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&q=75&fit=crop&w=600" loading="lazy" alt="Photo by Lorenzo Herrera" class="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

                  <div
                    class="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50">
                  </div>

                  <span class="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">Retro</span>
                </a>)}


              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div id='service' className='section1'>
        <div className='input-fields'>
          <p className='f'>Service</p>
          <div className='label-border'></div>
          <div class="gap-5">
            <div class="w-full lg:max-w-full lg:flex">
              <div class="h-48 lg:h-auto lg:w-96 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden" style={{
                backgroundImage: "url('https://www.online-tribute.com/memorial/static/white-lily.jpg')",
                backgroundSize: 'cover', // Ensure the background image covers the entire element
                backgroundPosition: 'center', // Center the background image
              }} title="Mountain">
              </div>
              <div class="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                <div class="mb-8">
                  <p class="text-sm text-gray-600 flex items-center">
                    <svg class="fill-current text-gray-500 w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
                    </svg>
                    Members only
                  </p>
                  <div class="text-gray-900 font-bold text-xl mb-2">Best Mountain Trails 2020</div>
                  <p class="text-gray-700 text-base">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, Nonea! Maiores et perferendis eaque, exercitationem praesentium nihil.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, Nonea! Maiores et perferendis eaque, exercitationem praesentium nihil.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, Nonea! Maiores et perferendis eaque, exercitationem praesentium nihil.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, Nonea! Maiores et perferendis eaque, exercitationem praesentium nihil.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, Nonea! Maiores et perferendis eaque, exercitationem praesentium nihil.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, Nonea! Maiores et perferendis eaque, exercitationem praesentium nihil.
                  </p>
                </div>
                <div class="flex items-center gap-10">
                  <div class="text-sm flex items-center">
                    <img class="w-10 h-10 rounded-full mr-4" src="/ben.png" alt="Avatar of Writer" />
                    <p class="text-gray-900 leading-none">John Smith</p>
                  </div>
                  {/* <div class="text-sm flex items-center">
                    <img class="w-10 h-10 rounded-full mr-4" src="/ben.png" alt="Avatar of Writer" />
                    <p class="text-gray-900 leading-none">John Smith</p>
                  </div>
                  <div class="text-sm flex items-center">
                    <img class="w-10 h-10 rounded-full mr-4" src="/ben.png" alt="Avatar of Writer" />
                    <p class="text-gray-900 leading-none">John Smith</p>
                  </div> */}
      {/* </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className='footer'>
        <Footer />
      </div>
      <ProfileModal modalVisible={isModalVisible} setModalVisible={setIsModalVisible} proData={profileData} />
      <ObituaryModal modalVisible={isOModalVisible} setModalVisible={setIsOModalVisible} obituaryData={obituaryData} />
      <MemoryWallModal modalVisible={isWModalVisible} setModalVisible={setIsWModalVisible} />
      <Share modalVisible={isSModalVisible} setModalVisible={setIsSModalVisible} />
    </div>
  );
};

export default Home;
