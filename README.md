# @resourge/react-router

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

`@resourge/react-router` package provides a set of reusable components, hooks and utils for managing routing and URL parameters in react applications. Components facilitate navigation between different views or pages, allowing developers to create dynamic and interactive user interfaces. Offers a flexible and intuitive way to define routes, handle dynamic parameters, and manage search parameters, all while ensuring type safety and scalability.

## Features

- `Dynamic Document Titles`: Dynamically update document titles based on route changes or specified content, improving accessibility and SEO.
- `Meta Tag Management`: Manage meta tags dynamically to control page metadata such as titles, descriptions, and SEO attributes.
- `Multilingual Routing`: Ensure proper handling of language-specific routes, facilitating multilingual support and localization efforts.
- `URL Utilities`: Provide utility functions for resolving and formatting URLs, handling search parameters, and maintaining URL consistency.
- `Route Setup with SetupPaths`: Define routes using the SetupPaths utility, specifying paths and their corresponding components. This allows for centralized route management and easy navigation.
- `Type Safety and Scalability`: Ensure type safety throughout the routing process by leveraging TypeScript's static type checking. The package's architecture allows for seamless scalability, making it suitable for projects of any size.
- `Easy Integration with React`: Integrate the router-utils package effortlessly into React applications. Its intuitive API and React-friendly design make it easy to use and understand, even for beginners.
- `Customizable and Extensible`: Customize and extend the package's functionality to suit your specific project requirements. The modular design allows for easy customization without sacrificing performance or reliability.
- `Support for Hash and Normal Paths`: Choose between hash-based or normal paths for your routes, depending on your application's requirements. The package provides support for both types of paths, ensuring compatibility with various hosting environments.
- `Built on Native Browser Navigation`: Leveraging native browser navigation capabilities, the package seamlessly integrates with the browser's history API, providing smooth and efficient navigation transitions.
- `Utilizes Native URLPattern`: The package utilizes the native URLPattern for route matching, ensuring compatibility with modern browsers. For unsupported browsers, a polyfill is included, which will be removed in future versions to optimize performance.
- `Similar to 'react-router v5'`: With a familiar API inspired by 'react-router v5', the package offers a user-friendly experience for developers already familiar with the popular routing library. This familiarity reduces the learning curve and facilitates easier adoption for existing projects.

## Table of Contents

