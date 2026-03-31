export const BRANCH_DATA = {
    'cse': {
        name: 'CSE',
        fullName: 'Computer Science & Engineering',
        icon: 'Cpu',
        domains: [
            {
                id: 'web-dev',
                name: 'Web Development',
                description: 'Full-stack development for modern web apps.',
                chapters: [
                    {
                        id: 'html-basics',
                        topic: 'HTML Basics',
                        desc: 'Learn the fundamentals of structuring the web.',
                        sections: [
                            {
                                title: "Introduction to HTML",
                                content: "HTML stands for HyperText Markup Language. It is used to structure content on the web. Browsers interpret HTML to render webpages."
                            },
                            {
                                title: "Basic HTML Document Structure",
                                content: "An HTML document follows a standard structure:\n\n- `<!DOCTYPE html>`: Declares the document type.\n- `<html>`: The root element.\n- `<head>`: Contains metadata (e.g., `<title>`).\n- `<body>`: Contains the visible content."
                            },
                            {
                                title: "Elements and Tags",
                                content: "HTML is built using tags. Tags usually come in pairs: opening (`<tag>`) and closing (`</tag>`).\n\n- **Opening tags**: Start an element.\n- **Closing tags**: End an element.\n- **Self-closing tags**: Elements like `<img>` or `<br>` that don't need a closing tag.\n- **Attributes**: Provide additional information (e.g., `<a href='...'>`)."
                            },
                            {
                                title: "Common Elements",
                                content: "Example elements:\n- `<p>`: Paragraph\n- `<h1>` to `<h6>`: Headings\n- `<img>`: Image\n- `<a>`: Link\n- `<div>`: Container\n- `<span>`: Inline text"
                            },
                            {
                                title: "Headings and Text Formatting",
                                content: "Use `<h1>` for main titles and `<h6>` for smallest headers. Use `<strong>` for bold and `<em>` for italics. `<br>` is for breaks and `<hr>` for horizontal lines."
                            },
                            {
                                title: "Lists",
                                content: "- `<ul>`: Unordered (bulleted) list.\n- `<ol>`: Ordered (numbered) list.\n- `<li>`: List item (used inside `<ul>` or `<ol>`)."
                            },
                            {
                                title: "Links and Images",
                                content: "- `<a href='URL' target='_blank'>`: Create external links.\n- `<img src='URL' alt='description'>`: Embed images with alternative text."
                            },
                            {
                                title: "Forms Basics",
                                content: "Forms are used to collect user input.\n- `<form>`: The wrapper for form elements.\n- `<input>`: Various types like 'text', 'password', 'submit'.\n- `<label>`: Descriptive text for an input.\n- `<button>`: Trigger actions."
                            }
                        ],
                        video: 'https://www.youtube.com/embed/UB1O30fR-EE',
                        resources: [
                            { name: 'HTML Basics Notes (PDF)', url: '/resources/html-basics-notes.pdf' }
                        ]
                    },
                    {
                        id: 'advanced-html',
                        topic: 'Advanced HTML',
                        desc: 'Master semantic structures, multimedia, and HTML5 APIs.',
                        sections: [
                            {
                                title: "Semantic HTML",
                                content: "Semantic elements clearly describe their meaning in a human- and machine-readable way.\n\nKey elements:\n- `<header>`: Introductory content or navigation links.\n- `<nav>`: Navigation links.\n- `<section>`: A thematic grouping of content.\n- `<article>`: Self-contained composition (e.g., blog post).\n- `<aside>`: Content indirectly related to the main content (e.g., sidebars).\n- `<footer>`: Footer for its nearest sectioning content.\n\n**Benefits**: Improves SEO (Search Engine Optimization) and Accessibility for screen readers."
                            },
                            {
                                title: "Tables",
                                content: "Tables are used to display tabular data.\n\nStructure:\n- `<table>`: Wrapper.\n- `<thead>`, `<tbody>`, `<tfoot>`: Grouping header, body, and footer content.\n- `<tr>`: Table row.\n- `<th>`: Header cell (bold/centered by default).\n- `<td>`: Standard data cell.\n- `colspan` & `rowspan`: Attributes to span multiple columns or rows."
                            },
                            {
                                title: "Advanced Forms",
                                content: "Better data collection with varied input types and validation.\n\n- **Input Types**: `email`, `password`, `number`, `date`, `file`, `radio`, `checkbox`.\n- **Other Elements**: `<textarea>` (multi-line), `<select>` (dropdowns).\n- **Attributes**: `required` (mandatory), `pattern` (Regular Expression validation)."
                            },
                            {
                                title: "Multimedia",
                                content: "Embedding audio and video directly in the browser.\n\n- `<audio>` & `<video>`: Primary tags.\n- `<source>`: Specify multiple formats for compatibility.\n- **Attributes**: `controls` (play/pause buttons), `autoplay`, `loop`."
                            },
                            {
                                title: "Meta Tags & SEO",
                                content: "Metadata provides info about the document to browsers and search engines.\n\n- `<meta charset='UTF-8'>`: Character encoding.\n- `<meta name='description' content='...'>`: Summary for search results.\n- **Viewport Meta**: `<meta name='viewport' content='width=device-width, initial-scale=1.0'>` (Essential for mobile responsiveness)."
                            },
                            {
                                title: "Accessibility",
                                content: "Making the web usable for everyone.\n\n- **alt attribute**: Text description for images.\n- **aria-label**: Descriptive label for screen readers.\n- **label for**: Links a label to an input by its ID."
                            },
                            {
                                title: "HTML5 APIs Overview",
                                content: "Modern browsers provide powerful APIs for web apps:\n\n- **Geolocation API**: Get the user's physical location.\n- **Local Storage**: Store data in the browser that persists after closing.\n- **Session Storage**: Store data that lasts only for the duration of the page session."
                            }
                        ],
                        video: 'https://www.youtube.com/embed/qz0aGYrrlhU',
                        resources: [
                            { name: 'Advanced HTML Notes (PDF)', url: '/resources/advanced-html-notes.pdf' }
                        ]
                    },
                    {
                        id: 'css-basics',
                        topic: 'CSS Basics',
                        desc: 'Learn to style web pages with colors, layouts, and the box model.',
                        sections: [
                            {
                                title: "Introduction to CSS",
                                content: "CSS (Cascading Style Sheets) is used to style and design web pages. It controls layout, colors, fonts, spacing, and responsiveness.\n\n**Why CSS?**\n- Separation of content (HTML) and design (CSS).\n- Easier maintenance and consistency across multiple pages."
                            },
                            {
                                title: "Ways to Add CSS",
                                content: "1. **Inline CSS**: Defined directly within an HTML tag using the `style` attribute.\n2. **Internal CSS**: Defined in the `<style>` tag within the `<head>` section.\n3. **External CSS**: Defined in a separate `.css` file and linked using the `<link>` tag (Best Practice)."
                            },
                            {
                                title: "Selectors",
                                content: "Selectors point to the HTML elements you want to style.\n\n- **Element Selector**: `p { color: blue; }` targets all `<p>` tags.\n- **Class Selector**: `.btn { ... }` targets elements with `class='btn'`.\n- **ID Selector**: `#header { ... }` targets the element with `id='header'`.\n- **Universal**: `* { ... }` targets everything."
                            },
                            {
                                title: "Colors & Units",
                                content: "**Colors**:\n- Named: `red`, `blue`.\n- HEX: `#ff0000`.\n- RGB: `rgb(255, 0, 0)`.\n\n**Units**:\n- Absolute: `px` (Pixels).\n- Relative: `em` (parent size), `rem` (root size), `%` (percentage of parent)."
                            },
                            {
                                title: "Box Model",
                                content: "Every HTML element is considered a box.\n\n1. **Content**: The actual text or images.\n2. **Padding**: Space between content and border (inside).\n3. **Border**: The line around the padding and content.\n4. **Margin**: Space outside the border (spacing between elements)."
                            },
                            {
                                title: "Display Property",
                                content: "- **block**: Starts on a new line (e.g., `<div>`, `<h1>`).\n- **inline**: Only takes up necessary width, no new line (e.g., `<span>`, `<a>`).\n- **inline-block**: Like inline but allows setting width/height.\n- **none**: Hides the element completely."
                            },
                            {
                                title: "Positioning",
                                content: "- **static**: Default flow.\n- **relative**: Adjusted from its normal position.\n- **absolute**: Positioned relative to its nearest positioned ancestor.\n- **fixed**: Fixed relative to the viewport (stays while scrolling).\n- **sticky**: Toggles between relative and fixed based on scroll position."
                            }
                        ],
                        video: 'https://www.youtube.com/embed/1PnVor36_40',
                        resources: [
                            { name: 'CSS Basics Notes (PDF)', url: '/resources/css-basics-notes.pdf' }
                        ]
                    },
                    {
                        id: 'flexbox-grid',
                        topic: 'Flexbox & CSS Grid',
                        desc: 'Master modern layouts using Flexbox and CSS Grid.',
                        sections: [
                            {
                                title: "Introduction to Modern Layouts",
                                content: "Floating elements and `inline-block` were once the standard for layouts, but they were often cumbersome and required 'hacks' like clearfix. Modern CSS provides Flexbox and Grid, which are designed specifically for building complex, responsive layouts with ease."
                            },
                            {
                                title: "Flexbox Basics",
                                content: "Flexbox (Flexible Box Layout) is a one-dimensional layout model.\n\n**Key Container Properties:**\n- `display: flex`: Activates flex mode.\n- `flex-direction`: Sets main axis (`row`, `column`).\n- `justify-content`: Aligns items along the **main axis**.\n- `align-items`: Aligns items along the **cross axis**.\n- `align-content`: Aligns multi-line flex rows.\n- `flex-wrap`: Allows items to wrap into new lines.\n- `gap`: Sets space between items.\n\n**Axis Concept:**\n- **Main Axis**: The primary direction of items (defined by `flex-direction`).\n- **Cross Axis**: The perpendicular direction."
                            },
                            {
                                title: "Flex Item Properties",
                                content: "Control individual item behavior:\n- `flex-grow`: Ability for an item to grow if space is available.\n- `flex-shrink`: Ability for an item to shrink if space is tight.\n- `flex-basis`: Initial size of an item before space distribution.\n- `order`: Changes the visual order of items.\n- `align-self`: Overrides `align-items` for a specific item."
                            },
                            {
                                title: "Common Flexbox Layout Patterns",
                                content: "1. **Centering**: `justify-content: center` + `align-items: center`.\n2. **Navigation Bars**: Using `justify-content: space-between`.\n3. **Card Layouts**: Using `flex-wrap: wrap` and `gap`."
                            },
                            {
                                title: "CSS Grid Basics",
                                content: "CSS Grid is a two-dimensional layout system.\n\n**Core Concepts:**\n- `display: grid`: Creates a grid container.\n- `grid-template-columns` / `grid-template-rows`: Define the tracks.\n- `fr unit`: Fractional unit representing a portion of the available space.\n- `repeat()`: Shorthand for repeating track patterns.\n- `gap`: Spacing between grid cells."
                            },
                            {
                                title: "Grid Advanced Concepts",
                                content: "- `grid-column` / `grid-row`: Control item placement and spanning.\n- `grid-area`: Names a grid cell or spans multiple lines.\n- `auto-fit` vs `auto-fill`: Dynamic tracking for responsive layouts.\n- `minmax()`: Sets a size range (e.g., `minmax(200px, 1fr)`)."
                            },
                            {
                                title: "Flexbox vs Grid",
                                content: "- **Flexbox**: Best for one-dimensional layouts (a row OR a column) and content-driven designs.\n- **Grid**: Best for two-dimensional layouts (rows AND columns) and layout-driven designs."
                            }
                        ],
                        video: 'https://www.youtube.com/embed/JJSoEo8JSnc',
                        resources: [
                            { name: 'Flexbox & Grid Notes (PDF)', url: '/resources/flexbox-grid-notes.pdf' }
                        ]
                    },
                    {
                        id: 'javascript-basics',
                        topic: 'JavaScript Basics',
                        desc: 'Master the fundamentals of the most popular programming language on the web.',
                        sections: [
                            {
                                title: "Introduction to JavaScript",
                                content: "JavaScript is a versatile, high-level programming language used to create interactive content on websites. It is an essential part of web development alongside HTML and CSS.\n\n**Where it runs:**\n- **Browsers**: Native support in all modern browsers.\n- **Servers**: Using Node.js.\n\n**How to include it:**\n1. **Internal**: `<script>` tag in HTML.\n2. **External**: `<script src='file.js'></script>` (Best practice)."
                            },
                            {
                                title: "Variables",
                                content: "Variables store data. Modern JavaScript uses three keywords:\n- `var`: Function-scoped (older way, avoids unless necessary).\n- `let`: Block-scoped, allowed to change value.\n- `const`: Block-scoped, value cannot be reassigned."
                            },
                            {
                                title: "Data Types",
                                content: "JS is dynamically typed. Common types:\n- `string`: Textual data (e.g., 'Hello').\n- `number`: Integers and decimals.\n- `boolean`: `true` or `false`.\n- `null`: Represents 'no value'.\n- `undefined`: Variable declared but not assigned."
                            },
                            {
                                title: "Operators",
                                content: "- **Arithmetic**: `+`, `-`, `*`, `/`, `%`.\n- **Comparison**: `==`, `===`, `!=`, `!==`, `<`, `>`.\n- **Logical**: `&&` (AND), `||` (OR), `!` (NOT)."
                            },
                            {
                                title: "Conditional Statements",
                                content: "Control the flow of execution:\n- `if...else`: Basic branching.\n- `else if`: Multiple conditions.\n- `switch`: Efficiently check against multiple constant values."
                            },
                            {
                                title: "Loops",
                                content: "Repeat actions:\n- `for`: Best for known iterations.\n- `while`: Continues while a condition is true.\n- `do-while`: Runs at least once, then checks condition."
                            },
                            {
                                title: "Functions",
                                content: "Reusable blocks of code:\n- **Declaration**: `function name() { ... }`.\n- **Expression**: `const name = function() { ... }`.\n- **Parameters**: Inputs passed to the function.\n- **Return**: Sends a value back to the caller."
                            },
                            {
                                title: "Arrays",
                                content: "Ordered lists of elements:\n- **Creation**: `const fruits = ['apple', 'banana'];`.\n- **Access**: `fruits[0]`.\n- **Methods**: `push` (add to end), `pop` (remove from end), `shift` (remove from start), `unshift` (add to start)."
                            },
                            {
                                title: "Objects",
                                content: "Key-value pair collections:\n- **Creation**: `const user = { name: 'Alex', age: 25 };`.\n- **Access**: `user.name` or `user['name']`.\n- **Modify**: `user.age = 26;`."
                            },
                            {
                                title: "Scope Basics",
                                content: "- **Global Scope**: Accessible everywhere.\n- **Local Scope**: Inside a function.\n- **Block Scope**: Inside `{ }` (only for `let` and `const`)."
                            }
                        ],
                        video: 'https://www.youtube.com/embed/W6NZfCO5SIk',
                        resources: [
                            { name: 'JavaScript Basics Notes (PDF)', url: '/resources/javascript-basics-notes.pdf' }
                        ]
                    },
                    {
                        id: 'advanced-javascript',
                        topic: 'Advanced JavaScript',
                        desc: 'Master professional-level JavaScript including Scope, Closures, Promises, and Async/Await.',
                        sections: [
                            {
                                title: "Scope & Closures",
                                content: "**Lexical Scope**: JavaScript uses lexical scoping, meaning the accessibility of variables is determined by their position within the source code.\n\n**Closures**: A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment).\n- **Example**: A function returned from another function that 'remembers' its outer variables.\n- **Use Cases**: Data privacy (private variables), functional programming, and callback functions."
                            },
                            {
                                title: "Hoisting",
                                content: "**Hoisting** is JavaScript's default behavior of moving declarations to the top of the current scope.\n- **var**: Hoisted and initialized with `undefined`.\n- **let/const**: Hoisted but stay in the **Temporal Dead Zone (TDZ)** until the declaration is reached.\n- **Functions**: Declarations are fully hoisted; expressions are not."
                            },
                            {
                                title: "The 'this' Keyword",
                                content: "The value of `this` depends on HOW a function is called.\n- **Global Context**: Refers to the `window` (browser) or `global` (Node.js).\n- **In Objects**: Refers to the object itself.\n- **Arrow Functions**: Do NOT have their own `this`; they inherit it from the parent scope."
                            },
                            {
                                title: "ES6 Features",
                                content: "Modern JS features that improve readability and efficiency:\n- **Arrow Functions**: Concise syntax `() => {}`.\n- **Destructuring**: Extracting data from arrays/objects effortlessly.\n- **Spread/Rest**: `...` operator for expanding or gathering elements.\n- **Template Literals**: Backticks for string interpolation `${}`."
                            },
                            {
                                title: "Modules",
                                content: "Modular code organization using `import` and `export`.\n- **Named Exports**: `export const x = 10;` (must use curly braces to import).\n- **Default Exports**: `export default x;` (one per module, flexible naming on import)."
                            },
                            {
                                title: "DOM Manipulation & Events",
                                content: "Interacting with the browser:\n- **Selection**: `querySelector`, `getElementById`.\n- **Creation**: `createElement`, `appendChild`.\n- **Events**: `addEventListener` to handle user interactions.\n- **Bubbling/Delegation**: Understanding how events propagate up the DOM tree."
                            },
                            {
                                title: "Asynchronous JavaScript",
                                content: "Handling tasks that take time (like API calls):\n- **Promises**: Objects representing the eventual completion (or failure) of an async operation.\n- **Async/Await**: Syntactic sugar for promises that makes async code look synchronous.\n- **Try/Catch**: Essential for error handling in async flows."
                            },
                            {
                                title: "Fetch API",
                                content: "`fetch()` is the modern way to make network requests.\n- Returns a Promise.\n- Requires parsing with `.json()` to access the data body.\n- Handles response statuses and network errors."
                            }
                        ],
                        video: 'https://www.youtube.com/embed/PoRJizFvM7s',
                        resources: [
                            { name: 'Advanced JavaScript Notes (PDF)', url: '/resources/advanced-javascript-notes.pdf' }
                        ]
                    },
                    {
                        id: 'react',
                        topic: 'React',
                        desc: 'Master the most popular library for building modern, dynamic user interfaces.',
                        sections: [
                            {
                                title: "Introduction to React",
                                content: "React is a JavaScript library for building user interfaces, primarily for Single Page Applications (SPAs).\n\n**Key Concepts:**\n- **Virtual DOM**: React creates an in-memory data-structure cache which computes the changes made before updating the browser's DOM.\n- **Component-Based**: Build encapsulated components that manage their own state."
                            },
                            {
                                title: "Setting Up React",
                                content: "- **Vite**: The modern, fast way to scaffold React projects.\n- **create-react-app**: The legacy way (older tutorials might use this).\n- **Structure**: Typical projects have `src`, `public`, `index.html`, and `App.js`."
                            },
                            {
                                title: "JSX (JavaScript XML)",
                                content: "JSX allows you to write HTML-like code inside JavaScript.\n- **Rules**: Must return a single root element (or Fragment `<>`).\n- **Expressions**: Wrap JS logic in curly braces `{}`.\n- **Attributes**: Use `className` instead of `class`."
                            },
                            {
                                title: "Components & Props",
                                content: "**Components** are reusable UI pieces.\n- **Functional Components**: Simple JS functions that return JSX.\n- **Props**: Inputs to components, passed like HTML attributes. They are read-only (immutable)."
                            },
                            {
                                title: "State & useState",
                                content: "**State** is data that changes over time within a component.\n- **useState**: A hook that returns a state variable and an updater function.\n- **Example**: `const [count, setCount] = useState(0);`"
                            },
                            {
                                title: "Event Handling",
                                content: "- Use camelCase for events (e.g., `onClick`, `onChange`).\n- Pass functions as event handlers: `onClick={handleClick}`."
                            },
                            {
                                title: "Conditional Rendering & Lists",
                                content: "- **Conditional**: Use ternary operators `? :` or logical `&&`.\n- **Lists**: Use `.map()` to iterate over arrays and return JSX.\n- **Keys**: Always provide a unique `key` prop to list items for performance."
                            },
                            {
                                title: "The useEffect Hook",
                                content: "Used for side effects like data fetching or DOM manipulation.\n- **Dependency Array**: Controls when the effect runs (`[]` for mount only, `[val]` for when `val` changes)."
                            },
                            {
                                title: "Forms (Controlled Components)",
                                content: "In a controlled component, form data is handled by a React component's state.\n- Every input change updates the state via `onChange`."
                            },
                            {
                                title: "React Router Basics",
                                content: "For navigation in SPAs without page refreshes.\n- **Components**: `BrowserRouter`, `Routes`, `Route`, `Link`.\n- **Hooks**: `useParams` for dynamic URL segments."
                            }
                        ],
                        video: 'https://www.youtube.com/embed/SqcY0GlETPk',
                        resources: [
                            { name: 'React Notes (PDF)', url: '/resources/react-notes.pdf' }
                        ]
                    },
                    {
                        id: 'node-js',
                        topic: 'Node.js',
                        desc: 'Learn how to build scalable server-side applications with JavaScript.',
                        sections: [
                            {
                                title: "Introduction to Node.js",
                                content: "Node.js is an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside a web browser. It is built on Google Chrome's V8 JavaScript engine.\n\n**Why use Node.js?**\n- **Fast**: High performance thanks to V8.\n- **Scalable**: Ideal for data-intensive real-time applications.\n- **Unfied Stack**: Use JavaScript for both frontend and backend."
                            },
                            {
                                title: "Node.js Architecture",
                                content: "Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.\n- **Single-Threaded**: Operates on a single main thread for performance.\n- **Event Loop**: Handles asynchronous operations by offloading them to the system or thread pool.\n- **Non-blocking**: Doesn't wait for I/O tasks to finish; uses callbacks or promises instead."
                            },
                            {
                                title: "Installing Node & npm",
                                content: "- **Node.js**: Install from nodejs.org (LTS version recommended).\n- **npm (Node Package Manager)**: Bundled with Node, used to install and manage libraries.\n- **package.json**: The manifest file for your project, defining dependencies and scripts."
                            },
                            {
                                title: "Modules in Node",
                                content: "Node.js handles code organization through modules.\n- **Built-in Modules**: No installation needed (e.g., `fs`, `http`, `path`).\n- **Exports**: Use `module.exports` or `exports` to share code.\n- **Imports**: Use `require()` to bring in other modules."
                            },
                            {
                                title: "File System (fs Module)",
                                content: "The `fs` module allows you to interact with the file system.\n- **Async (Recommended)**: `fs.readFile('path', callback)`.\n- **Sync**: `fs.readFileSync('path')` (Blocks execution).\n- **Writing**: `fs.writeFile` overwrites data; `fs.appendFile` adds to it."
                            },
                            {
                                title: "HTTP Module",
                                content: "Create web servers without external frameworks.\n- `http.createServer((req, res) => { ... })`: Defines how to handle requests.\n- `req`: Incoming message (method, URL, headers).\n- `res`: Outgoing message (status code, body)."
                            },
                            {
                                title: "Streams & Buffers",
                                content: "Efficiently handle large datasets.\n- **Buffer**: A temporary storage area for binary data.\n- **Stream**: A continuous flow of data. Can be **Readable** (read from), **Writable** (write to), **Duplex**, or **Transform**."
                            },
                            {
                                title: "Environment Variables",
                                content: "Store configuration and secrets securely.\n- **process.env**: Access environment variables in your code.\n- **.env Files**: Use the `dotenv` package to load variables from a local file during development."
                            },
                            {
                                title: "Error Handling",
                                content: "Essential for server stability.\n- **Try/Catch**: Use for synchronous code and async/await.\n- **Error First Callbacks**: Standard pattern for Node.js async functions.\n- **Process Events**: Listen to `uncaughtException` for catastrophic failures."
                            }
                        ],
                        video: 'https://www.youtube.com/embed/TlB_eWDSMt4',
                        resources: [
                            { name: 'Node.js Notes (PDF)', url: '/resources/nodejs-notes.pdf' }
                        ]
                    },
                    {
                        id: 'express-js',
                        topic: 'Express.js',
                        desc: 'Master the most popular web framework for building APIs and web applications with Node.js.',
                        sections: [
                            {
                                title: "Introduction to Express",
                                content: "Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.\n\n**Why use Express?**\n- **Simplifies Routing**: Easy to define endpoints for different HTTP methods.\n- **Middleware Support**: Allows you to plug in various functionalities (logging, security, parsing).\n- **High Performance**: Lightweight layer on top of Node.js."
                            },
                            {
                                title: "Installing Express",
                                content: "To start using Express, initialize your project and install the package:\n1. `npm init -y` (Initializes project)\n2. `npm install express` (Installs Express library)\n3. Create an entry file (e.g., `index.js`)."
                            },
                            {
                                title: "Creating a Server",
                                content: "A basic Express server requires just a few lines of code:\n```javascript\nconst express = require('express');\nconst app = express();\n\napp.listen(3000, () => {\n  console.log('Server running on port 3000');\n});\n```"
                            },
                            {
                                title: "Routing",
                                content: "Routing refers to determining how an application responds to a client request to a particular endpoint.\n- **GET**: Retrieve data.\n- **POST**: Send data.\n- **PUT/PATCH**: Update data.\n- **DELETE**: Remove data.\n- **Route Params**: Use tags like `:id` to capture dynamic values (e.g., `/users/:id`)."
                            },
                            {
                                title: "Middleware",
                                content: "Middleware functions are functions that have access to the request object (`req`), the response object (`res`), and the `next` middleware function in the application’s request-response cycle.\n- **app.use()**: Mounts middleware globally or on specific paths.\n- **next()**: Crucial to call if the middleware doesn't send a response, to avoid hanging."
                            },
                            {
                                title: "Request & Response Objects",
                                content: "- **req.params**: captures route segments.\n- **req.query**: captures URL query strings.\n- **req.body**: captures data sent in the request body (needs parsing).\n- **res.send()**: Sends various types of responses.\n- **res.json()**: Sends a JSON response (standard for APIs)."
                            },
                            {
                                title: "Express Router",
                                content: "Use `express.Router()` to create modular, mountable route handlers. This helps keep `index.js` clean as the application grows."
                            },
                            {
                                title: "Error Handling",
                                content: "Express comes with a built-in error handler. You can define custom error-handling middleware by adding a fourth argument (`err`) to the middleware function signature."
                            },
                            {
                                title: "REST API Basics",
                                content: "REST (Representational State Transfer) is an architectural style for designing networked applications. It relies on a stateless, client-server, cacheable communications protocol — almost always HTTP."
                            }
                        ],
                        video: 'https://www.youtube.com/embed/L72fhGm1tfE',
                        resources: [
                            { name: 'Express.js Notes (PDF)', url: '/resources/express-notes.pdf' }
                        ]
                    },
                    {
                        id: 'mongodb',
                        topic: 'MongoDB',
                        desc: 'Master the most popular NoSQL database for flexible and scalable data storage.',
                        sections: [
                            {
                                title: "Introduction to MongoDB",
                                content: "MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.\n\n**Key Features:**\n- **Document-oriented**: Stores data in BSON format (Binary JSON).\n- **High Performance**: Support for embedded data models reduces I/O activity on database system.\n- **High Availability**: MongoDB's replication facility, called replica sets, provides automatic failover and data redundancy."
                            },
                            {
                                title: "SQL vs NoSQL",
                                content: "Understanding the shift from relational to non-relational databases:\n- **Tables vs Collections**: In SQL, data is in tables; in MongoDB, it's in collections.\n- **Rows vs Documents**: Relational rows are replaced by BSON documents.\n- **Fixed vs Flexible Schema**: MongoDB doesn't require a predefined schema, allowing fields to vary between documents."
                            },
                            {
                                title: "MongoDB Structure",
                                content: "The hierarchy is simple and intuitive:\n1. **Database**: Container for collections.\n2. **Collection**: Group of MongoDB documents (like a table).\n3. **Document**: A record in a collection (like a row).\n4. **Field**: A key-value pair in a document (like a column).\n\n**Example Document:**\n```json\n{\n  \"_id\": \"507f1f77bcf86cd799439011\",\n  \"name\": \"John Doe\",\n  \"age\": 25,\n  \"skills\": [\"JavaScript\", \"MongoDB\"]\n}\n```"
                            },
                            {
                                title: "Installation & Setup",
                                content: "- **MongoDB Atlas**: The easiest way to get started. It's a fully managed cloud database.\n- **Cluster**: A group of servers that store your data.\n- **Connection String**: A URI used by applications to connect to your database instance."
                            },
                            {
                                title: "CRUD Operations",
                                content: "Create, Read, Update, and Delete are the fundamental operations:\n- `insertOne()` / `insertMany()`: Add new data.\n- `find()` / `findOne()`: Query data.\n- `updateOne()` / `updateMany()` / `replaceOne()`: Modify existing data using `$set`.\n- `deleteOne()` / `deleteMany()`: Remove data."
                            },
                            {
                                title: "Query Operators",
                                content: "Filter data effectively using operators:\n- **Comparison**: `$lt` (Less than), `$gt` (Greater than), `$eq` (Equals), `$ne` (Not equal).\n- **Logical**: `$and`, `$or`, `$not`, `$nor`.\n- **Element**: `$exists`, `$type`."
                            },
                            {
                                title: "Indexing",
                                content: "Indexes support the efficient execution of queries in MongoDB. Without indexes, MongoDB must perform a collection scan (scan every document) to select those documents that match the query statement.\n- Create an index using `db.collection.createIndex({ field: 1 })`."
                            },
                            {
                                title: "MongoDB with Node.js",
                                content: "Connect your backend to the database using the official MongoDB driver or an ODM like Mongoose.\n- Mongoose provides a straight-forward, schema-based solution to model your application data."
                            }
                        ],
                        video: 'https://www.youtube.com/embed/ofme2o29ngU',
                        resources: [
                            { name: 'MongoDB Notes (PDF)', url: '/resources/mongodb-notes.pdf' }
                        ]
                    }
                ]
            },
            { id: 'data-analytics', name: 'Data Analytics', description: 'Insights through data.' },
            {
                id: 'ml-ai',
                name: 'Machine Learning',
                description: 'Intelligent systems.',
                chapters: [
                    {
                        id: 'ml-foundations',
                        topic: 'Machine Learning Foundations',
                        desc: 'Understand the fundamental concepts of AI, Machine Learning, and how models learn from data.',
                        sections: [
                            {
                                title: "What is Machine Learning?",
                                content: "- **Definition**: Machine Learning (ML) is a subset of AI that provides systems the ability to automatically learn and improve from experience without being explicitly programmed.\n- **Programming vs ML**: Traditional programming involves manual rules + data to get output. ML takes data + output to find the rules.\n- **Examples**: Voice assistants, movie recommendations, image recognition."
                            },
                            {
                                title: "AI vs ML vs Deep Learning",
                                content: "- **Artificial Intelligence**: The broad field of creating intelligent machines.\n- **Machine Learning**: A subset focusing on statistical methods to enable learning.\n- **Deep Learning**: A subset of ML using multi-layered neural networks for complex patterns."
                            },
                            {
                                title: "Types of Machine Learning",
                                content: "- **Supervised Learning**: Learning with a teacher. Model learns from labeled data (e.g., Spam detection).\n- **Unsupervised Learning**: Learning without labels. Model finds hidden patterns or groups (e.g., Customer segmentation).\n- **Reinforcement Learning**: Learning through trial and error. Agent receives rewards for correct actions (e.g., Game playing bots)."
                            },
                            {
                                title: "Data & Features",
                                content: "- **Dataset**: Collection of data points.\n- **Features**: Individual measurable characteristics (Input variables, e.g., square footage of a house).\n- **Label/Target**: The outcome we want to predict (Output variable, e.g., price of the house)."
                            },
                            {
                                title: "Training & Testing",
                                content: "- **Train-Test Split**: Dividing data (usually 80/20) to ensure the model isn't just memorizing inputs.\n- **Generalization**: The goal is for the model to perform well on new, unseen data."
                            },
                            {
                                title: "Overfitting & Underfitting",
                                content: "- **Overfitting**: Model learns noise in the training data too well, failing on test data (High Variance).\n- **Underfitting**: Model is too simple to capture the underlying pattern (High Bias)."
                            },
                            {
                                title: "Evaluation Metrics",
                                content: "- **Accuracy**: Ratio of correct predictions to total predictions.\n- **Precision**: How many of the predicted positives are actually positive.\n- **Recall**: How many of the actual positives did we identify.\n- **Confusion Matrix**: A table showing correct vs incorrect predictions across categories."
                            },
                            {
                                title: "Bias-Variance Tradeoff",
                                content: "- **Bias**: Error from erroneous assumptions (leads to underfitting).\n- **Variance**: Error from sensitivity to small fluctuations (leads to overfitting).\n- **Goal**: Find the 'Sweet Spot' of model complexity to minimize total error."
                            },
                            {
                                title: "Basic Math for ML",
                                content: "- **Vectors & Matrices**: How data is represented numerically.\n- **Probability**: Dealing with uncertainty in predictions.\n- **Calculus (Gradients)**: Used by models to 'descend' toward lower errors during training."
                            }
                        ],
                        video: 'https://www.youtube.com/embed/GwIo3gDZCVQ',
                        resources: [
                            { name: 'ML Foundations Notes (PDF)', url: '/resources/ml-foundations-notes.pdf' }
                        ]
                    },
                    {
                        id: 'ml-algorithms',
                        topic: 'Machine Learning Core Algorithms',
                        desc: 'Master the essential supervised and unsupervised algorithms that power data science.',
                        sections: [
                            {
                                title: "Linear Regression",
                                content: "- **Concept**: Models the linear relationship between a dependent variable and one or more independent variables.\n- **Equation**: y = mx + c (Simple Linear Regression).\n- **Cost Function**: Usually Mean Squared Error (MSE). The goal is to minimize this error to find the 'Line of Best Fit'."
                            },
                            {
                                title: "Logistic Regression",
                                content: "- **Classification**: Despite its name, it's used for binary classification (Yes/No, 0/1).\n- **Sigmoid Function**: Maps any real-valued number into a value between 0 and 1, representing probability.\n- **Decision Boundary**: A threshold (usually 0.5) used to categorize outputs."
                            },
                            {
                                title: "K-Nearest Neighbors (KNN)",
                                content: "- **Instance-based**: A non-parametric method where the model 'remembers' the training data.\n- **Mechanism**: Classifies a new point based on the majority class of its 'K' nearest neighbors.\n- **Distance**: Commonly uses Euclidean distance to find neighbors."
                            },
                            {
                                title: "Decision Trees",
                                content: "- **Structure**: Flowchart-like structure consisting of nodes, branches, and leaves.\n- **Splitting**: Uses metrics like **Entropy** or **Gini Impurity** to decide how to split data at each node.\n- **Information Gain**: Measures the reduction in entropy after a dataset is split."
                            },
                            {
                                title: "Random Forest",
                                content: "- **Ensemble Learning**: Combines multiple Decision Trees to improve prediction accuracy.\n- **Bagging**: Each tree is trained on a random subset of data with replacement.\n- **Robustness**: Reduces the risk of overfitting by averaging the results of many trees."
                            },
                            {
                                title: "Naive Bayes",
                                content: "- **Probabilistic**: Based on Bayes' Theorem with a 'naive' assumption of independence between features.\n- **Efficiency**: Very fast and effective for text classification tasks like spam filtering."
                            },
                            {
                                title: "Support Vector Machine (SVM)",
                                content: "- **Hyperplane**: Finds the optimal boundary that maximizes the 'margin' between classes.\n- **Kernel Trick**: Allows SVM to handle non-linearly separable data by mapping it to a higher dimension."
                            },
                            {
                                title: "K-Means Clustering",
                                content: "- **Unsupervised**: Groups unlabeled data into 'K' clusters.\n- **Centroids**: Iteratively calculates the center of clusters and reassigns points based on proximity.\n- **Elbow Method**: A technique used to find the optimal number of clusters."
                            },
                            {
                                title: "Model Evaluation Techniques",
                                content: "- **Confusion Matrix**: Summary of prediction results (TP, TN, FP, FN).\n- **Cross-Validation**: Splitting data into folds to ensure consistent performance across the dataset.\n- **Bias-Variance Recap**: Balancing simplicity and complexity for the best generalization."
                            }
                        ],
                        video: 'https://www.youtube.com/embed/7eh4d6sabA0',
                        resources: [
                            { name: 'ML Algorithms Notes (PDF)', url: '/resources/ml-algorithms-notes.pdf' }
                        ]
                    },
                    {
                        id: 'ml-advanced',
                        topic: 'Advanced Machine Learning & Deep Learning',
                        desc: 'Dive into neural networks, deep learning architectures, and production deployment.',
                        sections: [
                            {
                                title: "Gradient Descent",
                                content: "- **Optimization**: The workhorse of ML. It iteratively adjusts model parameters to minimize the cost function.\n- **Learning Rate**: A critical hyperparameter that determines how large each step should be.\n- **Convergence**: When the algorithm reaches the minimum point where further updates don't significantly reduce error."
                            },
                            {
                                title: "Regularization",
                                content: "- **L1 (Lasso)**: Adds the absolute value of coefficients to the penalty (helps in feature selection).\n- **L2 (Ridge)**: Adds the squared magnitude of coefficients (prevents large weights).\n- **Goal**: Combat overfitting by simplifying the model's complexity."
                            },
                            {
                                title: "Neural Networks Basics",
                                content: "- **Inspired by the brain**: Composed of input, hidden, and output layers.\n- **Forward Propagation**: Passing input data through layers to get a prediction.\n- **Backpropagation**: Updating weights based on the error using the Chain Rule from calculus."
                            },
                            {
                                title: "Activation Functions",
                                content: "- **Purpose**: Adds non-linearity to the network, allowing it to learn complex patterns.\n- **Sigmoid**: Useful for binary classification.\n- **ReLU (Rectified Linear Unit)**: Most common for hidden layers due to its efficiency.\n- **Softmax**: Used in the output layer for multi-class classification."
                            },
                            {
                                title: "Convolutional Neural Networks (CNN)",
                                content: "- **Image Recognition**: Specialized for processing grid-like data (images).\n- **Convolutional Layer**: Extracts features like edges and patterns using filters.\n- **Pooling**: Reduces the spatial volume to focus on the most important information."
                            },
                            {
                                title: "Recurrent Neural Networks (RNN)",
                                content: "- **Memory**: Designed for sequential data (text, time-series).\n- **Hidden State**: Stores information from previous steps to influence current predictions.\n- **LSTMs**: Advanced RNNs that can remember information over long sequences."
                            },
                            {
                                title: "Deep Learning Frameworks",
                                content: "- **TensorFlow**: Developed by Google, highly scalable for production.\n- **PyTorch**: Developed by Facebook Research, known for its flexibility and developer-friendly API."
                            },
                            {
                                title: "Model Deployment Overview",
                                content: "- **From Dev to Prod**: Saving your trained weights and integrating the model into an API or app.\n- **Scalability**: Ensuring the model can handle many requests efficiently in a cloud environment."
                            }
                        ],
                        video: 'https://www.youtube.com/embed/aircAruvnKk',
                        resources: [
                            { name: 'Advanced ML Notes (PDF)', url: '/resources/ml-advanced-notes.pdf' }
                        ]
                    }
                ]
            },
            { id: 'core-cse', name: 'Core Computer Science', description: 'OS, Networking, and Theory.' },
            { id: 'cyber-sec', name: 'Cyber Security', description: 'Security and encryption.' }
        ]
    },
    'ece': {
        name: 'ECE',
        fullName: 'Electronics & Communication',
        icon: 'Zap',
        domains: [
            { id: 'embedded', name: 'Embedded Systems', description: 'Prototyping with microcontrollers.' },
            { id: 'vlsi', name: 'VLSI Design', description: 'Chip design and hardware description languages.' },
            { id: 'iot', name: 'IoT', description: 'Connected devices mesh.' },
            { id: 'signal', name: 'Signal Processing', description: 'Analog and digital signal analysis.' },
            { id: 'soft-dev-ece', name: 'Software Development', description: 'Coding for ECE students.' }
        ]
    },
    'eee': {
        name: 'EEE',
        fullName: 'Electrical & Electronics',
        icon: 'Zap',
        domains: [
            { id: 'power-systems', name: 'Power Systems', description: 'Electricity generation and distribution.' },
            { id: 'control-sys', name: 'Control Systems', description: 'Dynamic systems and mathematical modeling.' },
            { id: 'renewable', name: 'Renewable Energy', description: 'Solar, wind, and sustainable power.' }
        ]
    },
    'ecm': {
        name: 'ECM',
        fullName: 'Electronics & Computer Engineering',
        icon: 'Terminal',
        domains: [
            { id: 'os-design', name: 'OS Design', description: 'Kernel and systems programming.' },
            { id: 'hardware-arch', name: 'Hardware Architecture', description: 'RISC vs CISC and instruction sets.' },
            { id: 'data-comm', name: 'Data Communication', description: 'Networking fundamentals for ECM.' }
        ]
    },
    'mech': {
        name: 'Mechanical',
        fullName: 'Mechanical Engineering',
        icon: 'Settings',
        domains: [
            { id: 'cad-cam', name: 'CAD / CAM', description: 'Computer-aided design and manufacturing.' },
            { id: 'manufacturing', name: 'Manufacturing', description: 'Processing and production techniques.' },
            { id: 'robotics', name: 'Robotics', description: 'Automation and kinematics.' },
            { id: 'thermal', name: 'Thermal Engineering', description: 'Thermodynamics and heat transfer.' }
        ]
    },
    'civil': {
        name: 'Civil',
        fullName: 'Civil Engineering',
        icon: 'Home',
        domains: [
            { id: 'structural', name: 'Structural Engineering', description: 'Analyzing building stability.' },
            { id: 'construction', name: 'Construction Planning', description: 'Resource and project management.' },
            { id: 'surveying', name: 'Surveying', description: 'Land mapping and measurements.' },
            { id: 'geotechnical', name: 'Geotechnical Engineering', description: 'Soil and rock mechanics.' }
        ]
    }
};

