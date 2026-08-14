import React from 'react';
import axios from 'axios';

export const JobDataContext = React.createContext();

const JobContext = ({ children }) => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || "https://applyflowbackend.onrender.com";
    const [jobs, setJobs] = React.useState([]);
    const [hasFetchedAll, setHasFetchedAll] = React.useState(false);
    const [hasFetchedMy, setHasFetchedMy] = React.useState(false);
    const [loading, setLoading] = React.useState(false);


    const fetchAllJobs = async (force = false) => {
        if (hasFetchedAll && !force) return;
        setLoading(true);
        try {
            const result = await axios.get(serverUrl + '/api/job/alljobs', { withCredentials: true });
            setJobs(result.data.jobs ?? []);
            setHasFetchedAll(true);

        } catch (e) {
            console.error("Error fetching jobs:", e);
        } finally {
            setLoading(false);
        }
    }
    const fetchMyJobs = async (force = false) => {
        if (hasFetchedMy && !force) return;
        setLoading(true);
        try {
            const result = await axios.get(serverUrl + '/api/job/getmyjobs', { withCredentials: true });
            setJobs(result.data.jobs ?? []);
            setHasFetchedMy(true);

        } catch (e) {
            console.error("Error fetching jobs:", e);
        } finally {
            setLoading(false);
        }
    }



    return (
        <JobDataContext.Provider value={{ 
            serverUrl, 
            jobs, 
            setJobs, 
            hasFetchedAll, 
            setHasFetchedAll, 
            hasFetchedMy, 
            setHasFetchedMy, 
            loading, 
            setLoading,
            fetchAllJobs,
            fetchMyJobs
        }}>
            {children}
        </JobDataContext.Provider>
    )
}

export default JobContext;
