# Navigation patterns

Navigation patterns help users understand where they are in an application and how to get to other locations. Spectrum CSS provides several navigation components for different contexts.

## Breadcrumbs

Breadcrumbs show hierarchy and navigational context for a user's location within an application.

**Reference:** [Breadcrumbs - Spectrum](https://spectrum.adobe.com/page/breadcrumbs/)

**CSS classes:**
- `.spectrum-Breadcrumbs`
- `.spectrum-Breadcrumbs-item`
- `.spectrum-Breadcrumbs-itemLink`
- `.spectrum-Breadcrumbs-itemSeparator`

**Custom properties:**
```css
--spectrum-breadcrumb-compact-item-height
--spectrum-breadcrumb-multiline-item-height
--spectrum-breadcrumb-item-color-default
--spectrum-breadcrumb-item-color-hover
--spectrum-breadcrumb-item-color-selected
```

### Variants

#### Default (inline)
Breadcrumbs displayed inline with hierarchy in reading order.

**Guidelines:**
- Most common breadcrumb layout
- All breadcrumb levels visible
- Separated by chevron icons
- Current page typically not linked

**HTML structure:**
```html
<nav class="spectrum-Breadcrumbs" role="navigation" aria-label="Breadcrumb">
  <ul class="spectrum-Breadcrumbs-list">
    <li class="spectrum-Breadcrumbs-item">
      <a class="spectrum-Breadcrumbs-itemLink" href="#">Nav root</a>
      <svg class="spectrum-Icon spectrum-Breadcrumbs-itemSeparator">
        <!-- chevron icon -->
      </svg>
    </li>
    <li class="spectrum-Breadcrumbs-item">
      <a class="spectrum-Breadcrumbs-itemLink" href="#">Folder</a>
      <svg class="spectrum-Icon spectrum-Breadcrumbs-itemSeparator">
        <!-- chevron icon -->
      </svg>
    </li>
    <li class="spectrum-Breadcrumbs-item" aria-current="page">
      <a class="spectrum-Breadcrumbs-itemLink">Current Page</a>
    </li>
  </ul>
</nav>
```

#### Multiline
Places emphasis on the selected breadcrumb item as a page title.

**CSS class:**
- `.spectrum-Breadcrumbs--multiline`

**Guidelines:**
- Current location more prominent
- Works as both navigation and page title
- Hierarchy shown above current page
- Use when page title is important context

#### Compact
Reduces vertical height while maintaining proper user context.

**CSS class:**
- `.spectrum-Breadcrumbs--compact`

**Guidelines:**
- Optimizes for functional space
- Useful in dense interfaces
- Maintains all breadcrumb functionality
- Smaller text and spacing

### Truncation and nesting

**Guidelines:**
- Truncate when not enough room to display all levels
- Truncate when there are 5 or more breadcrumbs
- Typically indicated by folder icon with menu
- Implementations handle overflow menu functionality

**Nesting patterns:**

**Root visible:**
```html
<!-- Keeps root visible when middle items are truncated -->
<li class="spectrum-Breadcrumbs-item">
  <a class="spectrum-Breadcrumbs-itemLink" href="#">Root</a>
</li>
<li class="spectrum-Breadcrumbs-item">
  <button class="spectrum-ActionButton" aria-label="Folder menu">
    <svg class="spectrum-Icon"><!-- folder icon --></svg>
  </button>
</li>
<li class="spectrum-Breadcrumbs-item">
  <a class="spectrum-Breadcrumbs-itemLink" href="#">Current Folder</a>
</li>
```

**Use cases:**
- File system navigation (device vs. cloud)
- Multi-level product navigation
- Content management hierarchies

### Drag and drop

Breadcrumbs can support drag and drop functionality.

**CSS class:**
- `.is-dragged` on dragged item

**Guidelines:**
- Allow dragging breadcrumb items to other locations
- Visual feedback during drag
- Useful for file/folder organization

### Disabled state

**CSS class:**
- `.is-disabled` on link
- `[disabled]` on action button

**Guidelines:**
- Shows navigation option exists but is unavailable
- Useful when access is restricted
- Maintains layout consistency

## Side navigation

Side nav lets users navigate the entire content of a product or section. Supports single-level or multi-level navigation.

**Reference:** [Side Nav - Spectrum](https://spectrum.adobe.com/page/side-navigation/)

**CSS classes:**
- `.spectrum-SideNav`
- `.spectrum-SideNav-item`
- `.spectrum-SideNav-itemLink`
- `.spectrum-SideNav-link-text`
- `.spectrum-SideNav-heading` (for section headers)

**Custom properties:**
```css
--spectrum-sidenav-item-background-color-default
--spectrum-sidenav-item-background-color-hover
--spectrum-sidenav-item-background-color-selected
--spectrum-sidenav-item-color-default
--spectrum-sidenav-item-color-selected
```

### Single-level navigation

**HTML structure:**
```html
<nav class="spectrum-SideNav">
  <ul class="spectrum-SideNav-list">
    <li class="spectrum-SideNav-item">
      <a class="spectrum-SideNav-itemLink" href="#">
        <svg class="spectrum-Icon"><!-- optional icon --></svg>
        <span class="spectrum-SideNav-link-text">Section 1</span>
      </a>
    </li>
    <li class="spectrum-SideNav-item is-selected">
      <a class="spectrum-SideNav-itemLink" href="#" aria-current="page">
        <svg class="spectrum-Icon"><!-- optional icon --></svg>
        <span class="spectrum-SideNav-link-text">Section 2</span>
      </a>
    </li>
  </ul>
</nav>
```

**Guidelines:**
- Use for simple navigation structures
- One level of hierarchy
- Clear section delineation
- Icons optional but helpful

### Multi-level navigation

**HTML structure:**
```html
<nav class="spectrum-SideNav">
  <ul class="spectrum-SideNav-list">
    <li class="spectrum-SideNav-item">
      <a class="spectrum-SideNav-itemLink" href="#">Parent Section</a>
      <ul class="spectrum-SideNav">
        <li class="spectrum-SideNav-item is-selected">
          <a class="spectrum-SideNav-itemLink" href="#" aria-current="page">
            <span class="spectrum-SideNav-link-text">Child Section</span>
          </a>
        </li>
      </ul>
    </li>
  </ul>
</nav>
```

**Guidelines:**
- Nest `.spectrum-SideNav` within parent items
- Support for multiple nesting levels
- Parent items can be clickable or just labels
- Maintain consistent indentation

### With icons

Icons can clarify navigation items and add visual interest.

**Guidelines:**
- Use workflow icons
- Icons should reinforce meaning, not decorate
- Apply to first-level items typically
- Size matches component size

### States

**Selected:**
- `.is-selected` class
- `aria-current="page"` on link
- Indicates current location

**Disabled:**
- `.is-disabled` class
- Shows option exists but unavailable

**Hover/Focus:**
- Automatic styling
- Clear feedback for interactivity

## Pagination

Displays numbered buttons or input field to allow navigation through pages of content.

**Reference:** [Pagination - Spectrum](https://spectrum.adobe.com/page/pagination/)

**CSS classes:**
- `.spectrum-Pagination`
- `.spectrum-Pagination-counter`
- `.spectrum-Pagination-input`

**Custom properties:**
```css
--spectrum-pagination-button-background-color
--spectrum-pagination-button-background-color-hover
--spectrum-pagination-button-background-color-selected
```

### Listing variant (default)

Uses action buttons for each page number.

**HTML structure:**
```html
<nav class="spectrum-Pagination" role="navigation" aria-label="Pagination">
  <button class="spectrum-ActionButton" disabled aria-label="Previous page">
    <svg class="spectrum-Icon"><!-- previous icon --></svg>
  </button>

  <button class="spectrum-ActionButton is-selected" aria-label="Page 1, current page" aria-current="page">
    <span class="spectrum-ActionButton-label">1</span>
  </button>
  <button class="spectrum-ActionButton" aria-label="Page 2">
    <span class="spectrum-ActionButton-label">2</span>
  </button>
  <button class="spectrum-ActionButton" aria-label="Page 3">
    <span class="spectrum-ActionButton-label">3</span>
  </button>

  <button class="spectrum-ActionButton" aria-label="Next page">
    <svg class="spectrum-Icon"><!-- next icon --></svg>
  </button>
</nav>
```

**Guidelines:**
- Show previous/next arrows
- Display page numbers as buttons
- Highlight current page
- Use ellipsis (...) for truncated ranges
- Disable prev/next at boundaries

**Truncation patterns:**
- Show first page, last page, and pages near current
- `1 ... 5 6 [7] 8 9 ... 20`
- Always show context around current page

### Explicit variant

Uses text field for current page and displays total pages.

**CSS class:**
- `.spectrum-Pagination--explicit`

**HTML structure:**
```html
<nav class="spectrum-Pagination spectrum-Pagination--explicit">
  <button class="spectrum-ActionButton" aria-label="Previous page">
    <svg class="spectrum-Icon"><!-- previous icon --></svg>
  </button>

  <div class="spectrum-Pagination-counter">
    <input type="text" class="spectrum-Textfield" value="1" aria-label="Current page" />
    <span class="spectrum-Body spectrum-Body--sizeM">of 10 pages</span>
  </div>

  <button class="spectrum-ActionButton" aria-label="Next page">
    <svg class="spectrum-Icon"><!-- next icon --></svg>
  </button>
</nav>
```

**Guidelines:**
- Use when total page count is large
- Allows direct page input
- Shows total page count
- More compact than listing variant
- Better for known page destinations

### Sizing

Pagination components should match the size of related UI elements.

**Size classes:**
- `.spectrum-Pagination--sizeS`
- `.spectrum-Pagination--sizeM` (default)
- `.spectrum-Pagination--sizeL`
- `.spectrum-Pagination--sizeXL`

## Tree view

Displays hierarchical data in a tree structure, allowing users to expand and collapse nodes.

**Reference:** [Tree View - Spectrum](https://spectrum.adobe.com/page/tree-view/)

**CSS classes:**
- `.spectrum-TreeView`
- `.spectrum-TreeView-item`
- `.spectrum-TreeView-itemLink`
- `.spectrum-TreeView-indicator` (chevron for expandable items)
- `.spectrum-TreeView-icon` (optional content icon)

**Custom properties:**
```css
--spectrum-treeview-item-background-color-default
--spectrum-treeview-item-background-color-hover
--spectrum-treeview-item-background-color-selected
--spectrum-treeview-item-color-default
--spectrum-treeview-item-color-selected
--spectrum-treeview-indent
```

### Default (nested markup)

**HTML structure:**
```html
<ul class="spectrum-TreeView">
  <li class="spectrum-TreeView-item">
    <a class="spectrum-TreeView-itemLink" href="#">
      <span class="spectrum-TreeView-itemLabel">Item 1</span>
    </a>
  </li>
  <li class="spectrum-TreeView-item is-open">
    <a class="spectrum-TreeView-itemLink" href="#">
      <svg class="spectrum-TreeView-indicator"><!-- chevron --></svg>
      <span class="spectrum-TreeView-itemLabel">Group 1</span>
    </a>
    <ul class="spectrum-TreeView">
      <li class="spectrum-TreeView-item is-selected">
        <a class="spectrum-TreeView-itemLink" href="#" aria-current="page">
          <span class="spectrum-TreeView-itemLabel">Child Item</span>
        </a>
      </li>
    </ul>
  </li>
</ul>
```

**Guidelines:**
- Nest `.spectrum-TreeView` within parent items
- `.is-open` shows expanded state
- Chevron indicates expandable items
- Selected state with `.is-selected` and `aria-current="page"`
- Spans full width of container by default

### Variants

**Detached:**
- `.spectrum-TreeView--detached`
- Used outside of panels
- Rounded corners on items
- More visual separation

**Quiet:**
- `.spectrum-TreeView--quiet`
- Less visual emphasis on selection
- Subtle selected state
- Good for dense layouts

**Thumbnail:**
- `.spectrum-TreeView--thumbnail`
- Shows preview images
- Useful for layer panels, file browsers
- Thumbnails before labels

### Flat markup (for infinite scroll)

For performance with large trees, use flat markup with indent classes.

**CSS classes:**
- `.spectrum-TreeView-item--indent1`
- `.spectrum-TreeView-item--indent2`
- `.spectrum-TreeView-item--indent3`
- (continues as needed)

**HTML structure:**
```html
<ul class="spectrum-TreeView">
  <li class="spectrum-TreeView-item">
    <a class="spectrum-TreeView-itemLink" href="#">Level 0 Item</a>
  </li>
  <li class="spectrum-TreeView-item is-open">
    <a class="spectrum-TreeView-itemLink" href="#">
      <svg class="spectrum-TreeView-indicator"><!-- chevron --></svg>
      Level 0 Parent
    </a>
  </li>
  <li class="spectrum-TreeView-item spectrum-TreeView-item--indent1">
    <a class="spectrum-TreeView-itemLink" href="#">Level 1 Child</a>
  </li>
  <li class="spectrum-TreeView-item spectrum-TreeView-item--indent2">
    <a class="spectrum-TreeView-itemLink" href="#">Level 2 Grandchild</a>
  </li>
</ul>
```

**Guidelines:**
- Better for virtual scrolling
- Manage visibility manually
- Apply numbered indent classes
- No actual DOM nesting

### With icons

Icons clarify content types in tree views.

**Guidelines:**
- Use for file browsers (folder/document icons)
- Use for content type indication
- Icon precedes label
- Size matches tree view size

### With thumbnails

**CSS class:**
- `.spectrum-TreeView--thumbnail`

**Guidelines:**
- Shows image preview before label
- Common in layer panels
- Use thumbnail component
- Supports both layer and default thumbnail variants

### Text truncation

Long labels truncate with ellipsis when tree view has constrained width.

**Guidelines:**
- Requires set `max-inline-size`
- Full text shown in tooltip
- Prevents horizontal scrolling
- Maintains tree structure readability

### Drop targets

For drag and drop functionality.

**CSS class:**
- `.is-drop-target`

**Guidelines:**
- Indicates valid drop location
- Visual feedback during drag
- Useful for file/content organization

## Accessibility

### Breadcrumbs
- Use `role="navigation"` and `aria-label="Breadcrumb"`
- Mark current page with `aria-current="page"`
- Ensure keyboard navigation between links
- Provide text alternatives for separator icons

### Side navigation
- Use semantic `<nav>` element
- Mark current page with `aria-current="page"`
- Support keyboard navigation (Tab, Enter)
- Announce expanded/collapsed state for multi-level nav
- Use `aria-expanded` for expandable sections

### Pagination
- Use `role="navigation"` and descriptive `aria-label`
- Provide labels for prev/next buttons
- Announce current page and total pages
- Disable prev/next at boundaries
- Support keyboard navigation

### Tree view
- Use appropriate ARIA roles (`tree`, `treeitem`, `group`)
- Use `aria-expanded` for expandable items
- Use `aria-selected` for selected items
- Support keyboard navigation (Arrow keys, Enter, Space)
- Announce hierarchy level to screen readers

## Best practices

### Choosing navigation patterns

**Use breadcrumbs when:**
- Showing hierarchical path to current location
- User needs to navigate up the hierarchy
- Context of location is important
- Multi-level content structure

**Use side navigation when:**
- Primary navigation for section/application
- Multiple top-level sections
- Consistent navigation across views
- Vertical space available

**Use pagination when:**
- Large data sets split across pages
- Linear progression through content
- Known page structure
- Search results or listings

**Use tree view when:**
- Hierarchical data browsing
- File/folder structures
- Nested content organization
- Expandable/collapsible groups needed

### Mobile considerations
- Breadcrumbs may need truncation on narrow screens
- Side nav often converts to hamburger menu
- Pagination buttons need adequate touch targets
- Tree views work well on mobile with touch gestures

## Related patterns

- [Menu patterns](./menu-patterns.md)
- [Selection patterns](./selection-patterns.md)
- [State patterns](./state-patterns.md)
- [Text overflow patterns](./text-overflow-patterns.md)
