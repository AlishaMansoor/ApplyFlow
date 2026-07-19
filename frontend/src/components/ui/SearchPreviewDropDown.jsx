import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchQueryContext } from '../../context/SearchContext';


const SearchPreviewDropDown = ({ searchResults, searchLoading, onClose }) => {
  const navigate = useNavigate();
  const { clearSearch } = React.useContext(SearchQueryContext);
  const handleClick = (userName) => {
    navigate(`/profile/${userName}`);
    clearSearch();
    onClose();
  }

  return (
    <div className="absolute top-full left-0 w-full bg-white 
                    border border-gray-200  rounded-xl shadow-lg z-50 mt-1">

      {searchLoading && (
        <p className="text-sm text-gray-400 text-center py-3">Searching...</p>
      )}

      {!searchLoading && searchResults.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-3">No users found</p>
      )}

      {!searchLoading && searchResults.map(user => (
        <div
          key={user._id}
          onClick={() => handleClick(user.userName)}
          className="px-4 py-2 hover:bg-gray-50 cursor-pointer 
                     flex items-center gap-3"
        >
          {user.profileImage ? (
            <img src={user.profileImage}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-100 
                           flex items-center justify-center 
                           text-sm font-medium text-emerald-700">
              {user.firstName?.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-sm md:text-base text-gray-800 font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs md:text-sm text-gray-400">@{user.userName}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
export default SearchPreviewDropDown;