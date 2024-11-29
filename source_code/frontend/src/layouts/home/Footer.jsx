import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-300 py-6">
            <div className="container mx-auto px-6 text-center">
                <p>&copy; {new Date().getFullYear()} FileSpace. All rights reserved.</p>
                <p className="mt-2">
                    <span>
                        Built with ❤️ by
                    </span>
                    {" "}
                    <a
                        href="https://github.com/musabsamani"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                    >
                        @musabsamani
                    </a>
                </p>
            </div>
        </footer>
    );
}

export default Footer;
