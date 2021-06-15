import Head from 'next/head';
import Search from "../components/search";
import {useEffect, useState} from "react";

// TODO: When showing results in a dropdown under the [Status][Input][Action]
//       it may be convenient have a component in charge of opening/closing the dropdown.
//       Exposing its state so it can be animated.
const Listbox = ({children,open, ...props}) => open ? <div {...props}>{children}</div> : null;

const HomeSearch = () => {
  const [selectedArticle, setSelectedArticle] = useState();
  useEffect(() => {
    if(selectedArticle) {
      console.log(`Now do something with ${selectedArticle.title}....`)
    }
  }, [selectedArticle]);

  return (
    <Search className="text-sm" hitsPerPage={4} onChange={setSelectedArticle}>
        {({searching, hits, nbHits, nbPages, showingResults, showingResultsNotFound, query}) => {
            return <>
                <div>
                    {searching ? <p>Spinner</p> : <p>Not active</p>}
                </div>
                <Search.Input placeholder="Search the documentation"
                              className="border border-gray-500 rounded-md w-full p-2 text-gray-600"/>

                <Listbox open={showingResults || showingResultsNotFound} className="border border-gray-400 p-2">
                    {showingResultsNotFound && <p>No results for {query}.</p>}
                    {showingResults && (
                        <div>
                            <p>Found {nbHits} results in {nbPages} pages</p>
                            <ol>
                                {hits.map(hit => (
                                    <Search.Hit value={hit} key={hit.slug} as="li">
                                        {hit.title}
                                    </Search.Hit>
                                ))}
                            </ol>
                            <div>
                                <Search.MoreResults as="a" className="text-purple-600 font-bold">
                                    More results
                                </Search.MoreResults>
                            </div>

                        </div>
                    )}
                </Listbox>
            </>;
        }}
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

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20">
        <div className="mt-3 text-2xl">
          <HomeSearch/>
        </div>
      </main>
    </div>
  )
}
