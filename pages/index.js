import Head from 'next/head';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import { useReducerAsync } from "use-reducer-async";
const initialState = {query: '', queries: [], isSearching: false, isShowingRecentQueries: false};
import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch('BSEPWDMWHK', 'd5d31ebc204b43b0c1b6a4aa03e0658c');
const index = client.initIndex('staging_articles');

const searchReducer = (state, action) => {
  console.log(`Action: ${action.type}`)
  console.log(state);

  switch(action.type) {
    case 'initial':
      return initialState;
    case 'start_fetching_results':
      return { ...state, query: action.query, isSearching: true, isShowingRecentQueries: false};
    case 'end_fetching_results':
      return { ...state, isSearching: false, results: action.results }
    case 'show_recent_queries':
      return { ...state, isShowingRecentQueries: true, isSearching: false };
    case 'add_recent_query':
      const {queries} = state;
      return { ...state, queries: [...queries.slice(0,2), action.query] }
    default:
      throw new Error();
  }
}

const actionHandlers = {
  'search': ({dispatch}) => async (action) => {
    dispatch({type: 'start_fetching_results', query: action.query});
    const results = await index.search(action.query)
    dispatch({type: 'end_fetching_results', results})
  }
}

const RecentQueries = ({queries}) => (
    <ul className="text-sm text-gray-300">
      {queries.map(q => (
          <li key={q}>{q}</li>
      ))}
    </ul>
)

const HomeSearch = () => {
  const [state, dispatch] = useReducerAsync(searchReducer, initialState, actionHandlers);


  const resetSearch = e => {
    if (e.key === 'Escape') {
      dispatch({type: 'initial'});
    }
  };

  const performSearch = e => {
    if (e.target.value === '') {
      dispatch({type: 'initial'});
    } else {
      const query = e.target.value;
      dispatch({type: 'search', query});
      // ideally when a search result is selected
      dispatch({type: 'add_recent_query', query});
    }
  };

  const showRecentSearches = e => {
    dispatch({type: 'show_recent_queries', query: e.target.value});
  }

  return <div>
    <input className="border border-gray-500 rounded-md w-full p-2 text-gray-600"
           type="text"
           value={state.query}
           onKeyUp={resetSearch}
           onChange={performSearch}
           onFocus={showRecentSearches}
    />
    {state.isShowingRecentQueries && <RecentQueries queries={state.queries}/>}
    {state.isSearching && <p className="text-sm text-gray-400">Searching for <em>{state.query}</em>...</p>}
  </div>
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="mt-3 text-2xl">
          <HomeSearch/>
        </div>
      </main>
    </div>
  )
}
