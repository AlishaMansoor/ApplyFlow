import { useEffect, useState, useContext, createContext } from 'react'
import { AuthDataContext } from './AuthContext';
import axios from 'axios';

export const UserDataContext = createContext();//the context object which will be used by other components to access user data and setUserData function

const UserContext = ({ children }) => {//the actual component of this file which will wrap the entire app and provide user data to all components through context
    let { serverUrl } = useContext(AuthDataContext);
    let [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const getcurrUser = async () => {
        try {
            // console.log("Fetching current user data from backend...");
            const result = await axios.get(serverUrl + "/api/user/currentuser", { withCredentials: true });

            // console.log("Current user data fetched from backend:", result.data.user);
            setUserData(result.data.user);
            // console.log("Current user data fetched successfully:", result.data.user);
        } catch (e) {
            setUserData(null);
            console.log("Error fetching current user data:", e);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getcurrUser();
    }, []);
    return (
        <div>
            <UserDataContext.Provider value={{ userData, setUserData, loading }}>
                {children}
            </UserDataContext.Provider>
        </div>
    )
}

export default UserContext