// Add default chapters to domains that don't have them yet for structure consistency
Object.values(BRANCH_DATA).forEach(branch => {
    branch.domains.forEach(domain => {
        if (!domain.chapters) {
            domain.chapters = [
                {
                    id: `${domain.id}-c1`,
                    topic: `Introduction to ${domain.name}`,
                    desc: `Fundamental concepts of ${domain.name}.`,
                    content: `Welcome to the world of ${domain.name}. In this chapter, we explore the history and basic principles...`,
                    video: 'https://www.youtube.com/embed/qz0aGYrrlhU',
                    resources: [{ name: 'Intro Guide', url: '#' }]
                },
                {
                    id: `${domain.id}-c2`,
                    topic: `Intermediate ${domain.name}`,
                    desc: `Going deeper into the workflow.`,
                    content: `Now that you know the basics, let's look at professional tools and techniques used in industry...`,
                    video: 'https://www.youtube.com/embed/1Rs2ND1RYYc'
                },
                {
                    id: `${domain.id}-c3`,
                    topic: `Advanced ${domain.name} Projects`,
                    desc: `Building real-world applications.`,
                    content: `Apply everything you've learned in a comprehensive project...`,
                    video: 'https://www.youtube.com/embed/hdI2bqOjyQFw'
                }
            ];
        }
    });
});

