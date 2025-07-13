import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSkillFailure, addInterest, addSkillStart, updateSkillStart, updateSkillFailure, updateInterest } from '../redux/slices/skillsSlice';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { fetchWithAuth } from '../utils/refreshToken';

const AddInterest = () => {
    const location = useLocation();
    const id = location.state?.id;

    const { skills, interests, error, loading } = useSelector(state => state.skills);
    const interest = interests.find(interest => interest._id === id);

    const [formData, setFormData] = useState({
        name: id ? interest?.name : '',
        description: id ? interest?.description : '',
        category: id ? interest?.category : '',
        skillLevel: id ? interest?.skill_level : ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            dispatch(addSkillStart());
            const res = await fetchWithAuth('http://localhost:4000/api/v1/skills/add-wantedSkill', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            }, dispatch);

            const result = await res.json();
            if (result.statusCode !== 200) {
                dispatch(addSkillFailure(result.message));
                return;
            }

            dispatch(addInterest(result.data));
            navigate('/skills-interests');

        } catch (error) {
            dispatch(addSkillFailure(error.message));
        }
    };

    const handleUpdateSubmit = async e => {
        e.preventDefault();
        try {
            dispatch(updateSkillStart());
            const res = await fetch(`http://localhost:4000/api/v1/skills/update-wanted-skill/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const result = await res.json();
            if (result.statusCode !== 201) {
                dispatch(updateSkillFailure(result.message));
                return;
            }

            dispatch(updateInterest(result.data));
        } catch (error) {
            dispatch(updateSkillFailure(error.message));
        }
    };

    return (
        <div className="bg-gray-900 py-20 min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {id ? 'Update Your Interest' : 'Add Your Interest'}
                </h2>
                <form onSubmit={id ? handleUpdateSubmit : handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                            Skill Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="" disabled>
                                Select a category
                            </option>
                            <option value="programming">Programming</option>
                            <option value="design">Design</option>
                            <option value="mathematics">Mathematics</option>
                            <option value="cooking">Cooking</option>
                            <option value="writing">Writing</option>
                            <option value="marketing">Marketing</option>
                            <option value="finance">Finance</option>
                            <option value="communication">Communication</option>
                            <option value="art and craft">Art and Craft</option>
                            <option value="psychology">Psychology</option>
                            <option value="reading">Reading</option>
                            <option value="others">Others</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="skillLevel" className="block text-gray-700 font-semibold mb-2">
                            Skill Level
                        </label>
                        <select
                            id="skillLevel"
                            name="skillLevel"
                            value={formData.skillLevel}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="" disabled>
                                Select a skill level
                            </option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            className={`${
                                id ? 'bg-green-500 hover:bg-green-700' : 'bg-blue-500 hover:bg-blue-700'
                            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                        >
                            {id ? 'Update Interest' : 'Add Interest'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddInterest;
