import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import { useReducerAsync } from "use-reducer-async";

import algoliasearch from 'algoliasearch/lite';
import {createContext, createElement, useContext, useEffect, useRef, useState} from "react";

const client = algoliasearch('BSEPWDMWHK', 'd5d31ebc204b43b0c1b6a4aa03e0658c');
const index = client.initIndex('staging_articles');
const initialState = {
    query: null,
    queries: ['slack', 'microsoft'],
    searching: false,
    page: 0,
    showingRecentQueries: false,
    showingResultsNotFound: false,
    showingResults: false,
    onChange: null,
};

const searchReducer = (state, action) => {
    console.log(`Action: ${action.type}:`, state)

    switch(action.type) {
        case 'initial':
            return {...initialState, hitsPerPage: state.hitsPerPage, onChange: state.onChange};
        case 'start_searching':
            return { ...state, query: action.query, searching: true, showingRecentQueries: false};
        case 'end_searching':
            return { ...state, searching: false, ...action.results }
        case 'show_recent_queries':
            return { ...state, showingRecentQueries: true, searching: false };
        case 'show_results':
            return state.query === action.query ? { ...state, showingLastPage: state.page + 1 === state.nbPages, showingResults: true, showingResultsNotFound: false} : state;
        case 'show_results_not_found':
            return state.query === action.query ? { ...state, showingResults: false, showingResultsNotFound: true} : state;
        case 'add_recent_query':
            const {queries} = state;
            return { ...state, queries: [...queries.slice(0,2), action.query] }
        default:
            throw new Error(`action not found: ${action.type}`);
    }
}

const SearchContext = createContext();
export const useSearch = () => useContext(SearchContext);

const actionHandlers = {
    'searching': ({dispatch, getState}) => async (action) => {
        const { query, page } = action;
        const { hitsPerPage } = getState();
        dispatch({type: 'start_searching', query});
        const results = await index.search(query, {page, hitsPerPage})
        dispatch({type: 'end_searching', results})

        results && results.nbHits > 0 ? dispatch({type: 'show_results', query}) : dispatch({type: 'show_results_not_found', query});
    }
}

const useKeyPress = (key, action) => {
    useEffect(() => {
        const handleKeyUp = (e) => {
            if (e.key === key) {
                action();
            }
        }
        window.addEventListener('keyup', handleKeyUp);
        return () => window.removeEventListener('keyup', handleKeyUp)
    }, [])
}


const Search = ({children, hitsPerPage, onChange, className}) => {
    const [state, dispatch] = useReducerAsync(searchReducer, {...initialState,
        hitsPerPage,
        onChange }, actionHandlers);

    const providerState = {
        state, dispatch
    }

    const reset = e => {
        dispatch({type: 'initial'});
    };

    useKeyPress('Escape', reset)

    const ref = useRef();
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                dispatch({type: 'initial'});
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });

    return (
        <SearchContext.Provider value={providerState}>
            <div ref={ref} className={className}>
                {children(state)}
            </div>
        </SearchContext.Provider>

    );
};

export default Search;

const Input = ({placeholder, query, ...props}) => {
    const {state, dispatch} = useSearch();
    const inputRef = useRef();

    const showRecentSearches = () => dispatch({type: 'show_recent_queries'});



    useEffect(() => {
        if(state.searching || state.query === null) {
            inputRef.current.value = state.query;
        }
    }, [state.query, state.searching, inputRef]);

    const focusInputBox = () => {
        inputRef.current && inputRef.current.focus();
    }
    useKeyPress('/', focusInputBox);

    const search = e => {
        if (e.target.value === '') {
            dispatch({type: 'initial'});
        } else {
            const query = e.target.value;
            dispatch({type: 'searching', query});
        }
    };

    return (<input
        {...props}
        type="text"
        ref={inputRef}
        value={query}
        placeholder={placeholder}
        onChange={search}
        onFocus={showRecentSearches}
    />)
};


const Query = ({query, children}) => {
    const {dispatch} = useSearch();

    return <li onClick={() => dispatch({type: 'searching', query})}>{children}</li>;
};

Search.Query = Query;

const Hit = ({children, value, as='li', ...props}) => {
    const {state, dispatch} = useSearch();
    const onClick = () => {
        state.onChange(value)
        // this one should be optional: for example, only if Search has enabled RecentQueries.
        dispatch({type: 'add_recent_query', query: state.query});
    }
    return createElement(as, {...props, onClick}, children);
};

const MoreResults = ({children, as, ...props}) => {
    const {state, dispatch} = useSearch();
    if (state.showingLastPage) {
        return null;
    }

    const onClick = () => {
        dispatch({type: 'searching', query: state.query, page: state.page + 1})
    }
    return createElement(as, {...props, onClick}, children);
}

Search.Input = Input;
Search.MoreResults = MoreResults;
Search.Hit = Hit;