// ... other existing exports like GATE_SYLLABUS, MOCK_QUESTIONS, INTERVIEW_TOPICS remain or can be extended
export const GATE_SYLLABUS = {
    'CSE': [
        { topic: 'Digital Logic', weightage: '5-7%' },
        { topic: 'Computer Organization', weightage: '6-9%' },
        { topic: 'Data Structures', weightage: '10-12%' },
        { topic: 'Algorithms', weightage: '10-15%' },
        { topic: 'Operating Systems', weightage: '8-10%' },
        { topic: 'Database Management', weightage: '7-9%' },
    ],
    'ECE': [
        { topic: 'Networks/Signals', weightage: '10-15%' },
        { topic: 'Electronic Devices', weightage: '10-12%' },
        { topic: 'Analog Circuits', weightage: '10-12%' },
    ]
};

export const MOCK_QUESTIONS = [
    {
        id: 1,
        question: "Which data structure is best for implementing a priority queue?",
        options: ["Array", "Linked List", "Heap", "Stack"],
        correct: 2
    },
    {
        id: 2,
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        correct: 1
    },
    {
        id: 3,
        question: "Which scheduling algorithm causes starvation?",
        options: ["Round Robin", "FCFS", "SJF", "Priority Scheduling"],
        correct: 3
    }
];

