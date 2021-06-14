import Head from 'next/head';
import Search from "../components/search";
import {useEffect, useState} from "react";


const HomeSearch = () => {
  const [selectedArticle, setSelectedArticle] = useState();
  useEffect(() => {
    if(selectedArticle) {
      console.log(`Now do something with ${selectedArticle.title}....`)
    }
  }, [selectedArticle]);

  return (
    <Search hitsPerPage={4}>
      <Search.Status>
          {(state) => (
              state.searching ? <p>Spinner</p> : <p>Not active</p>
          )}
      </Search.Status>
      <Search.Input placeholder="Search the documentation"
                    className="border border-gray-500 rounded-md w-full p-2 text-gray-600"/>
      <Search.Hits>
          {({showingResults, showingResultsNotFound, hits, nbHits, nbPages, query}) => {
            if (showingResultsNotFound) {
                return <p>No results for {query}</p>
            }
            if(showingResults) {
              return (
                  <>
                      <p>Found {nbHits} results in {nbPages} pages</p>
                      <ol>
                          {hits.map(hit => (
                              // need to wrap this one up so it can save a search query when clicking on a result
                            <li onClick={() => setSelectedArticle(hit)} key={hit.slug}>
                                {hit.title}
                            </li>
                          ))}
                      </ol>
                  </>
              );
            }
          }
        }
      </Search.Hits>
    </Search>
  );
}

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
