import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import { useReducerAsync } from "use-reducer-async";

import algoliasearch from 'algoliasearch/lite';
import {createContext, createElement, useContext, useEffect, useRef, useState} from "react";

const client = algoliasearch('BSEPWDMWHK', 'd5d31ebc204b43b0c1b6a4aa03e0658c');
const index = client.initIndex('staging_articles');
const initialState = {
    query: '',
    queries: [],
    searching: false,
    showingRecentQueries: false,
    onChange: null,
};

const searchReducer = (state, action) => {
    console.log(`Action: ${action.type}:`, state)

    switch(action.type) {
        case 'initial':
            return {...initialState, hitsPerPage: state.hitsPerPage};
        case 'start_searching':
            return { ...state, query: action.query, searching: true, showingRecentQueries: false};
        case 'end_searching':
            return { ...state, searching: false, ...action.results }
        case 'show_recent_queries':
            return { ...state, showingRecentQueries: true, searching: false };
        case 'show_results':
            return state.query === action.query ? { ...state, showingResults: true, showingResultsNotFound: false} : state;
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
        const { query } = action;
        dispatch({type: 'start_searching', query});
        const results = await index.search(query, {hitsPerPage: getState().hitsPerPage})
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


const Search = ({children, hitsPerPage, onChange}) => {
    const [state, dispatch] = useReducerAsync(searchReducer, {...initialState, hitsPerPage, onChange }, actionHandlers);
    const providerState = {
        state, dispatch
    }
    return (
        <SearchContext.Provider value={providerState}>
            {children}
        </SearchContext.Provider>

    );
};

export default Search;

const Input = ({placeholder, query, ...props}) => {
    const {state, dispatch} = useSearch();
    const inputRef = useRef();

    const showRecentSearches = () => dispatch({type: 'show_recent_queries'});


    useEffect(() => {
        if(state.searching) {
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
            // ideally when a search result is selected
            // dispatch({type: 'add_recent_query', query});
        }
    };

    const reset = e => {
        if (e.key === 'Escape') {
            dispatch({type: 'initial'});
        }
    };

    return (<input
        {...props}
        type="text"
        ref={inputRef}
        value={query}
        placeholder={placeholder}
        onKeyUp={reset}
        onChange={search}
        onFocus={showRecentSearches}
    />)
};


const RecentQueries = ({queries}) => (
    <ul className="text-sm text-gray-300">
        {queries.map(q => (
            <li key={q}>{q}</li>
        ))}
    </ul>
);

const Status = ({children}) => {
    const {state} = useSearch();
    return <>{children ? children(state) : null}</>;
};

const Hits = ({children}) => {
    const {state} = useSearch();
    if (!children || state.showingResultsNotFound || !state.showingResults && !state.showingResultsNotFound ) {
        return null
    }
    return children(state);
};

const Miss = ({children}) => {
    const {state} = useSearch();
    if (!state.showingResultsNotFound) {
        return null;
    }

    return children(state);
};

const Hit = ({children, value, as='li', ...props}) => {
    const {state, dispatch} = useSearch();
    const onClick = () => {
        state.onChange(value)
        // this one should be optional: for example, only if Search has enabled RecentQueries.
        dispatch({type: 'add_recent_query', query: state.query});
    }
    return createElement(as, {...props, onClick}, children);
};

Search.Miss = Miss;
Search.Status = Status;
Search.Input = Input;
Search.Hits = Hits;
Search.Hit = Hit;