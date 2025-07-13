import React from 'react';
import { useLocation } from 'react-router-dom';

const SkillDetailPage = () => {

    const location = useLocation();
    const { skill } = location.state || {};

    console.log(skill.skillLevel)

    return (
        <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-6">{skill.name.toUpperCase()}</h2>
            <div>
                <p className="text-gray-700 font-semibold mb-2">Description:</p>
                <p className="text-gray-600 mb-6">{skill.description}</p>
            </div>
            <div>
                <p className="text-gray-700 font-semibold mb-2">Category:</p>
                <p className="text-gray-600 mb-6">{skill.category}</p>
            </div>
            <div>
                <p className="text-gray-700 font-semibold mb-2">Skill Level:</p>
                <p className="text-gray-600 mb-6">{skill.skill_level}</p>
            </div>
            {/* Add more details as needed */}
        </div>
    );
};

export default SkillDetailPage;
