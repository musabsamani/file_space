import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../assets/icon.svg';

const Header = () => {
    return (
        <header className="bg-blue-600 text-white p-3">
            <div className="container h-8 mx-auto flex justify-between items-center">
                <Link to="/" className='text-white flex gap-2'>
                    <img src={Icon} alt="Icon" width={24} height={24} />
                    <h1 className="text-lg font-bold mb-0">
                        FileSpace
                    </h1>
                </Link>
                <nav>
                    <ul className="flex gap-4 mb-0">
                        <li>
                            <Link to="/login" className="text-white hover:underline">
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link to="/register" className="text-white hover:underline">
                                Register
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
