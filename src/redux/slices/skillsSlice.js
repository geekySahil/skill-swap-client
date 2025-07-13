import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// Skill slice
const skillsSlice = createSlice({
    name: 'skills',
    initialState: {
        skills: [],
        interests: [],
        loading: false,
        error: null,
    },
    reducers: {


        reinitializeSkillsAndInterests: (state) => {
            state.skills = [],
            state.interests = [],
            state.loading = false,
            state.error = null
        },
        getSkillsStart: (state) => {
            state.loading = true
        },
        getSkills: (state, action) =>{
            state.loading= false
            state.skills = action.payload
            state.error = null
        },
        getInterests: (state, action) =>{
            state.loading= false
            state.interests = action.payload
            state.error = null
        },
        getSkillsFailure:(state, action) =>{
            state.loading = false,
            state.error = action.payload
        },
        addSkillStart: (state) => {
            state.loading = true
        },
        addSkills:(state, action) => {
            state.skills = action.payload,
            state.loading = false,
            state.error = null
        },
        addInterest:(state, action) => {
            state.interests = action.payload,
            state.loading = false,
            state.error = null
        },
        addSkillFailure:(state, action) =>{
            state.loading = false,
            state.error = action.payload
        },
        updateSkillStart: (state) => {
            state.loading = true
        },
        updateSkill:(state, action) => {
            state.skills = action.payload,
            state.loading = false,
            state.error = false
        },
        updateInterest:(state, action) => {
            state.interests = action.payload,
            state.loading = false,
            state.error = false
        },
        updateSkillFailure:(state, action) =>{
            state.loading = false,
            state.error = action.payload
        },
        deleteSkillStart: (state) => {
            state.loading = true
        },
        deleteSkill:(state, action) => {
            state.skills = action.payload,
            state.loading = false,
            state.error = false
        },
        deleteInterest:(state, action) => {
            state.interests = action.payload,
            state.loading = false,
            state.error = false
        },
        deleteSkillFailure:(state, action) =>{
            state.loading = false,
            state.error = action.payload
        },
    },
    
});

export const {reinitializeSkillsAndInterests, addSkillStart, addSkills, addInterest, addSkillFailure, updateSkillStart, updateSkill, updateInterest, updateSkillFailure, deleteSkillStart, deleteSkill, deleteInterest, deleteSkillFailure,getSkillsStart, getSkills, getInterests, getSkillsFailure} = skillsSlice.actions

export default skillsSlice.reducer;
