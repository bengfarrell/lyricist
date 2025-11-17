# Word Ladder Tests

This document describes the test coverage for the Word Ladder feature.

## Unit Tests

**Location:** `tests/unit/store/word-ladder.test.ts`

The unit tests cover the core word ladder functionality in the `SongStore`:

### Test Suites

1. **Initialization** (3 tests)
   - Default word ladder set creation
   - Empty word arrays on startup
   - No selection on initialization

2. **Word Ladder Set Management** (4 tests)
   - Adding new word ladder sets
   - Navigating between sets
   - Index clamping to valid range
   - Updating column titles

3. **Word Management** (4 tests)
   - Adding words to left/right columns
   - Replacing existing words
   - Handling empty word arrays

4. **Word Selection** (4 tests)
   - Selecting words by index
   - Placeholder selection (-1 index)
   - Selection clearing when changing sets
   - Independent selections per set

5. **Song Persistence** (4 tests)
   - Saving word ladder sets with songs
   - Restoring word ladder sets when loading
   - Handling legacy songs without word ladders
   - Resetting word ladder on new song

6. **Multiple Word Ladder Sets** (2 tests)
   - Maintaining separate word lists per set
   - Different titles for different sets

7. **Edge Cases** (3 tests)
   - Invalid index selection
   - Empty lists with selection
   - Unique ID generation

8. **Input Text Integration** (2 tests)
   - Independent input text updates
   - Clearing input text

### Running Unit Tests

```bash
# Run all unit tests
npm test

# Run only word ladder tests
npm run test:ci -- tests/unit/store/word-ladder.test.ts

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage
```

## Integration Tests

**Location:** `tests/integration/word-ladder.spec.ts`

The integration tests use Playwright to test the word ladder from a user's perspective:

### Test Scenarios

1. **Display & UI** (2 tests)
   - Default category display (Verbs/Nouns)
   - Placeholder word visibility

2. **Category Management** (3 tests)
   - Adding new categories with + button
   - Editing category titles
   - Navigating with arrow buttons

3. **Word Management** (3 tests)
   - Adding words to left column
   - Adding words to right column
   - Removing words with delete button

4. **Word Selection** (2 tests)
   - Clicking words to select them
   - Input field updates on selection

5. **Category Navigation** (2 tests)
   - Auto-selection when switching categories
   - Arrow button navigation

6. **Persistence** (1 test)
   - Saving and loading word ladder with song

### Running Integration Tests

```bash
# Run all integration tests
npm run test:integration

# Run only word ladder integration tests
npm run test:integration -- word-ladder

# Run with UI (interactive)
npm run test:integration:ui

# Run in headed mode (see the browser)
npm run test:integration:headed

# Debug mode
npm run test:integration:debug
```

## Test Coverage

Total tests: **39**
- Unit tests: 26
- Integration tests: 13

## Key Features Tested

✅ Word ladder set creation and management  
✅ Adding/removing words from columns  
✅ Word selection (both real words and placeholders)  
✅ Category navigation with arrow buttons  
✅ Category title editing  
✅ Auto-selection on category change  
✅ Integration with lyric input field  
✅ Song save/load persistence  
✅ Multiple category support  
✅ Empty category handling (placeholders)  
✅ UI interactions and visual feedback  

## Notes

- Unit tests mock the `fetch` API to avoid loading actual sample content
- Integration tests use Playwright's shadow DOM support to access web component internals
- Some tests use small delays to ensure unique timestamp-based IDs
- Tests handle both empty (placeholder) and populated word ladder states

