import "./index.css"
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from './context/AuthContext.jsx'
import UserContext from './context/UserContext.jsx'
import SearchContext from './context/SearchContext.jsx'
import ChatContext from './context/ChatContext.jsx'
import axios from 'axios';
axios.defaults.withCredentials = true; // 👈 Forces all requests to include tokens
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthContext>
      <UserContext>
        <ChatContext>
          <SearchContext>
            <App />
          </SearchContext>
        </ChatContext>
      </UserContext>
    </AuthContext>
  </BrowserRouter>
)
