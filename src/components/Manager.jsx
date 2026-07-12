import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const [form, setForm] = useState({ site: "", username: "", password: "" })   // current pw being filled
    const [passwordArray, setPasswordArray] = useState([])                      // for all saved passwords
    const passwordRef = useRef()

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        setPasswordArray(passwords)
    }

    useEffect(() => {                                                           // Runs only once when page loads
        getPasswords()
    }, [])

    const showPassword = () => {
        passwordRef.current.type = passwordRef.current.type === "password"
            ? "text"
            : "password"
    }

    const savePassword = async () => {
        if (form.site.length > 3 && form.password.length > 3 && form.username.length > 3) {
            // is any such id already exists in the db, delete it
            if (form.id) {
                await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) })
            }

            const newEntry = { ...form, id: uuidv4() }
            setPasswordArray([...passwordArray, newEntry])
            await fetch("http://localhost:3000/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newEntry) })

            setForm({ site: "", username: "", password: "" })                        // clear the form input fields once saved
            toast('Password saved!', {
                position: "top-right", autoClose: 5000, hideProgressBar: false,
                closeOnClick: false, pauseOnHover: true, draggable: true,
                theme: "dark", transition: Bounce,
            });
        } else {
            toast('Error: all fields must be longer than 3 characters.')
        }
    }

    const deletePassword = async (id) => {
        let c = confirm("Are you sure you want to delete?")
        if (c) {
            setPasswordArray(passwordArray.filter(item => item.id != id))
            await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
            toast('Password deleted.', {
                position: "top-right", autoClose: 5000, hideProgressBar: false,
                closeOnClick: false, pauseOnHover: true, draggable: true,
                theme: "dark", transition: Bounce,
            });
        }
    }

    const editPassword = (id) => {
        setForm({ ...passwordArray.filter(item => item.id === id)[0], id: id })
        setPasswordArray(passwordArray.filter(item => item.id !== id))         // delete
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const copyText = (text) => {
        navigator.clipboard.writeText(text)
        toast('Copied to clipboard!', {
            position: "top-right", autoClose: 2000, hideProgressBar: true,
            closeOnClick: true, pauseOnHover: false, draggable: true,
            theme: "light", transition: Bounce,
        });
    }

    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false}
                newestOnTop={false} closeOnClick={false} rtl={false}
                pauseOnFocusLoss draggable pauseOnHover theme="light" transition={Bounce}
            />

            {/* background */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
            </div>

            <div className="p-4 md:p-0 md:mycontainer min-h-screen">

                {/* header */}
                <div className="text-center py-6">
                    <h1 className='text-3xl text-green-900 font-bold flex items-center justify-center gap-2'>
                        Pass Manager
                    </h1>
                    <p className='text-green-700 text-sm mt-1'>Your own password manager</p>
                </div>

                {/* form card */}
                <div className='bg-white border border-green-200 rounded-2xl shadow-sm p-4 md:p-6 mb-6 flex flex-col gap-3'>
                    <input value={form.site} name='site' onChange={handleChange}
                        placeholder='Website URL (e.g. github.com)'
                        className='rounded-lg bg-green-50 border border-green-200 w-full px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-400'
                        type="text" id='site' />

                    <div className="flex md:flex-row flex-col w-full gap-3">
                        <input value={form.username} name='username' onChange={handleChange}
                            placeholder='Username or email'
                            className='rounded-lg bg-green-50 border border-green-200 w-full px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-400'
                            type="text" id='username' />

                        <div className="relative w-full">
                            <input ref={passwordRef} value={form.password} name='password' onChange={handleChange}
                                placeholder='Password'
                                className='rounded-lg bg-green-50 border border-green-200 w-full px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-400'
                                type="password" id='password' />
                            <span onClick={showPassword}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-700 cursor-pointer font-medium hover:text-green-900'>
                                show
                            </span>
                        </div>
                    </div>

                    <button onClick={savePassword}
                        className='flex items-center gap-2 bg-green-700 text-white text-sm px-6 py-2 rounded-lg w-full md:w-fit mx-auto hover:bg-green-800 transition-colors justify-center'>
                        Save password
                    </button>
                </div>

                {/* passwords section */}
                <div>
                    <h2 className='font-semibold text-green-900 text-lg mb-3'>Your passwords</h2>

                    {passwordArray.length === 0 &&
                        <div className="text-center text-green-700 text-sm py-10 bg-white border border-green-100 rounded-2xl">
                            No passwords saved yet.
                        </div>
                    }

                    {passwordArray.length !== 0 && <>

                        {/* desktop table — hidden on mobile */}
                        <div className="hidden md:block bg-white border border-green-200 rounded-2xl overflow-hidden mb-10">
                            <table className='table-auto w-full text-sm'>
                                <thead className='bg-green-800 text-white'>
                                    <tr>
                                        <th className='text-left px-4 py-3 font-medium'>Site</th>
                                        <th className='text-left px-4 py-3 font-medium'>Username</th>
                                        <th className='text-left px-4 py-3 font-medium'>Password</th>
                                        <th className='text-right px-4 py-3 font-medium'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-green-100'>
                                    {passwordArray.map((item, index) => {
                                        return <tr key={index} className="hover:bg-green-50 transition-colors">
                                            <td className='px-4 py-3'>
                                                <a href={item.site} target='_blank' className="text-green-700 hover:underline font-medium">{item.site}</a>
                                                <button onClick={() => copyText(item.site)} title="Copy site"
                                                    className='ml-2 text-green-400 hover:text-green-700 transition-colors'>
                                                    📋
                                                </button>
                                            </td>
                                            <td className='px-4 py-3 text-gray-700'>{item.username}</td>
                                            <td className='px-4 py-3'>
                                                <span className="font-mono text-gray-400 tracking-widest">{"•".repeat(item.password.length)}</span>
                                                <button onClick={() => copyText(item.password)} title="Copy password"
                                                    className='ml-2 text-green-400 hover:text-green-700 transition-colors'>
                                                    📋
                                                </button>
                                            </td>
                                            <td className='px-4 py-3 text-right space-x-1'>
                                                <button onClick={() => editPassword(item.id)}
                                                    className='text-xs text-green-700 hover:bg-green-100 px-2 py-1 rounded-md transition-colors'>
                                                    Edit
                                                </button>
                                                <button onClick={() => deletePassword(item.id)}
                                                    className='text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded-md transition-colors'>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* mobile cards — hidden on desktop */}
                        <div className="md:hidden flex flex-col gap-3 mb-10">
                            {passwordArray.map((item, index) => (
                                <div key={index} className="bg-white border border-green-200 rounded-xl p-4">

                                    {/* site row */}
                                    <div className="flex justify-between items-start mb-3">
                                        <a href={item.site} target="_blank" className="text-green-700 font-medium text-sm">{item.site}</a>
                                        <div className="flex gap-1">
                                            <button onClick={() => editPassword(item.id)}
                                                className='text-xs text-green-700 hover:bg-green-100 px-2 py-1 rounded-md transition-colors'>
                                                Edit
                                            </button>
                                            <button onClick={() => deletePassword(item.id)}
                                                className='text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded-md transition-colors'>
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    {/* username row */}
                                    <div className="flex justify-between items-center py-2 border-t border-green-50">
                                        <span className="text-xs text-gray-400">Username</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-700">{item.username}</span>
                                            <button onClick={() => copyText(item.username)}
                                                className="text-green-400 hover:text-green-700 text-xs"><svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
                                        </div>
                                    </div>

                                    {/* password row */}
                                    <div className="flex justify-between items-center py-2 border-t border-green-50">
                                        <span className="text-xs text-gray-400">Password</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-gray-400 tracking-widest text-sm">{"•".repeat(item.password.length)}</span>
                                            <button onClick={() => copyText(item.password)}
                                                className="text-green-400 hover:text-green-700 text-xs"><svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>

                    </>}
                </div>

            </div>
        </>
    )
}

export default Manager