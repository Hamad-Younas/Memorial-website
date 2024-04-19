import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { useHistory } from 'react-router-dom'

const Confirm = () => {
    // State for form inputs
    const [code, setCode] = useState('');
    const history = useHistory();

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        const user = JSON.parse(localStorage.getItem('user'));
        alert(user._id)

        // Check if user ID is available
        if (!user) {
            alert('User not found.');
            return;
        }

        // Define the backend endpoint URL
        const url = `http://localhost:8800/auth/verify?Id=${user._id}&code=${code}`; // Update with your backend endpoint

        try {
            // Send a POST request to the backend using Axios
            const response = await axios.post(url,null);

            // Check the response status
            if (response.status === 200) {
                // Handle success (e.g., display a success message)
                alert("Verified successfully");
                history.push('/confirm-pass');
            } else {
                // Handle errors
                alert("Invalid code")
            }
        } catch (error) {
            // Handle exceptions
            console.log('Error:', error);
        }
    };

    return (
        <div
            id="login-popup"
            tabIndex="-1"
            className="bg-black/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 h-full items-center justify-center flex"
        >
            <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="p-5">
                        <h3 className="text-2xl mb-0.5 font-medium"></h3>
                        <p className="mb-4 text-sm font-normal text-gray-800"></p>

                        <div className="text-center">
                            <p className="mb-3 text-2xl font-semibold leading-5 text-slate-900">
                                Reset Password
                            </p>
                            <p className="mt-2 text-sm leading-4 text-slate-600">
                                You must be logged in to perform this action.
                            </p>
                        </div>

                        {/* <div className="mt-7 flex flex-col gap-2">
                            <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60">
                                <img
                                    src="https://www.svgrepo.com/show/512317/github-142.svg"
                                    alt="GitHub"
                                    width={20}
                                    height={10}
                                />
                                Continue with GitHub
                            </button>
                            <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60">
                                <img
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    alt="Google" width={20}
                                    height={10}
                                />
                                Continue with Google
                            </button>
                        </div> */}

                        <div className="flex w-full items-center gap-2 py-6 text-sm text-slate-600">
                            <div className="h-px w-full bg-slate-200"></div>
                            OR
                            <div className="h-px w-full bg-slate-200"></div>
                        </div>

                        <form className="w-full" onSubmit={handleSubmit}>
                            <label htmlFor="code" className="sr-only">
                                6 digit code
                            </label>
                            <input
                                name="code"
                                type="code"
                                autoComplete="code"
                                required
                                className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
                                placeholder="6 digit code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="inline-flex mt-2 w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400"
                            >
                                Continue
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Confirm;