export const INTERVIEW_ROUNDS = [
    {
        id: 'online-assessment',
        name: 'Online Assessment',
        desc: 'The first hurdle in most technical recruitment processes.',
        sections: [
            {
                title: "Typical Format",
                content: "- **Problem Count**: Usually 2–4 coding problems.\n- **Time Limit**: 60–120 minutes.\n- **Platforms**: HackerRank, LeetCode, CodeSignal, or company-specific platforms."
            },
            {
                title: "Topics to Prepare",
                content: "- **Arrays & Strings**: Sliding window, two pointers, hashing.\n- **Recursion**: Backtracking concepts and recursive patterns.\n- **Sorting**: Knowing when to use custom comparators.\n- **Time Complexity**: Big O analysis (ensuring your solution fits within the 1-2 second limit)."
            },
            {
                title: "Practice & Common Mistakes",
                content: "- **Effective Practice**: Use a timer, solve problems on platforms like LeetCode (Easy-Medium focus).\n- **Common Mistakes**: Not reading constraints, ignoring edge cases (empty input, large values), not optimizing before coding."
            }
        ]
    },
    {
        id: 'technical-round-1',
        name: 'Technical Round 1 (DSA)',
        desc: 'Deep dive into your problem-solving abilities and DSA knowledge.',
        sections: [
            {
                title: "What Interviewers Check",
                content: "- **Problem Solving**: How you break down a complex task.\n- **Efficiency**: Is it the most optimal solution (Time & Space)?\n- **Communication**: Think-aloud method - can you explain your logic clearly?\n- **Edge Cases**: Thinking about nulls, single elements, and large datasets."
            },
            {
                title: "Approach & Whiteboard Tips",
                content: "- **Clarify**: Ask about constraints before writing code.\n- **Optimization Discussion**: Discuss brute force, then optimize to better complexity.\n- **Think Aloud**: Keep talking; interviewers care about your path to the solution.\n- **Whiteboard Tips**: Plan your space, write clean code, and dry run with a simple test case."
            },
            {
                title: "Common DSA Topics",
                content: "- **Linked List, Stack, Queue**: Basic structures.\n- **Trees & Graphs**: BFS, DFS, and common traversals.\n- **Dynamic Programming**: Memoization and Tabulation concepts."
            }
        ]
    },
    {
        id: 'technical-round-2',
        name: 'Technical Round 2 (Core + Projects)',
        desc: 'Discussion on core engineering concepts and your previous work.',
        sections: [
            {
                title: "Explaining Your Projects",
                content: "- **The 'Why'**: Technical choices and architecture decisions.\n- **Challenges**: Specific bugs or performance issues you overcame.\n- **Impact**: Quantifiable results (e.g., 'reduced load time by 30%')."
            },
            {
                title: "Core Concepts to Revise",
                content: "- **OS Basics**: Threads vs Processes, Scheduling, Memory Management.\n- **DBMS Basics**: SQL vs NoSQL, Indexing, ACID properties.\n- **Networking**: TCP/IP, HTTP/S, DNS basics.\n- **Field Specific**: Common Web Dev (DOM, Event Loop) or ML (Bias vs Variance) questions."
            },
            {
                title: "Answering Strategy",
                content: "- **Difference**: Theoretical vs Practical (use real-world examples).\n- **'I Don't Know'**: Handle gracefully by explaining how you would research or solve it."
            }
        ]
    },
    {
        id: 'system-design',
        name: 'System Design',
        desc: 'Designing scalable and reliable software architectures.',
        sections: [
            {
                title: "Core Scalability Concepts",
                content: "- **Scalability**: Horizontal vs Vertical scaling.\n- **Load Balancing**: Distributing traffic effectively.\n- **Caching**: Using Redis/Memcached to speed up data retrieval."
            },
            {
                title: "Basic Architectural Components",
                content: "- **Microservices vs Monolith**: Deciding on the right structure.\n- **Database Choice**: Relational vs Document-based storage.\n- **Message Queues**: Asynchronous processing with Kafka or RabbitMQ."
            },
            {
                title: "System Design Patterns",
                content: "- **Designing Chat App**: High-level view (WebSockets, storage).\n- **URL Shortener**: Basic design (hashing, collision handling, redirection).\n- **How to Structure**: Clarify -> Estimate -> Design -> Deep Dive."
            }
        ]
    },
    {
        id: 'hr-prep',
        name: 'HR Round',
        desc: 'Behavioral assessment and cultural fit check.',
        sections: [
            {
                title: "Behavioral Patterns",
                content: "- **Tell Me About Yourself**: Structured elevator pitch.\n- **STAR Method**: Situation, Task, Action, Result for behavioral questions.\n- **Strengths & Weaknesses**: Framing them honestly and showing growth/awareness."
            },
            {
                title: "Common Situations",
                content: "- **Handling Conflict**: Professional resolution examples.\n- **Career Goals**: Where you see yourself in 2–5 years.\n- **Behavioral Questions**: Handling failure, taking feedback, working in a team."
            },
            {
                title: "Communication & Body Language",
                content: "- **Body Language**: Eye contact, posture, and active listening tips.\n- **Clarity Tabs**: Tips for clear and concise verbal communication."
            }
        ]
    }
];

export const INTERVIEW_TOPICS = [
    { id: 'dsa', name: 'Data Structures & Algo', count: 15 },
    { id: 'sys-design', name: 'System Design', count: 8 },
    { id: 'behavioral', name: 'Behavioral', count: 20 },
    { id: 'react', name: 'React (Frontend)', count: 12 },
];
