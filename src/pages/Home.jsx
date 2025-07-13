import React from 'react';
import { useSelector } from 'react-redux';

const Home = () => {
    const {loading, error, currentUser} = useSelector(state => state.user)
    return (
        <div className="bg-gray-100 ">
            
            {/* Hero Section */}
            <section className="py-20  bg-cyan-600 text-white">
                <div className="container pt-10 mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-4">Exchange Skills, Grow Together</h1>
                    <p className="text-lg mb-8">Connect with others to learn new skills and share your expertise.</p>
                    <a href={currentUser? 'dashboard' : '/sign-in'} className="bg-white text-gray-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition duration-300">Get Started</a>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-8">Why Skill Swap?</h2>
                    <div className="flex justify-center">
                        <div className="w-1/3 px-4">
                            <h3 className="text-xl font-bold mb-4">Community-driven Learning</h3>
                            <p className="text-gray-700">Join a vibrant community of learners and experts who are passionate about sharing knowledge.</p>
                        </div>
                        <div className="w-1/3 px-4">
                            <h3 className="text-xl font-bold mb-4">Skill Exchange</h3>
                            <p className="text-gray-700">Trade skills with others in a supportive environment, without any monetary transactions.</p>
                        </div>
                        <div className="w-1/3 px-4">
                            <h3 className="text-xl font-bold mb-4">Personal Growth</h3>
                            <p className="text-gray-700">Enhance your skills, broaden your horizons, and become a part of a diverse learning community.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-cyan-500 text-white py-8 text-center">
                <p>&copy; 2024 Skill Swap. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
