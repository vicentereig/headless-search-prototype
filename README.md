# Goals
- low-fi dependencies
  - eliminate dependency with education-ui/popover.
  - only deps that are necessary.
  - try to use as standard react as we can.
- lightweight impl, following React practices: Make react work for us, not the other way around.
  - state management
  - easy to test both unit

- Unify the four searches in Docs, reusing headless components:
  - Home page article search (algolia)
  - Home page connector search (algolia)
  - AllOperations, in memory search
- Separation of concerns: reuse the search behaviour, while changing
the appearance, plugin optional behaviour.
  - ideally reuse parts of existing search (recent searches, styling).  

## Use cases
- search as I type, filtering an in memory array
- search as I type, filtering in Algolia
- ESC key resets the state (closes search result, clears query)
- When displaying results, capture outside click.
- For home page and article search: `/` triggers focus on search input.
- Idem: include embedded results
- Idem: show more results/pagination
- When selecting an item, delegate to the parent what to do with it. 
  Clicking won't change the URL always.
# To explore
- Use Algolia's InstaSearch components?
