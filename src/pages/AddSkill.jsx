import React, { useState } from 'react';
import { addSkillFailure, addSkillStart, addSkills, updateSkill, updateSkillFailure, updateSkillStart } from '../redux/slices/skillsSlice';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchWithAuth } from '../utils/refreshToken';

const AddSkill = () => {

    const location = useLocation()

    const id = location.state?.id
    console.log(id)

    const {skills, interests, error, loading} = useSelector(state => state.skills)

    const skill = skills.filter((skill) => skill._id === id)

    console.log(skill[0])


    const [formData, setFormData] = useState({
        name: id? skill[0]?.name: '' ,
        description: id? skill[0]?.description: '',
        category: id? skill[0]?.category: '',
        skillLevel: id? skill[0]?.skill_level: ''
    });

    const dispatch = useDispatch()
    const navigate = useNavigate()
   

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        // Add logic to handle form submission, such as making an API call
        try {
            dispatch(addSkillStart())
            const res = await fetchWithAuth(`${import.meta.env.VITE_API_URI}/api/v1/skills/add-skill`, {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            }, dispatch)

            const result = await res.json();
            console.log(result);

            if(result.statusCode !== 200){
                dispatch(addSkillFailure(result.message))
                return
            }

            // dispatch(addSkills(result.data))

            // console.log(result.message)

            navigate('/skills-interests', { state: { messageForSkillSuccess: result.message } });

        } catch (error) {
            dispatch(addSkillFailure(error.message))
        }
    };

    const handleUpdateSubmit = async(e) => {
        e.preventDefault()
        console.log(formData)
        try {
            dispatch(updateSkillStart())
            const res = await fetch(`${import.meta.env.VITE_API_URI}/api/v1/skills/update-skill/${id}`, {
                method: 'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            })

            const result = await res.json()

            console.log(result)

            if(!result.statusCode !== 201){
                dispatch(updateSkillFailure(result.message))
            }

            dispatch(updateSkill(result.data));
        } catch (error) {
            dispatch(updateSkillFailure(error.message))
        }
    }


    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
  <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md w-full max-w-md">
    <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">
      {id ? 'Update Details' : 'Add Skill'}
    </h2>
    <form onSubmit={id ? handleUpdateSubmit : handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 font-semibold mb-2"
        >
          Skill Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 font-semibold mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          required
        ></textarea>
      </div>

      <div className="mb-4">
        <label
          htmlFor="category"
          className="block text-gray-700 font-semibold mb-2"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <label
          htmlFor="skillLevel"
          className="block text-gray-700 font-semibold mb-2"
        >
          Skill Level
        </label>
        <select
          id="skillLevel"
          name="skillLevel"
          value={formData.skillLevel}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        {id ? (
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Skill
          </button>
        ) : (
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Skill
          </button>
        )}
      </div>
    </form>
  </div>
</div>

    );
};

export default AddSkill;