- [Installation](#installation)
- [BrowserRouter](#browserrouter)
- [Route](#route)
- [Switch](#switch)
- [LanguageRoute](#languageroute)
- [Navigate](#navigate)
- [Redirect](#redirect)
- [Title](#title)
- [Meta](#meta)
- [Prompt](#prompt)
- [useNavigate](#usenavigate)
- [useParams](#useparams)
- [useSearchParams](#usesearchparams)
- [useAction](#useaction)
- [useMatchPath](#usematchpath)
- [useSwitch](#useswitch)
- [useLink](#uselink)
- [useNormalizeUrl](#usenormalizeurl)
- [useBeforeURLChange](#usebeforeurlchange)
- [useBlocker](#useblocker)
- [usePrompt](#usePrompt)
- [matchPath](#matchpath)
- [generatePath](#generatepath)
- [resolveLocation](#resolvelocation)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Installation

Install using [Yarn](https://yarnpkg.com):

```sh
yarn add @resourge/react-router
```

or NPM:

```sh
npm install @resourge/react-router --save
```

# BrowserRouter

`BrowserRouter` component serves as the foundational element for managing routing contexts within react applications. By integrating this component into your project, you can establish a robust routing infrastructure while maintaining flexibility and scalability.

## Usage

```tsx
import React from 'react';
import { BrowserRouter } from '@resourge/react-router';

const App = () => {
  return (
    <BrowserRouter defaultFallback={<FallbackComponent />}>
      <AppRoutes />
    </BrowserRouter>
  );
};
```

## Props

- `defaultFallback` (optional): Specifies a default fallback component or element to render when route is loading.

# Route

`Route` component provides a mechanism for conditionally rendering content based on the current URL path within a react application. By defining routes and associating them with specific components, developers can implement dynamic page rendering and navigation logic, enhancing user experience and application usability.

## Usage

```tsx
import { BrowserRouter, Route } from '@resourge/react-router';

const App = () => {
  return (
    <BrowserRouter>
      <Route path="/home">
        <HomePage />
      </Route>
      <Route path="/about">
        <AboutPage />
      </Route>
      <Route>
        <NotFoundPage />
      </Route>
    </BrowserRouter>
  );
};
```

## Props

- `path` (string or string[]): Defines the route path(s) to match against the current URL.
- `children` (ReactNode): Content to render when the route matches the current URL.
- `fallback` (ReactNode) (optional): Fallback content to render while waiting for the main content to load (if undefined it will use BrowserRouter defaultFallback).
- `exact` (boolean, default: false)(optional): Specifies whether the URL must exactly match the route path.
- `hash` (boolean, default: false)(optional): Indicates whether to treat the route path as a hash route.
- `searchParams` (string or string[])(optional): Specifies mandatory search parameters required for route matching.

# Switch

`Switch` component ensures that only the first matching route renders within a react application. By analyzing the provided children components and selecting the first component whose props match the current URL path, developers can implement exclusive route rendering logic, enhancing application navigation and user experience.

## Usage

```tsx
import React from 'react';
import { BrowserRouter, Switch, Route } from '@resourge/react-router';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/home">
          <HomePage />
        </Route>
        <Route path="/about">
          <AboutPage />
        </Route>
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
```

## Props

- `children` (Array<ReactElement<BaseRouteProps>> | ReactElement<BaseRouteProps>): Children components representing different routes to be rendered.
- `fallback` (ReactNode) (optional): Content to render while waiting for the matched route component to load. (if undefined it will use BrowserRouter defaultFallback).

# SetupPaths/path/param/searchParam

## SetupPaths

`SetupPaths` function is a utility used to organize and configure paths systematically. It enables developers to define and structure paths within their application architecture efficiently. This function takes an object containing path structures as input and returns a result type representing the configured paths.

## path

`path` is a fundamental building block in defining routes and URLs within a React application. It provides a flexible mechanism for constructing paths with dynamic segments and parameters. Developers can create a path to represent different routes in their application. The `path` offers methods for adding path segments, parameters, and search parameters, as well as generating paths based on the configured settings.

## param

`param` is used to define parameters within a path. Parameters are placeholders in a URL path that can capture dynamic values. With the `param`, developers can specify parameter names and configure various options, such as whether the parameter is optional or has predefined options.

## searchParams

`searchParams` is specifically designed to handle search parameters within a URL. Search parameters are key-value pairs that appear after the "?" symbol in a URL query string. Using the `searchParam`, developers can define search parameter names and configure optional parameters or specify predefined options for the parameters.

## Usage

```typescript
import { SetupPaths, path, searchParam } from '@resourge/react-router';

// Define path structures
const RoutePaths = SetupPaths({
  home: path('home'),
  user: path('user', { hash: true }).param('id'),
  search: path('search').searchParams({
    query: searchParam<string>(),
    page: searchParam<number>({ optional: true }),
  }),
});

// Usage of paths
const homePath = RoutePaths.home.get(); // /home
const userRoutePath = RoutePaths.user.path // #/user/:id
const userPath = RoutePaths.user.get({ id: '123' }); // /#/user/123
const userParams = RoutePaths.user.useParams() // { id: '123' };
const searchPath = RoutePaths.search.get({ searchParams: { query: 'example', page: 1 } }); // /search?query=example&page=1
const searchRouteSearchParams = RoutePaths.user.searchParams() // ['query']
const searchSearchParams = RoutePaths.user.useSearchParams() // { query: 'example', page: 1 };
```

# LanguageRoute

`LanguageRoute` component ensures that the language is present at the beginning of the route path within a react application. By analyzing the URL and enforcing language-specific routing rules, developers can create multilingual web applications that seamlessly adapt to user language preferences, enhancing accessibility and user experience.

Functionality: 
- `Language Detection`: Detects the language parameter in the URL and ensures that it is present at the beginning of the route path.
- `Language Validation`: Developers can provide custom logic to validate the language parameter, ensuring that only supported languages are accepted.
- `Fallback Handling`: The component handles scenarios where the language is missing or unsupported, redirecting users to the appropriate language-specific route.

## Usage

```tsx
import React from 'react';
import { BrowserRouter, LanguageRoute, Route } from '@resourge/react-router';

const App = () => {
  return (
    <BrowserRouter>
      <LanguageRoute languages={['en', 'fr', 'es']} fallbackLanguage="en">
        <Route path="/home">
          <HomePage />
        </Route>
        <Route path="/about">
          <AboutPage />
        </Route>
        <Route>
          <NotFoundPage />
        </Route>
      </LanguageRoute>
    </BrowserRouter>
  );
};
```

## Props

- `children` (ReactNode): The children components representing different routes to be rendered within the language-aware context.
- `languages` (string[]): An array of supported languages for the application.
- `checkLanguage` ((lang?: string) => boolean) (optional): Optional custom function to validate the language parameter.
- `fallbackLanguage` (string) (optional): Fallback language to use when the language is missing or unsupported.

# Navigate

`Navigate` component facilitates navigation to a specified destination using the `useNavigate` hook.

## Usage

```tsx
import { BrowserRouter, Navigate } from '@resourge/react-router';

const MyComponent = () => {
  return (
    <BrowserRouter>
      <h1>Welcome to My Component</h1>
      <Navigate to="/new-page" replace preventScrollReset />
    </BrowserRouter>
  );
};
```

## Props

- `to` (string | URL | { searchParams: Record<string, any> }): The destination to navigate to, which can be a string, URL object, or an object with search parameters.
- `action` (ActionType): Specifies the type of action to be performed during navigation. This option allows for fine-grained control over how navigation actions are handled. Possible values include:
	- 'push': Pushes a new entry onto the browser history stack.
	- 'replace': Replaces the current entry in the browser history stack.
	- 'pop': Navigates back to the previous entry in the browser history stack.
	- 'initial': Indicates that the navigation action is the initial page load.
- `preventScrollReset` (boolean): Determines whether the scroll position should be preserved during navigation. When set to true, the browser will not reset the scroll position to the top of the page after navigation. This option is particularly useful for maintaining the user's scroll position when navigating within long pages or scrollable containers.
- `replace` (boolean): Specifies whether the navigation action should replace the current URL in the browser history stack instead of adding a new entry. When set to true, the current URL will be replaced with the destination URL, effectively modifying the browser history without creating a new entry. 


# Redirect

`Redirect` component is designed to facilitate redirection from one route to another within a react application. It combines the functionality of the `Route` and `Navigate` components to achieve seamless navigation transitions based on specified conditions.

## Usage

```tsx
import { BrowserRouter, Redirect } from '@resourge/react-router';

const App = () => {
  return (
    <BrowserRouter>
      {/* Redirect from /old-path to /new-path */}
      <Redirect from="/old-path" to="/new-path" replace />
    </BrowserRouter>
  );
};
```

## Props

- `from` (string): Specifies the path from which the redirection should occur. When the current route matches the from path, the redirection defined by the to prop will be triggered.
- `to` (string | URL | { searchParams: Record<string, any> }): Specifies the destination path or URL to which the redirection should occur. This can be a string representing the path, a URL object, or an object containing search parameters for the destination URL.
- `replace` (boolean) (optional): Determines whether the redirection should replace the current URL in the browser history stack instead of adding a new entry. When set to true, the current URL will be replaced with the destination URL.

# Link

`Link` component extends the functionality of an `<a>` element in a react application, providing seamless navigation to the specified destination (`to`). It integrates with the `useLink` hook to manage navigation logic and utilizes the `url` hook to match the current route and apply styling based on the match status.

## Usage

```tsx
import { Link } from '@resourge/react-router';

const MyComponent = () => {
  return (
    <Link 
      to="/about" 
      matchClassName="active" 
      className="custom-link" 
      onClick={handleClick}
      target="_blank"
    >
      About Us
    </Link>
  );
};
```

## Props

- `to` (string | URL | { searchParams: Record<string, any> }): Specifies the destination URL to navigate to when the link is clicked.
- `action` (ActionType)(optional): Specifies the action to be taken when navigating. Defaults to false.
- `preventScrollReset` (boolean)(optional): Prevents the scroll position from being reset after navigation. Defaults to false.
- `replace` (boolean)(optional): Determines whether to replace the current entry in the history stack instead of adding a new one. Defaults to false.
- `className` (string)(optional): Specifies the CSS class(es) to be applied to the link element.
- `matchClassName` (string)(optional): Specifies the CSS class to be applied to the link element when the destination URL matches the current route. This allows developers to apply custom styling to active links.
- `exact` (boolean)(optional): Determines whether the link should match the URL exactly. Defaults to false.
- `hash` (boolean)(optional): Specifies whether to include the hash part of the URL when matching. Defaults to false.
- `children` (ReactNode)(optional): Content to be rendered inside the link element.
- `onClick` ((event: MouseEvent<HTMLAnchorElement>) => void)(optional): Callback function to be executed when the link is clicked.
- `...otherAnchorHTMLAttributes` (AnchorHTMLAttributes<HTMLAnchorElement>)(optional): Additional attributes supported by the `<a>` element, such as `target`, `rel`, etc.

# Title

`Title` component is a simple utility component designed to update the title of a web page dynamically. It accepts a `children` prop, which should contain the desired title text.

## Usage

```tsx
import { Title } from '@resourge/react-router';

const MyComponent = () => {
  return (
    <Title>
      My Page Title
    </Title>
  );
};
```

## Props

- `children` (string)(optional): Text to be set as the page title.

# Meta

`Meta` component is a utility component designed to dynamically update meta tags in the `<head>` of a web page. It accepts a set of key-value pairs representing the attributes and content of the meta tags to be updated.

## Usage

```tsx
import { Meta } from '@resourge/react-router';

const MyComponent = () => {
  return (
    <div>
      <Meta name="description" content="This is a description of my page" />
      <Meta property="og:title" content="My Page Title" />
      {/* Add more meta tags as needed */}
    </div>
  );
};
```

## Props

- `name` (string): Name of the meta tag. 
- `property` (string): Property of the meta tag. 
- `content` (string): Content of the meta tag. 
- `....MetaProps` (Record<string, string>): A set of key-value pairs representing the attributes and content of the meta tags to be updated.

# Prompt

`Prompt` component is a react component designed to prompt the user before navigating away from a screen. It utilizes the `usePrompt` hook internally to manage the prompting behavior.

## Usage

```tsx
import { Prompt } from '@resourge/react-router';

// Usage within a component
const MyComponent = () => {
  return (
    <Prompt
      when={true} // Set to true to prompt the user
      message="Are you sure you want to leave this page?" // Optional message
    >
      {/* Your component content here */}
    </Prompt>
  );
};
```

## Props

- `children` (ReactNode) (optional): The content to be wrapped by the Prompt component.
- `when` (boolean | Blocker): When true, it will prompt the user before navigating away from a screen. It also accepts a function that returns a boolean value.
- `message` (string | ((currentUrl: URL, nextUrl: URL, action: ActionType) => string)) (optional): When set, it will prompt the user with a native confirm dialog and the specified message.

### usePromptNext

`usePromptNext` provides the prompting result to descendant components, allowing them to access the `next` method to navigate after the prompt is resolved.

#### example

```tsx
import { Prompt, usePromptNext } from '@resourge/react-router';

// Usage within a component
const PromptNextCompoent = () => {
  const { continueNavigation } = usePromptNext();

  const handleContinue = () => {
    continueNavigation();
  };

  return (
	<div>
	  <p>This is a sample component.</p>
	  <button onClick={handleContinue}>Continue</button>
	</div>
  );
};

// Usage within a component
const MyComponent = () => {
  return (
    <Prompt
      when={true} // Set to true to prompt the user
      message="Are you sure you want to leave this page?" // Optional message
    >
      <PromptNextCompoent />
    </Prompt>
  );
};
```

# useNavigate

`useNavigate` hook provides a method for navigation by generating and manipulating URLs based on the provided destination and options. It offers a convenient way to handle navigation actions within a React application while allowing for customization through various options.

## Usage

```tsx
import { useNavigate } from '@resourge/react-router';

const MyComponent = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    const destination = '/new-page';
    navigate(destination);
  };

  return (
    <button onClick={handleClick}>Navigate to New Page</button>
  );
};
```

## Parameters

- `to` (string | URL | { searchParams: Record<string, any> }): The destination to navigate to, which can be a string, URL object, or an object with search parameters.
- `options` (NavigateOptions) (optional): Options for navigation customization, such as the action type, scroll reset prevention, and path replacement.
	- `action` (ActionType): Specifies the action type for the navigation. Possible values include 'push' and 'replace' or 'pop'. This option allows you to control how the navigation affects the browser history stack.
	- `preventScrollReset` (boolean): Determines whether the navigation should prevent resetting the scroll position. By default, it is set to false, allowing the browser to reset the scroll position when navigating to a new page. Setting this option to true maintains the current scroll position during navigation.
	- `replace` (boolean): Indicates whether the navigation should replace the current URL in the browser history instead of adding a new entry. By default, it is set to false, meaning navigation adds a new entry to the history stack. Setting this option to true replaces the current URL without creating a new history entry.

# useParams

`useParams` hook is a utility hook designed to retrieve the current route parameters. It also provides an optional parameter `transformsParams` to allow transforming the parameters before using them in your component.

## Usage

```tsx
import { useParams } from '@resourge/react-router';

// Usage within a component
const MyComponent = () => {
  const params = useParams();

  return (
    <div>
      <p>The current route parameters are: {JSON.stringify(params)}</p>
    </div>
  );
};
```

## Parameters

- `transformsParams` ((params: StringifyObjectParams<Params>) => Params)(optional): Method to transform the parameters retrieved from the route. This can be useful for formatting or modifying the parameters before using them in your component.

# useSearchParams

`useSearchParams` hook is a utility hook designed to retrieve and manage the current search parameters from the URL. It parses the search parameters and provides a reactive way to access and update them within a React component.

## Usage

```tsx
import { useSearchParams } from '@resourge/react-router';

// Usage within a component
const MyComponent = () => {
  const searchParams = useSearchParams();
  console.log('Current search parameters:', searchParams);

  return (
    <div>
      {/* Your component content here */}
    </div>
  );
};
```

## Parameters

- `defaultParams` (Record<string, any>)(optional): Default search parameters to be used if no parameters are present in the URL.

# useAction

`useAction` hook provides access to the action that led to the current URL. 

## Usage

```tsx
import { useAction } from '@resourge/react-router';

// Usage within a component
const MyComponent = () => {
  const action = useAction();

  return (
    <div>
      <p>The current action is: {action}</p>
    </div>
  );
};
```

# useMatchPath

`useMatchPath` hook provides a convenient interface for integrating route matching functionality into react components. By encapsulating route matching logic within a hook, developers can streamline route validation and update handling, improving code readability and maintainability.

## Usage

```tsx
import { useMatchPath } from '@resourge/react-router';

const ProductPage = () => {
  const match = useMatchPath({ path: '/products/:productId', exact: true });

  if (match) {
    return <ProductDetails productId={match.params.productId} />;
  } else {
    return <NotFound />;
  }
};
```

## Parameters

- `path` (string or string[]): Defines the route path(s) to match against the current URL.
- `searchParams` (string or string[]) (optional): Specifies mandatory search parameters required for route matching.
- `exact` (boolean, default: false) (optional): Specifies whether the URL must exactly match the route path.
- `hash` (boolean, default: false) (optional): Indicates whether to treat the route path as a hash route.

# useSwitch

`useSwitch` hook provides a mechanism for first matching route based on URL paths within react applications. By analyzing the children components provided and matching them against the current URL, developers can dynamically determine which component to render, enhancing application navigation and user experience.

## Usage

```tsx
import React from 'react';
import { BrowserRouter, useSwitch, Route, Navigate, Redirect } from '@resourge/react-router';

const App = () => {
  return (
    <BrowserRouter>
      {useSwitch(
        [
		  <Route path="/home">
            <HomePage />
          </Route>,
          <Route path="/about">
            <AboutPage />
          </Route>,
          <Redirect from="/old" to="/new" />,
          <Navigate to="/default" />
		]
      )}
    </BrowserRouter>
  );
};
```

# useLink

`useLink` hook provides functionality to generate an `href` value and an `onClick` method for a link element (<a> tag) in a react application. It leverages the `useNavigate` and `useNormalizeUrl` hooks internally to facilitate seamless navigation to the specified destination.

## Usage

```tsx
import { useLink } from '@resourge/react-router';

const MyComponent = () => {
  const [href, onClick] = useLink({ to: '/new-page', replace: true });

  return (
    <a href={href} onClick={onClick}>
      Click me to navigate to the new page
    </a>
  );
};
```

## Parameters

- `to` (string | URL | { searchParams: Record<string, any> }): Specifies the destination path or URL to which the link should navigate. This can be a string representing the path, a URL object, or an object containing search parameters for the destination URL.
- `replace` (boolean)(optional): Determines whether the navigation should replace the current URL in the browser history stack instead of adding a new entry. When set to true, the current URL will be replaced with the destination URL.
- `preventScrollReset` (boolean)(optional): Indicates whether the scroll position should be preserved when navigating to the destination. By default, scroll position will be reset after navigation.
- `action` (ActionType)(optional): Specifies the action type to be associated with the navigation event. This can be useful for controlling browser history behavior.

# useNormalizeUrl

`useNormalizeUrl` hook is designed to provide a method for generating normalized URLs based on a given destination. It offers a convenient way to create URLs with consistent search parameters, leveraging the current URL context and optional base path.

## Usage

```tsx
import { useNormalizeUrl } from '@resourge/react-router';

const MyComponent = () => {
  const normalizeUrl = useNormalizeUrl();

  const handleClick = () => {
    const destination = { searchParams: { key: 'value' } };
    const normalizedUrl = normalizeUrl(destination);
    console.log(normalizedUrl.href);
  };

  return (
    <button onClick={handleClick}>Generate URL</button>
  );
};
```

## Parameters

- `to` (string | URL | { searchParams: Record<string, any> }): Destination for which to generate a URL. It can be a string, URL object, or an object with search parameters.

# useBeforeURLChange

`useBeforeURLChange` hook is a utility hook designed to handle events that occur before a route changes. It allows you to specify a callback function that will be triggered before the route changes, giving you the opportunity to perform any necessary actions or validations.

`useBeforeURLChange` hook is typically used to intercept route changes and perform certain actions before allowing the route change to proceed. It takes a callback function as its argument, which will be called with an event object representing the impending route change. The callback function should return true to allow the route change to proceed as normal, or false to prevent the route change from happening.

## Usage

```tsx
import { useBeforeURLChange } from '@resourge/react-router';

const MyComponent = () => {
  useBeforeURLChange((event) => {
    // Perform any necessary actions or validations here
    if (event.url === '/restricted-route') {
      // Prevent navigation to restricted route
      return false;
    }
    
    // Allow navigation to other routes
    return true;
  });

  return (
    <div>
      {/* Your component content here */}
    </div>
  );
};
```

## Props

- `beforeURLChange` ((event: BeforeUrlChangeEvent) => boolean): Function that receives a `BeforeUrlChangeEvent` and returns a boolean value indicating whether the route change should proceed (`true`) or be prevented (`false`).

# useBlocker

`useBlocker` hook is a utility hook designed to block or allow route changes based on a provided blocking function (`blocker`). It fires before the route changes and serves to determine whether the current route should be blocked or not.

`useBlocker` hook is typically used to intercept route changes and perform certain actions before allowing the route change to proceed. It takes a blocking function as its argument, which will be called with the current URL, next URL, and action type whenever a route change is attempted. The blocking function should return `true` to block the route change, or `false` to allow the route change to proceed.

## Usage

```tsx
import { useBlocker } from '@resourge/react-router';

const MyComponent = () => {
  const { isBlocking, continueNavigation, finishBlocking } = useBlocker((currentUrl, nextUrl, action) => {
    // Perform any necessary actions or validations here
    if (nextUrl.pathname === '/restricted-route' && action !== 'beforeunload') {
      // Block navigation to restricted route
      return true;
    }
    
    // Allow navigation to other routes
    return false;
  });

  return (
    <div>
      {/* Your component content here */}
    </div>
  );
};
```

## Props

- `blocker` ((currentUrl: URL, nextUrl: URL, action: ActionType) => boolean): Function that receives the current URL, next URL, and action type, and returns a boolean value indicating whether the route change should be blocked (`true`) or allowed (`false`).

# usePrompt

`usePrompt` hook is a utility hook designed to prompt the user before navigating away from a screen. It allows you to specify conditions under which the prompt should be shown and customize the prompt message.

## Usage

```tsx
import { usePrompt } from '@resourge/react-router';

const MyComponent = () => {
  const { isBlocking, continueNavigation, finishBlocking } = usePrompt({
    when: true, // Prompt the user when navigating away from the screen
    message: 'Are you sure you want to leave this page?' // Customize the prompt message
  });

  return (
    <div>
      {/* Your component content here */}
    </div>
  );
};
```

## Props

- `when` (boolean | Blocker): When true, it will prompt the user before navigating away from a screen. It also accepts a function that returns a boolean value.
- `message` (string | ((currentUrl: URL, nextUrl: URL, action: ActionType) => string)) (optional): When set, it will prompt the user with a native `confirm` dialog and the specified message. If not set, it will wait for the `continueNavigation` or `finishBlocking` method to be called.

## useLanguageContext

`useLanguageContext` hook is a custom hook that simplifies accessing the current path language.

## Usage

```tsx
import { useLanguageContext } from '@resourge/react-router';

// Usage within a component
const MyComponent = () => {
  const language = useLanguageContext();

  return (
    <div>
      <p>Current language: {language}</p>
    </div>
  );
};
```

# matchPath

`matchPath` function is used to match a given URL to a specified route path. It takes a URL object and match criteria as input and returns a `MatchResult` object if a match is found, or `null` otherwise. Key features include:

- `Dynamic Path Matching`: Support for dynamic route paths, enabling flexible URL routing based on configurable match criteria.
- `Search Parameter Validation`: Optional validation of mandatory search parameters, ensuring URL compatibility and preventing navigation to invalid routes.
- `Hash Routing`: Support for hash-based routing, facilitating seamless integration with single-page applications (SPAs) and hash-based navigation schemes.

```typescript
import { matchPath } from '@resourge/react-router';

const url = new URL('https://example.com/products?category=electronics');
const match = matchPath(url, { path: '/products', searchParams: 'category' });

console.log(match); // Output: MatchResult object or null
```

# generatePath

`generatePath` function is a utility function designed to convert parameters in a path template into their respective values. It replaces path parameters enclosed in curly braces (`{{ paramName }}`) with the corresponding values from the provided `params` object.

## Usage

```typescript
import { generatePath } from '@resourge/react-router';

// Example usage
const path = '/user/:id/posts/:postId';
const params = { id: '123', postId: '456' };
const result = generatePath(path, params);
console.log('Generated path:', result); // Output: '/user/123/posts/456'
```


# resolveLocation

`resolveLocation` function provides a utility for resolving and normalizing URLs. By parsing and manipulating URL components, developers can ensure consistent URL formatting and resolve relative paths relative to a specified base URL, enhancing application robustness and URL handling capabilities.

## Usage

```typescript
import { resolveLocation } from '@resourge/react-router';

// 1. Resolving a relative URL with an absolute path:
const resolvedUrl1 = resolveLocation('/home', 'https://example.com/home/dashboard');
console.log(resolvedUrl1.href); // Output: 'https://example.com/home'

// 2. Resolving a relative URL with an absolute path:
const resolvedUrl2 = resolveLocation('home', 'https://example.com/home/dashboard');
console.log(resolvedUrl2.href); // Output: 'https://example.com/home/dashboard/home'

// 3. Resolving a relative URL with an absolute path:
const resolvedUrl3 = resolveLocation('about', 'https://example.com/home/dashboard');
console.log(resolvedUrl3.href); // Output: 'https://example.com/home/dashboard/about'

// 4. Resolving a relative URL with a relative path:
const resolvedUrl4 = resolveLocation('./about', 'https://example.com/home/dashboard');
console.log(resolvedUrl4.href); // Output: 'https://example.com/home/about'

// 5. Resolving a relative URL with an absolute path:
const resolvedUrl5 = resolveLocation('/about', 'https://example.com/home/dashboard');
console.log(resolvedUrl5.href); // Output: 'https://example.com/about'

// 6. Resolving a relative URL with a relative path:
const resolvedUrl6 = resolveLocation('../contact', 'https://example.com/home/dashboard');
console.log(resolvedUrl6.href); // Output: 'https://example.com/contact'

// 7. Resolving a relative URL with a relative path:
const resolvedUrl7 = resolveLocation('../../products', 'https://example.com/home/dashboard');
console.log(resolvedUrl7.href); // Output: 'https://example.com/products'

// 8. Resolving a relative URL with a relative path:
const resolvedUrl8 = resolveLocation('../../../products', 'https://example.com/home/dashboard');
console.log(resolvedUrl8.href); // Output: 'https://example.com/products'
```

## Parameters

- `url` (string): The URL string to be resolved and normalized.
- `baseURL` (string) (optional): The base URL string used for resolving relative URLs. If provided, relative URLs are resolved relative to this base URL.

## Documentation

For comprehensive documentation and usage examples, visit the [react-router documentation](https://resourge.vercel.app/docs/react-router/intro).

## Contributing

Contributions to `@resourge/react-router` are welcome! To contribute, please follow the [contributing guidelines](CONTRIBUTING.md).

## License

`@resourge/react-router` is licensed under the [MIT License](LICENSE).

## Contact

For questions or support, please contact the maintainers:
- GitHub: [Resourge](https://github.com/resourge)