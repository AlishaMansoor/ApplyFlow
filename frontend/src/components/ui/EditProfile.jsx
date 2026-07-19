import React from 'react'
import { RxCross2 } from "react-icons/rx";
import { FaCirclePlus } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";

import { AuthDataContext } from '../../context/AuthContext.jsx'
import { UserDataContext } from '../../context/UserContext.jsx';//for accessing userData and setUserData
import axios from 'axios';




function EditProfile({ setEditProfileOpen }) {

    const { userData, setUserData } = React.useContext(UserDataContext);
    const { serverUrl } = React.useContext(AuthDataContext);
    const isRecruiter = userData ? userData.userType === 'recruiter' : false;
    //common feilds
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [userName, setUserName] = React.useState("");
    const [location, setLocation] = React.useState("");
    //Candidate feilds
    const [headline, setHeadline] = React.useState("");
    const [frontendSkills, setFrontendSkills] = React.useState([]);
    const [frontendEducation, setFrontendEducation] = React.useState([]);
    const [frontendExperience, setFrontendExperience] = React.useState([]);
    const [backendSkill, setBackendSkill] = React.useState("");
    const [backendEducation, setBackendEducation] = React.useState({ college: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "" });
    const [backendExperience, setBackendExperience] = React.useState({ title: "", description: "", company: "", startDate: "", endDate: "" });
    const [frontendProfileImage, setFrontendProfileImage] = React.useState(userData?.profileImage || "");
    const [backendProfileImage, setBackendProfileImage] = React.useState(null);
    //Recruiter feilds 
    const [organization, setOrganization] = React.useState({
        organizationSize: "",
        organizationName: "",
        organizationDescription: "",
        foundedYear: "",
    })
    const [industry, setIndustry] = React.useState("");
    const [companyWebsite, setCompanyWebsite] = React.useState("");
    const [companyLogoBackend, setCompanyLogoBackend] = React.useState("");
    const [companyLogoFrontend, setCompanyLogoFrontend] = React.useState("");


    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const profileImageRef = React.useRef();
    const companyLogoRef = React.useRef();

    React.useEffect(() => {
        if (userData) {
            setFirstName(userData.firstName || "");
            setLastName(userData.lastName || "");
            setUserName(userData.userName || "");
            setHeadline(userData.headline || "");
            setFrontendProfileImage(userData.profileImage || null);
            setLocation(userData.location || "");
            setFrontendSkills(userData.skills || []);
            setFrontendEducation(userData.education || []);
            setFrontendExperience(userData.experience || []);
            setOrganization({
                organizationSize: userData.organization.organizationSize || "",
                organizationName: userData.organization.organizationName || "",
                organizationDescription: userData.organization.organizationDescription || "",
                foundedYear: userData.organization.foundedYear || "",
            });
            setIndustry(userData.industry || "");
            setCompanyWebsite(userData.companyWebsite || "");
            setCompanyLogoFrontend(userData.companyLogo || "");
        }
    }, [userData]);


    const addSkill = () => {
        if (!backendSkill.trim()) return;
        setFrontendSkills([...frontendSkills, backendSkill.trim()]);
        setBackendSkill("");
    }
    const removeSkill = (index) => {
        setFrontendSkills(prev => prev.filter((_, i) => i !== index));
    };

    const addNewEducation = () => {
        if (!backendEducation.college || !backendEducation.degree) return;
        setFrontendEducation([...frontendEducation, backendEducation]);
        setBackendEducation({
            college: "",
            degree: "",
            fieldOfStudy: "",
            startYear: "",
            endYear: ""
        });

    };
    const removeEducation = (index) => {
        setFrontendEducation(prev => prev.filter((_, i) => i !== index));
    };


    const addNewExperience = () => {
        if (!backendExperience.title || !backendExperience.company) return;
        setFrontendExperience([...frontendExperience, backendExperience]);
        setBackendExperience({
            title: "",
            description: "",
            company: "",
            startDate: "",
            endDate: ""
        });

    }
    const removeExperience = (index) => {
        setFrontendExperience(prev => prev.filter((_, i) => i !== index));
    };

    const handleOrganizationChange = (e) => {
        const { name, value } = e.target;
        setOrganization(prev => ({
            ...prev,
            [name]: value
        }));
    }
    const editProfileHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (!firstName || !lastName || !userName) {
            setError("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        try {

            const formData = new FormData();
            //candidate
            formData.append("firstName", firstName.trim());
            formData.append("lastName", lastName.trim());
            formData.append("userName", userName.trim());
            formData.append("headline", headline.trim());
            formData.append("location", location.trim());
            // FormData can only send strings — so JSON.stringify on the frontend and JSON.parse on the backend
            formData.append("skills", JSON.stringify(frontendSkills));
            formData.append("education", JSON.stringify(frontendEducation));
            formData.append("experience", JSON.stringify(frontendExperience));

            //recruiter

            formData.append("industry", industry.trim());
            formData.append("organization", JSON.stringify(organization));

            if (companyLogoBackend instanceof File) {
                formData.append("companyLogo", companyLogoBackend);

            }
            if (backendProfileImage instanceof File) {
                formData.append("profileImage", backendProfileImage);
            }
            const result = await axios.put(serverUrl + "/api/user/updateprofile", formData, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } });
            if (result.data && result.data.user) {
                setUserData(result.data.user);
                console.log("Updated user data:", result.data.user);
                setSuccess("Profile updated successfully!");
                setTimeout(() => setEditProfileOpen(false), 2500);
            }

        } catch (err) {
            console.error("Error updating profile:", err.response?.data.message || err.message);
            setError("Failed to update profile.");
        }
        finally {
            setLoading(false);
        }
    }


    return (



        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            {/* MainEditProfile div */}
            <div className='w-[90%] h-[80vh] md:max-w-[480px] lg:max-w-[520px] bg-[white] overflow-y-auto rounded-xl shadow-lg flex flex-col items-center pt-8 pl-6 pr-6 pb-8 gap-4 relative'>
                <RxCross2 className='pt-2 pr-2 w-7 h-7 right-2 top-2 absolute cursor-pointer' onClick={() => { setEditProfileOpen(false); }} />
                {/* input for uploading/updating profileImage */}
                <input
                    ref={profileImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) {
                            setError("No file selected");
                            return;
                        }
                        setBackendProfileImage(file);
                        setFrontendProfileImage(URL.createObjectURL(file));

                    }}
                />



                <div className=' w-20 h-20 relative bg-pink-300 rounded-full flex items-center justify-center text-lg font-bold text-gray-600'>

                    <FaCirclePlus onClick={() => profileImageRef.current?.click()} className='right-1 bottom-1 absolute text-emerald-600 cursor-pointer' />
                    {userData?.profileImage ? (
                        <img
                            src={frontendProfileImage}
                            alt="Profilyyy" //if the image is not shown or loaded then this text gonna appear
                            className='w-20 h-20 border-2 border-emerald-600 rounded-full object-cover'
                        />) : (
                        <div className="w-20 h-20 rounded-full flex items-center justify-center ">
                            {userData?.firstName ? (
                                <span className="w-20 h-20 rounded-full flex items-center justify-center text-lg font-bold bg-gray-300 text-emerald-700">
                                    {userData.firstName.charAt(0).toUpperCase()}</span>
                            ) : (
                                <FaUserCircle className="w-20 h-20 text-gray-400" />
                            )}
                        </div>
                    )}

                </div>

                {/* edit form */}
                <form noValidate onSubmit={editProfileHandler} className='w-full flex flex-col items-start gap-3 pt-4 overflow-auto '>
                    <h3 className="font-semibold text-gray-500 ">Personal Details</h3>
                    <div className="w-full rounded-md">
                        <label className='font-medium text-sm text-gray-500'>First Name</label>
                        <input type="text" placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} className='w-full border-2 border-gray-400 outline-none mt-1 p-2 rounded-md focus:outline-none focus:border-gray-500' />
                    </div>
                    <div className="w-full rounded-md">
                        <label className='font-medium text-sm text-gray-500'>Last Name</label>
                        <input type="text" placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} className='w-full border-2 border-gray-400 outline-none mt-1 p-2 rounded-md focus:outline-none focus:border-gray-500' />
                    </div>
                    <div className="w-full rounded-md">
                        <label className='font-medium text-sm text-gray-500'>User Name</label>
                        <input type="text" placeholder='User Name' value={userName} onChange={(e) => setUserName(e.target.value)} className='w-full border-2 border-gray-400 outline-none mt-1 p-2 rounded-md focus:outline-none focus:border-gray-500' />
                    </div>
                    <div className="w-full rounded-md">
                        <label className='font-medium text-sm text-gray-500'>Location</label>
                        <input type="text" placeholder='Location' value={location} onChange={(e) => setLocation(e.target.value)} className='w-full border-2 border-gray-400 outline-none mt-1 p-2 rounded-md focus:outline-none focus:border-gray-500' />
                    </div>

                    {isRecruiter ? (
                        <>
                            <h3 className="font-semibold text-gray-500 ">Organization</h3>
                            <div className="w-full rounded-md">
                                <label className='font-medium text-sm  text-gray-500'>Name</label>
                                <input type="text" name="organizationName" placeholder='Name' value={organization.organizationName} onChange={handleOrganizationChange} className='w-full border-2 border-gray-400 outline-none mt-1 p-2 rounded-md focus:outline-none focus:border-gray-500' />
                            </div>
                            <div className="w-full rounded-md">
                                <label className='font-medium text-sm text-gray-500'>CompanySize</label>
                                <select name="organizationSize" value={organization.organizationSize} onChange={handleOrganizationChange}
                                    className='w-full border-2 border-gray-400 outline-none p-2 rounded-md mt-1 focus:outline-none focus:border-gray-500'>
                                    <option value="">Size</option>
                                    <option value="1-50">1-50</option>
                                    <option value="51-200">51-200</option>
                                    <option value="201-500">201-500</option>
                                    <option value="501-1000">501-1000</option>
                                    <option value="1001-10000">1001-10000</option>
                                    <option value="10001+">10001+</option>
                                </select>
                            </div>

                            <div className="w-full rounded-md">
                                <label className='font-medium text-sm  text-gray-500'>Founded Year</label>
                                <input type="number" name="foundedYear" placeholder='Founded Year' start={1990} end={2023} value={organization.foundedYear} onChange={handleOrganizationChange} className='w-full border-2 border-gray-400 outline-none mt-1 p-2 rounded-md focus:outline-none focus:border-gray-500' />
                            </div>

                            <div className="w-full rounded-md">
                                <label className='font-medium text-sm  text-gray-500'>Description</label>
                                <textarea rows={8} name="organizationDescription" placeholder='Description' value={organization.organizationDescription} onChange={handleOrganizationChange} className='w-full border-2 border-gray-400 outline-none mt-1 p-2 rounded-md focus:outline-none focus:border-gray-500 resize-none min-h-[100px]' />
                            </div>
                            <div className="w-full rounded-md">
                                <label className='font-medium text-sm  text-gray-500'>Industry</label>
                                <select value={industry} onChange={(e) => setIndustry(e.target.value)}
                                    className='w-full border-2 border-gray-400 outline-none p-2 rounded-md focus:outline-none focus:border-gray-500'>
                                    <option value="">Industry</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Education">Education</option>
                                    <option value="E-commerce">E-commerce</option>
                                    <option value="Consulting">Consulting</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>


                            <div className="w-full rounded-md">
                                <label className='font-medium text-sm  text-gray-500'>Website URL</label>
                                <input type="text" className='w-full border-2 border-gray-400 outline-none p-2 rounded-md focus:outline-none focus:border-gray-500'
                                    placeholder='Website URL' value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />


                            </div>
                            <input
                                ref={companyLogoRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    setCompanyLogoBackend(file);
                                    setCompanyLogoFrontend(URL.createObjectURL(file));
                                }}
                            />
                            <div className="w-full rounded-md">
                                <label className='font-medium text-sm  text-gray-500'>Add Website Logo</label>
                            </div>
                            <div className='w-24 h-24 relative bg-pink-300 rounded-md flex items-center justify-center  text-gray-600'>
                               
                                <FaCirclePlus
                                    onClick={() => companyLogoRef.current?.click()}
                                    className='right-1 bottom-1 absolute text-emerald-600 cursor-pointer' />
                                {companyLogoFrontend ? (
                                    <img
                                        src={companyLogoFrontend}
                                        alt="Company Logo"
                                        className='w-24 h-24 border-2 border-gray-600 rounded-md object-cover'
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-md flex items-center justify-center bg-gray-300 text-gray-600">
                                        Company Logo
                                    </div>
                                )}
                            </div>

                        </>
                    ) : (
                        <>
                        <div className="w-full rounded-md">
                                <label className='font-medium text-sm text-gray-500'>Headline</label>
                            <input type="text" placeholder='Headline' value={headline} onChange={(e) => setHeadline(e.target.value)} className='w-full border-2 mt-1  border-gray-400 outline-none p-2 rounded-md focus:outline-none focus:border-gray-500' />
                            </div>
                            <div className='w-full'>
                                <h3 className="font-semibold">Skills</h3>
                                {/* div for displaying stored skills with delete option */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {frontendSkills.map((skill, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">
                                            {skill}
                                            <button type="button" onClick={() => removeSkill(index)}
                                                className="text-red-500 hover:text-red-700">✕</button>
                                        </div>
                                    ))}

                                </div>
                                {/* div for adding new skill */}
                                <div className="relative mt-3">
                                    <input
                                        type="text"
                                        placeholder='Add new Skill '
                                        value={backendSkill}
                                        onChange={(e) => setBackendSkill(e.target.value)}
                                        className='w-full mt-3 border-2 border-gray-500 p-2 rounded-md focus:outline-none focus:border-emerald-600'
                                    />
                                    <FaCheck onClick={addSkill}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 cursor-pointer hover:text-emerald-700"
                                    />
                                </div>
                            </div>
                            <div className="w-full mt-4">
                                <h3 className="font-semibold">Education</h3>
                                {/* div for displaying education */}
                                <div className="flex flex-col gap-2 mt-2">

                                    {frontendEducation.map((edu, index) => (
                                        <div key={index} className="flex justify-between items-center bg-emerald-100 text-emerald-700 px-3 py-2 rounded-md">
                                            <div className="text-sm">
                                                <div className="font-medium">{edu.degree} - {edu.fieldOfStudy}</div>
                                                <div>{edu.college}</div>
                                                <div className="text-xs text-gray-600">{edu.startYear} - {edu.endYear}</div>
                                            </div>
                                            <button type="button" className="text-red-500"
                                                onClick={() => removeEducation(index)}>✕</button>
                                        </div>
                                    ))}

                                </div>

                                {/* div for adding new education */}
                                <div className="mt-3 flex flex-col gap-2 ">
                                    <h3 className="font-medium ">Add New Education</h3>
                                    <input
                                        type="text"
                                        placeholder="College"
                                        value={backendEducation.college}
                                        onChange={(e) => setBackendEducation({ ...backendEducation, college: e.target.value })}
                                        className="border-2 border-gray-500 p-2 focus:outline-none focus:border-emerald-600 rounded-md"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Degree"
                                        value={backendEducation.degree}
                                        onChange={(e) => setBackendEducation({ ...backendEducation, degree: e.target.value })}
                                        className="border-2 border-gray-500 p-2 focus:outline-none focus:border-emerald-600 rounded-md"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Field of Study"
                                        value={backendEducation.fieldOfStudy}
                                        onChange={(e) => setBackendEducation({ ...backendEducation, fieldOfStudy: e.target.value })}
                                        className="border-2 border-gray-500 p-2 focus:outline-none focus:border-emerald-600 rounded-md"
                                    />

                                    <div className="flex gap-2">

                                        <input
                                            type="number"
                                            placeholder="Start Year"
                                            value={backendEducation.startYear}
                                            onChange={(e) => setBackendEducation({ ...backendEducation, startYear: e.target.value })}
                                            className="border-2 border-gray-500 p-2 focus:outline-none focus:border-emerald-600 rounded-md w-1/2"
                                        />

                                        <div className="relative w-1/2">

                                            <input
                                                type="number"
                                                placeholder="End Year"
                                                value={backendEducation.endYear}
                                                onChange={(e) => setBackendEducation({ ...backendEducation, endYear: e.target.value })}
                                                className="border-2 border-gray-500 p-2 pr-10 focus:outline-none focus:border-emerald-600 rounded-md w-full"
                                            />

                                        </div>
                                    </div>
                                    <button type="button" onClick={addNewEducation} className=" mt-3 mb-1 cursor-pointer bg-[] border-2 py-1 border-emerald-600 rounded-full text-gray-500">
                                        Add
                                    </button>

                                </div>
                            </div>







                            <div className="w-full mt-4">
                                <h3 className="font-semibold">Experience</h3>
                                {/* div for displaying experience */}
                                <div className="flex flex-col gap-2 mt-2">

                                    {frontendExperience.map((exp, index) => (
                                        <div key={index} className="flex justify-between items-center bg-emerald-100 text-emerald-700 px-3 py-2 rounded-md">
                                            <div className="text-sm">
                                                <div className="font-medium">{exp.company} - {exp.title}</div>
                                                <div>{exp.description}</div>
                                                <div className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</div>
                                            </div>
                                            <button type="button" className="text-red-500"
                                                onClick={() => removeExperience(index)}>✕</button>
                                        </div>
                                    ))}

                                </div>

                                {/* div for adding new experience */}
                                <div className="mt-3 flex flex-col gap-2 ">
                                    <h3 className="font-medium ">Add New Experience</h3>
                                    <input
                                        type="text"
                                        placeholder="Company"
                                        value={backendExperience.company}
                                        onChange={(e) => setBackendExperience({ ...backendExperience, company: e.target.value })}
                                        className="border-2 border-gray-500 p-2 focus:outline-none focus:border-emerald-600 rounded-md"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Position"
                                        value={backendExperience.title}
                                        onChange={(e) => setBackendExperience({ ...backendExperience, title: e.target.value })}
                                        className="border-2 border-gray-500 p-2 focus:outline-none focus:border-emerald-600 rounded-md"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Description"
                                        value={backendExperience.description}
                                        onChange={(e) => setBackendExperience({ ...backendExperience, description: e.target.value })}
                                        className="border-2 border-gray-500 p-2 focus:outline-none focus:border-emerald-600 rounded-md"
                                    />

                                    <div className="flex gap-2">

                                        <input
                                            type="number"
                                            placeholder="Start Year"
                                            value={backendExperience.startDate}
                                            onChange={(e) => setBackendExperience({ ...backendExperience, startDate: e.target.value })}
                                            className="border-2 border-gray-500 p-2 focus:outline-none focus:border-emerald-600 rounded-md w-1/2"
                                        />

                                        <div className="relative w-1/2">

                                            <input
                                                type="number"
                                                placeholder="End Year"
                                                value={backendExperience.endDate}
                                                onChange={(e) => setBackendExperience({ ...backendExperience, endDate: e.target.value })}
                                                className="border-2 border-gray-500 p-2 focus:outline-none focus:border-emerald-600 pr-10 rounded-md w-full"
                                            />

                                        </div>
                                    </div>
                                    <button type="button" onClick={addNewExperience} className=" mt-3 mb-1 cursor-pointer bg-[] border-2 py-1 border-emerald-600 rounded-full text-gray-500">
                                        Add
                                    </button>

                                </div>
                            </div>
                        </>)}



                    <div>
                        {error && <div className="text-red-500 mb-2">{error}</div>}
                        {success && <div className="text-emerald-600 mb-2">{success}</div>}
                    </div>


                    <button type='submit' className='w-full bg-emerald-600 text-white p-2 rounded-md hover:bg-emerald-700'>{loading ? "Saving..." : "Save Changes"}</button>
                </form>
            </div>
        </div>

    )
}
export default EditProfile;