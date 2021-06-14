import Head from 'next/head';
import Search from "../components/search";
import {createElement, useEffect, useState} from "react";

// TODO: When showing results in a dropdown under the [Status][Input][Action]
//       it may be convenient have a component in charge of opening/closing the dropdown.
//       Exposing its state so it can be animated.
const Listbox = ({children}) => <div>{children}</div>;

const HomeSearch = () => {
  const [selectedArticle, setSelectedArticle] = useState();
  useEffect(() => {
    if(selectedArticle) {
      console.log(`Now do something with ${selectedArticle.title}....`)
    }
  }, [selectedArticle]);

  return (
    <Search hitsPerPage={4} onChange={setSelectedArticle}>
      <Search.Status>
          {(state) => (
              state.searching ? <p>Spinner</p> : <p>Not active</p>
          )}
      </Search.Status>
      <Search.Input placeholder="Search the documentation"
                    className="border border-gray-500 rounded-md w-full p-2 text-gray-600"/>
      <Listbox>
        <Search.Miss>{({query}) => (<p>No results for {query}.</p>)}</Search.Miss>
        <Search.Hits>
        {({ hits, nbHits, nbPages}) => (
          <>
            <p>Found {nbHits} results in {nbPages} pages</p>
            <ol>
              {hits.map(hit => (
                <Search.Hit value={hit} key={hit.slug} as="li">
                    {hit.title}
                </Search.Hit>
              ))}
            </ol>
          </>
        )}
        </Search.Hits>
      </Listbox>
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
