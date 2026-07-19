import React, { createContext, useState } from "react";

export const SearchQueryContext = createContext(); //plug (used wherever you need power)

const SearchContext =({ children }) =>{ // Wrapper, electric socket in the wall (installed once)
    const [searchQuery, setSearchQuery]=useState('');
    const [searchScope, setSearchScope]=useState('jobs'); // 'people

    const clearSearch =() =>{
        setSearchQuery('');
        setSearchScope('jobs');
    }
    return (
        <SearchQueryContext.Provider value={{ searchQuery, setSearchQuery, searchScope, setSearchScope, clearSearch}}>
            {children}
        </SearchQueryContext.Provider>
    );
};
export default SearchContext;