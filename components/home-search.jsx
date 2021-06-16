import {useEffect, useState} from "react";
import Search from "./search";
import {SearchIcon} from "@heroicons/react/outline";
import {Transition} from "@headlessui/react";
import { usePlausible } from 'next-plausible'

const Listbox = ({children,open, ...props}) => open ? <div {...props}>{children}</div> : null;

const HomeSearch = ({onSelected}) => {
    const [selectedArticle, setSelectedArticle] = useState();
    const track = usePlausible();

    useEffect(() => {
        if(selectedArticle) {
            track('ArticleSelected', {props: {title: selectedArticle.title}});
        }
    }, [selectedArticle]);

    useEffect(() => {
        if(selectedArticle) {
            onSelected && onSelected(selectedArticle);
        }
    }, [selectedArticle]);

    return (
        <Search className="mt-5 text-sm relative inline-block text-left pb-4 w-full"
                hitsPerPage={4}
                onChange={setSelectedArticle}>
            {({searching, hits, nbHits, nbPages, showingResults, showingResultsNotFound, query, queries, showingRecentQueries}) => {
                return <div >
                    <div className="flex items-stretch focus:outline-none focus:ring">
                        <label className="pt-2 pl-2 border-t border-l border-b rounded-l-md border-gray-500">
                            <SearchIcon className={`h-5 w-5 ${ searching ? 'text-gray-600' : 'text-gray-400'}`}/>
                        </label>

                        <Search.Input placeholder="Search the documentation"
                                      className="outline-none flex-1 border-r border-t border-b border-gray-500
                              rounded-r-md w-full p-2 text-gray-600"/>
                    </div>
                    <Transition show={showingResults || showingResultsNotFound || showingRecentQueries}
                                enter="transition-opacity duration-75"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity duration-150"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                    >
                        <Listbox open={showingResults || showingResultsNotFound || showingRecentQueries}
                                 className="origin-top-right absolute right-0 w-full
                             border-gray-400 p-2 bg-white shadow rounded-b-sm">

                            { showingRecentQueries && (
                                <div className="pb-2 text-gray-500">
                                    <h2 className="text-sm font-bold text-gray-400 pb-2">Recent Queries</h2>
                                    <ul className="text-sm">
                                        {queries.map(q => (<Search.Query key={q} query={q}>
                                            <a className="mb-2 ml-2 inline-block"  href="#">{q}</a>
                                        </Search.Query>))}
                                    </ul>
                                </div>)
                            }
                            {showingResultsNotFound && <p className="text-gray-200">No results for {query}.</p>}
                            {showingResults && (
                                <div>
                                    <ol>
                                        {hits.map(hit => (
                                            <Search.Hit className="py-2 flex" value={hit} key={hit.slug} as="li">
                                                <div className="flex-1">
                                                    <a href="#">{hit.title}</a>
                                                </div>
                                                <div className="flex-initial text-xs text-purple-400 bg-purple-100 rounded-md py-1 px-2">
                                                    { hit.section}
                                                </div>
                                                {hit.connectorSection && <div className="flex-initial text-xs text-gray-400 ml-2 bg-gray-100 rounded-md py-1 px-2">
                                                    { hit.connectorSection}
                                                </div>
                                                }
                                            </Search.Hit>
                                        ))}
                                    </ol>
                                    <div className="flex">
                                        <Search.MoreResults as="a" className="flex-1 text-purple-600 font-bold cursor-pointer">
                                            More results
                                        </Search.MoreResults>
                                        <p className="text-gray-800">{nbHits} results in {nbPages} pages</p>
                                    </div>

                                </div>
                            )}
                        </Listbox>
                    </Transition>
                </div>;
            }}
        </Search>
    );
}

export default HomeSearch;