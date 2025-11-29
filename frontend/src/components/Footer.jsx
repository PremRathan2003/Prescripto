import React from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

                {/* --------- Left Section --------- */}
                <div>
                    <img className='mb-5 w-40' src={assets.logo} alt="" />
                    <p className='w-full md:w-2/3 text-gray-600 leading-6'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                    </p>
                </div>

                {/* --------- Center Section --------- */}
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>

                        <NavLink to='/'>
                            <li className='hover:text-black cursor-pointer'>Home</li>
                        </NavLink>

                        <NavLink to='/about'>
                            <li className='hover:text-black cursor-pointer'>About us</li>
                        </NavLink>

                        <NavLink to='/contact'>
                            <li className='hover:text-black cursor-pointer'>Contact us</li>
                        </NavLink>

                        <NavLink to='/privacy-policy'>
                            <li className='hover:text-black cursor-pointer'>Privacy policy</li>
                        </NavLink>

                    </ul>
                </div>

                {/* --------- Right Section --------- */}
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li className='hover:text-black cursor-pointer'>
                            <a href='tel:+35312345678'>+353 123-456-78</a>
                        </li>
                        <li className='hover:text-black cursor-pointer'>
                            <a href='mailto:premrathanaddanki7736@gmail.com'>
                                premrathanaddanki7736@gmail.com
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/*------- CopyRight ----- */}
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>
                    Copyright 2025 @ PremRathan - All Right Reserved.
                </p>
            </div>
        </div>
    )
}

export default Footer
