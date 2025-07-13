import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { deleteInterest, deleteSkill, deleteSkillFailure, deleteSkillStart, getInterests, getSkills, getSkillsFailure } from '../redux/slices/skillsSlice';
import { 
    Container,
    Typography,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Button,
    Paper,
    Divider
} from '@mui/material';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { fetchWithAuth } from '../utils/refreshToken';

const MySkillsAndInterests = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { loading, skills, interests, error } = useSelector(state => state.skills);
    const navigate = useNavigate();
    const [firstLoad, setFirstLoad] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res1 = await fetchWithAuth(`${import.meta.env.VITE_API_URI}/api/v1/skills/wanted-skills`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                }, dispatch);

                const result1 = await res1.json();

                if (result1.statusCode !== 200) {
                    dispatch(getSkillsFailure(result1.message));
                    return;
                }

                dispatch(getInterests(result1.data));

            } catch (error) {
                dispatch(getSkillsFailure(error.message));
            }
        })();
    }, [dispatch]);

    useEffect(() => {
        (async () => {
            try {
                const res2 = await fetchWithAuth(`${import.meta.env.VITE_API_URI}/api/v1/skills/skills-collection`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                },dispatch);

                const result2 = await res2.json();

                if (result2.statusCode !== 200) {
                    dispatch(getSkillsFailure(result2.message));
                    return;
                }

                dispatch(getSkills(result2.data));

            } catch (error) {
                dispatch(getSkillsFailure(error.message));
            }
        })();
    }, [dispatch]);

    const handleAddSkill = () => {
        navigate('/add-skills');
    };

    const handleUpdateSkill = (skillId) => {
        navigate('/add-skills', { state: { id: skillId } });
    };

    const handleAddInterest = () => {
        navigate('/add-interests');
    };

    const handleUpdateInterest = (interestId) => {
        navigate('/add-interests', { state: { id: interestId } });
    };

    const handleSkillClick = (item) => {
        navigate('/skill-description', { state: { skill: item } });
        console.log(item);
    };

    const handleDeleteInterest = async (skillId) => {
        try {
            dispatch(deleteSkillStart());
            const res = await fetchWithAuth(`${import.meta.env.VITE_API_URI}/api/v1/skills/delete-wanted-skill/${skillId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            },dispatch);
            const result = await res.json();

            if (result.statusCode !== 201) {
                dispatch(deleteSkillFailure(result.message));
                return;
            }

            dispatch(deleteInterest(result.data));

        } catch (error) {
            dispatch(deleteSkillFailure(error.message));
        }
    };

    const handleDeleteSkill = async (skillId) => {
        try {
            dispatch(deleteSkillStart());
            const res = await fetchWithAuth(`${import.meta.env.VITE_API_URI}/api/v1/skills/delete-skill/${skillId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            },dispatch);
            const result = await res.json();

            if (result.statusCode !== 201) {
                dispatch(deleteSkillFailure(result.message));
                return;
            }

            dispatch(deleteSkill(result.data));

        } catch (error) {
            dispatch(deleteSkillFailure(error.message));
        }
    };

    return (
        <Container maxWidth="md" className="py-20">
            
            <Typography variant="h2" component="h2" gutterBottom align="center">
                Skills
            </Typography>
            {loading && <CircularProgress />}
            <Paper elevation={3} className="p-4 mb-8">
                <Typography variant="h4" component="h3" gutterBottom>
                    My Skills
                </Typography>
                {skills.length === 0 && !loading && <Typography>No skills found.</Typography>}
                <List>
                    {skills.map(skill => (
                        <React.Fragment key={skill._id}>
                            <ListItem>
                                <ListItemText
                                    primary={skill.name}
                                    onClick={() => handleSkillClick(skill)}
                                    className="cursor-pointer"
                                />
                                <IconButton onClick={() => handleUpdateSkill(skill._id)}>
                                    <FaEdit />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteSkill(skill._id)}>
                                    <FaTrash />
                                </IconButton>
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddSkill}
                    className="mt-4"
                >
                    Add More Skills
                </Button>
            </Paper>
            <Paper elevation={3} className="p-4 mb-8">
                <Typography variant="h4" component="h3" gutterBottom>
                    My Interests
                </Typography>
                {interests.length === 0 && !loading && <Typography>No interests found.</Typography>}
                <List>
                    {interests.map(interest => (
                        <React.Fragment key={interest._id}>
                            <ListItem>
                                <ListItemText
                                    primary={interest.name}
                                    onClick={() => handleSkillClick(interest)}
                                    className="cursor-pointer"
                                />
                                <IconButton onClick={() => handleUpdateInterest(interest._id)}>
                                    <FaEdit />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteInterest(interest._id)}>
                                    <FaTrash />
                                </IconButton>
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddInterest}
                    className="mt-4"
                >
                    Add More Interests
                </Button>
            </Paper>
        </Container>
    );
};

export default MySkillsAndInterests;
