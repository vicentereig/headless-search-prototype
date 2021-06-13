# Goals
- low-fi dependencies
  - eliminate dependency with educaiton-ui/popover.
  - only deps that are necessary.
  - try to use as standard react as we can.
- lightweight impl, following React practices.
  - state management
  - easy to test both unit 
- ideally reuse parts of existing search (recent searches?)
- Unify the four searches in Docs, reusing headless components:
  - Home page article search (algolia)
  - Home page connector search (algolia)
  - AllOperations, in memory search
- Separation of concerns: reuse the search behaviour, while changing
the appearance, plugin optional behaviour.
  

## Use cases
- search as I type, filtering an in memory array
- search as I type, filtering in Algolia
- ESC key resets the state (closes search result, clears query)
- When displaying results, capture outside click.
- For home page and article search: `/` triggers focus on search input.
- Idem: filter by embedded
- Idem: show more results.
- When selecting an item, delegate to the parent what to do with it. 
  Clicking won't change the URL always.
# To explore
- Use Algolia's InstaSearch components?

SearchProvider
SearchProps:
- hits per page
