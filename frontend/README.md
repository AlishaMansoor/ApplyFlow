"object with keys {min, max, currency} is not valid as a React child, React can render objects, if want to render a colection of children use array instead. Got this to know while rendering salaryRange inside job model because it is an object with feilds min,max, currency  "

Props is for components that can see each other

// Parent passes to child while rendering
<JobCard job={job} onClick={handleClick} />

// Child receives it
const JobCard = ({ job, onClick }) => {
  console.log(job.title) // works!
}


Navigate state is for components on completely different pages.
// Component A — passing state while navigating
navigate(`/job/${job._id}`, { state: { job } });

// Component B (different page) — receiving it
const { state } = useLocation();
const job = state?.job;
console.log(job.title) // works!
```
- Works between **any two pages** — no parent/child relationship needed
- Data travels **through the router** not through component tree
- Only available **after navigation happens**

//RELATED TO SEARCH
We fetched job data using useState variable 
const [jobs, setJobs] = React.useState([]); and set this variable after fetching the jobs. now we Add all the filtered data to *filteredjobs * variable if there was no query at all, all the jobs inside *jobs* variable would be copied to *filteredjobs* variable and then we map filteredjobs to display all the jobs. so even if we searched or not we will bemapping  on *filteredjobs* not on jobs itself?

we define a variable inside home .jsx, and pass it to both Navbar as well jobcardbody, We set query inside navbar.Jsx using OnChange. as useState is changed, It will re-render everything in jobcard body as well. so Using the query variable we filtered jobs and display them again
User types "React" in Navbar input
         ↓
onChange fires → setSearchQuery("React") in Home.jsx
         ↓
Home.jsx re-renders (state changed)
         ↓
         ├── Navbar re-renders (gets new searchQuery prop — input shows "React")
         │
         └── JobCardBody re-renders (gets new searchQuery prop)
                    ↓
              filteredJobs recalculates
              jobs.filter(job => job.title.includes("react"))
                    ↓
              only matching jobs mapped
                    ↓
              new cards rendered on screen


State lifting — searchQuery in Home.jsx(Common parent) shared between Navbar(child) and JobCardBody(child)

Controlled components — search input with value + onChange, e.target.value
Props drilling — passing searchQuery down to siblings

Guard clauses — early returns for loading/empty/notfound states e.g. if(loading) return <> Loaing the Jobs...</>
Custom hooks(self defined hook) — useJobDetail separating fetch logic from UI
Router state vs Props — navigate() passing job data to JobDetail
useLocation — reading router state in JobDetail
useParams — getting :id from URL
Lazy loading — dynamic import for JobDetail route
Suspense — fallback while lazy component loads

Pure helper functions — formatSalary, formatDate in utils/

Framer Motion — page entrance, card hover animations
AnimatePresence — exit animations for sidebar
Conditional rendering — sidebar on lg vs small screens
useState initialization — window.innerWidth for sidebar default
useNavigate — navigate(-1), navigate with state
z-index hierarchy — navbar, sidebar, cards stacking order
Reusable components — onClick passed as prop vs defined inside


//RELATED TO NAVLINK INSIDE SIDEBAR.JSX
<NavLink to='/myapplications'
            className={({ isActive }) => ` w-full pl-3 py-1.5 flex items-center gap-2 mb-1 hover:text-emerald-900 hover:rounded-md cursor-pointer ${isActive ? 'bg-emerald-100' : 'hover:bg-gray-200 '}`}>
            <FaRectangleList className="text-xl" /><span>My Applications</span>
        </NavLink>
handles two things at once:
1. Navigation → clicks takes me to /myapplications
2. Active styling → automatically applies bg-emerald-100 when on that route        


FormData can only send strings. and we use ForData while handling multipart from (forms havinf file uploads)....so we need to stringify the array and objects before sending them to backend . and while sending back them to frontend from bacjend we also need to parse them using json.parse(); 




first i thought for a conversation if there are 2 participants me and my friend in a conversation, and i send some message, then sendMessage ran, and i would have to send senderId from fronted; extracted from the current conversation as conversation.participants.find(a=>a!=userData._id);.....but now i have another thought, if both the user are active, then from both the user's perspective , i just need to extract current user Id...and from that side of user the sendMessage Controller runs. so it will automatically have the senderId, no need to find it from participant.A sendMessage api would run everytime from both side, me and my friend's side, whenever either sends a message. Am i right?


If they refresh the page, close the tab, or log out, the socket disconnects automatically.
If they open your app in two separate tabs, it actually creates two separate socket connections with different socket.ids. That’s why tracking things correctly on the backend is so vital.