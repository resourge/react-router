# @resourge/react-router

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

`@resourge/react-router` package provides a set of reusable components, hooks and utils for managing routing and URL parameters in react applications. Components facilitate navigation between different screens or pages, allowing developers to create dynamic and interactive user interfaces. Offers a flexible and intuitive way to define routes, handle dynamic parameters, and manage search parameters, all while ensuring type safety and scalability.

## Features

- `Dynamic Document Titles`: Dynamically update document titles based on route changes or specified content, improving accessibility and SEO.
- `Meta Tag Management`: Manage meta tags dynamically to control page metadata such as titles, descriptions, and SEO attributes.
- `Multilingual Routing`: Ensure proper handling of language-specific routes, facilitating multilingual support and localization efforts.
- `URL Utilities`: Provide utility functions for resolving and formatting URLs, handling search parameters, and maintaining URL consistency.
- `Route Setup with SetupPaths`: Define routes using the SetupPaths utility, specifying paths and their corresponding components. This allows for centralized route management and easy navigation.
- `Type Safety and Scalability`: Ensure type safety throughout the routing process by leveraging TypeScript's static type checking. The package's architecture allows for seamless scalability, making it suitable for projects of any size.
- `Easy Integration with react`: Integrate the router-utils effortlessly into react applications. Its intuitive API and react-friendly design make it easy to use and understand, even for beginners.
- `Customizable and Extensible`: Customize and extend the package's functionality to suit your specific project requirements. The modular design allows for easy customization without sacrificing performance or reliability.
- `Support for Hash and Normal Paths`: Choose between hash-based or normal paths for your routes, depending on your application's requirements. The package provides support for both types of paths, ensuring compatibility with various hosting environments.
- `Built on native Browser Navigation`: Leveraging native browser navigation capabilities, the package seamlessly integrates with the browser's history API, providing smooth and efficient navigation transitions.
- `Utilizes native URLPattern`: The package utilizes the native URLPattern for route matching, ensuring compatibility with modern browsers. For unsupported browsers, a polyfill is included, which will be removed in future versions to optimize performance.
- `Similar to 'react-router v5'`: With a familiar API inspired by 'react-router v5', the package offers a user-friendly experience for developers already familiar with the popular routing library. This familiarity reduces the learning curve and facilitates easier adoption for existing projects.
- `Supports react native`: Includes support for react native, allowing you to manage navigation and routing in your mobile applications with the same ease and flexibility as in web applications.

## Table of Contents

- [Installation](#installation)
- [Platform-Specific Usage](#platform-specific-usage)
- [BrowserRouter](#browserrouter-web-online)
- [MobileRouter](#mobilerouter-mobile-only)
- [Route](#route)
- [Switch](#switch)
- [SetupPaths](#setuppathspathparamsearchparam)
- [TabsRoute](#tabsroute-mobile-only)
- [BottomTabsRoute](#bottomtabsroutes-mobile-only)
- [TopTabsRoute](#toptabsroutes-mobile-only)
- [LanguageRoute](#languageroute-web-only)
- [Navigate](#navigate)
- [Redirect](#redirect)
- [Title](#title-web-only)
- [Meta](#meta-web-only)
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
- [viteReactRouter](#vitereactrouter)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Installation

Install using [Yarn](https://yarnpkg.com):

### Browser

```sh
yarn add @resourge/react-router
```

or NPM:

```sh
npm install @resourge/react-router --save
```

### react-native

```sh
yarn add @resourge/react-router react-native-safe-area-context react-native-screens react-native-url-polyfill
```

or NPM:

```sh
npm install @resourge/react-router react-native-safe-area-context react-native-screens react-native-url-polyfill --save
```

## Platform-Specific Usage

### Web

For web applications, use the following import:

```typescript
import { BrowserRouter } from '@resourge/react-router';
```

### Mobile

For mobile applications (iOS and Android), use the following import:

```typescript
import { MobileRouter } from '@resourge/react-router/mobile';
```

# BrowserRouter (web online)

`BrowserRouter` component serves as the foundational element for managing routing contexts within web applications. By integrating this component into your project, you can establish a robust routing infrastructure while maintaining flexibility and scalability.

## Usage

```tsx
import react from 'react';
import { BrowserRouter } from '@resourge/react-router';

const App = () => {
  return (
    <BrowserRouter defaultFallback={<FallbackComponent />}>
      <AppRoutes />
    </Router>
  );
};
```

## Props

- `defaultFallback`(optional): Specifies a default fallback component or element to render when route is loading.

# MobileRouter (mobile only)

`MobileRouter` component serves as the foundational element for managing routing contexts within mobile applications. By integrating this component into your project, you can establish a robust routing infrastructure while maintaining flexibility and scalability.

## Usage

```tsx
import react from 'react';
import { MobileRouter } from '@resourge/react-router/mobile';

const App = () => {
  return (
    <MobileRouter defaultFallback={<FallbackComponent />} linking={handleDeepLinking}>
      <AppRoutes />
    </Router>
  );
};
```

## Props

- `defaultFallback` (optional): Specifies a default fallback component or element to render when route is loading.
- `linking` (optional): Allows custom handling of navigation events triggered by external sources like deep links or notifications. It provides a callback mechanism to update the application's navigation state based on incoming URLs or navigation instructions, enhancing flexibility and user experience in navigating within the app.

# Route

`Route` component provides a mechanism for conditionally rendering content based on the current URL path within a react application. By defining routes and associating them with specific components, developers can implement dynamic page rendering and navigation logic, enhancing user experience and application usability.

## Usage

```tsx
import { Router, Route } from '@resourge/react-router';

const App = () => {
  return (
    <Router>
      <Route path="/home">
        <HomePage />
      </Route>
      <Route path="/about">
        <AboutPage />
      </Route>
      <Route>
        <NotFoundPage />
      </Route>
    </Router>
  );
};
```

## Props

- `path` (string or string[]): Defines the route path(s) to match against the current URL.
- `children` (ReactNode): Content to render when the route matches the current URL.
- `fallback` (ReactNode)(optional): Fallback content to render while waiting for the main content to load (if undefined it will use Router defaultFallback).
- `exact` (boolean, default: false)(optional): Specifies whether the URL must exactly match the route path.
- `hash` (boolean, default: false)(optional): Indicates whether to treat the route path as a hash route.
- `searchParams` (string or string[])(optional): Specifies mandatory search parameters required for route matching.

# Switch

`Switch` component ensures that only the first matching route renders within a react application. By analyzing the provided children components and selecting the first component whose props match the current URL path, developers can implement exclusive route rendering logic, enhancing application navigation and user experience.

## Usage

```tsx
import react from 'react';
import { Router, Switch, Route } from '@resourge/react-router';

const App = () => {
  return (
    <Router>
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
    </Router>
  );
};
```

## Props

- `children` (Array<ReactElement<BaseRouteProps>> | ReactElement<BaseRouteProps>): Children components representing different routes to be rendered.
- `fallback` (ReactNode)(optional): Content to render while waiting for the matched route component to load. (if undefined it will use Router defaultFallback).
- `animated` (ReactNode)(optional)(mobile only): Enables screen transition animations.
- `animation` (ReactNode)(optional)(mobile only): Specifies a custom animation style for screen transitions. Default animation:
	```tsx
	(animation, { width }) => ({
	  transform: [
	  	{
	  	translateX: animation.interpolate({
	  		inputRange: [-1, 0, 1],
	  		outputRange: [-width, 0, width]
	  	})
	  	}
	  ]
	})
	```
- `duration` (ReactNode)(optional)(mobile only): Sets the duration of the screen transition animations.

# SetupPaths/path/param/searchParam

## SetupPaths

`SetupPaths` function is a utility used to organize and configure paths systematically. It enables developers to define and structure paths within their application architecture efficiently. This function takes an object containing path structures as input and returns a result type representing the configured paths.

## path

`path` is a fundamental building block in defining routes and URLs within a react application. It provides a flexible mechanism for constructing paths with dynamic segments and parameters. Developers can create a path to represent different routes in their application. The `path` offers methods for adding path segments, parameters, and search parameters, as well as generating paths based on the configured settings.

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

# TabsRoute (mobile only)

`TabsRoute` provides a customizable tab navigation component for react-native applications. It includes functionalities to render tabs and switch between different views seamlessly. Supports customizable tab bars and can accommodate various configurations based on user requirements.

## Usage

```tsx
import react from 'react';
import { SafeAreaView, Text } from 'react-native';
import { TabsRoute } from '@resourge/react-router/mobile';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TabsRoute placement="BOTTOM">
        <TabsRoute.Tab path="/home" label="Home">
          <Text>Home Screen</Text>
        </TabsRoute.Tab>
        <TabsRoute.Tab path="/settings" label="Settings">
          <Text>Settings Screen</Text>
        </TabsRoute.Tab>
      </TabsRoute>
    </SafeAreaView>
  );
};

export default App;
```

## Props

- `children`: The child components to be rendered as tabs.
- `placement` (TOP or BOTTOM): The position of the tab bar.
- `renderTabBar` (optional): A function to render the custom tab bar.
	```tsx
	<TabsRoute
	  placement="BOTTOM"
	  renderTabBar={({ placement, children }) => (
	    <CustomTabBar placement={placement}>
	      {children}
	    </CustomTabBar>
	  )}
	>
	  {/* Tab definitions */}
	</TabsRoute>
	```
- `historyMode` (optional): Mode for handling history.
- `onPress` (optional): Function to handle press events.
- `renderLabel` (optional): Render the label of each tab.
- `renderTabBarItem` (optional): Function to render each tab item.
	```tsx
	<TabsRoute
	  placement="BOTTOM"
	  renderTabBarItem={(props) => (
	    <CustomTabBarItem {...props} />
	  )}
	>
	  {/* Tab definitions */}
	</TabsRoute>
	```
- `animated` (optional): Boolean to enable animations.
- `duration` (optional): Duration of animations.

## TabRoute

Component for defining individual tabs within `TabsRoute`.

### Usage

```tsx
import { Text } from 'react-native';
import { TabBar } from '@resourge/react-router/mobile';

const App = () => {
  return (
    <TabsRoute placement="BOTTOM">
      <TabsRoute.Tab path="/home" label="Home">
        <Text>Home Screen</Text>
      </TabsRoute.Tab>
      <TabsRoute.Tab path="/settings" label="Settings">
        <Text>Settings Screen</Text>
      </TabsRoute.Tab>
    </TabsRoute>
  );
};

export default App;
```

### Props

- `label`: Label for the tab.
- `path`: Path for the tab.
- `children`: Content to be rendered within the tab.

## TabBar

Component to render the tab bar.

### Usage

```tsx
import { Text } from 'react-native';
import { TabBar } from '@resourge/react-router/mobile';

const App = () => {
  return (
    <TabBar placement="BOTTOM">
      <Text>Home</Text>
      <Text>Settings</Text>
    </TabBar>
  );
};

export default App;
```

### Props

- `children`: Child components to be rendered within the tab bar.
- `placement` (TOP or BOTTOM): Position of the tab bar.

## TabBarItem

Component to render individual items within the tab bar.

### Usage

```tsx
import { Text } from 'react-native';
import TabBar, { TabBarItem } from '@resourge/react-router/mobile';

const App = () => {
  return (
    <TabBar placement="BOTTOM">
      <TabBarItem>
        <Text>Home</Text>
      </TabBarItem>
      <TabBarItem>
        <Text>Settings</Text>
      </TabBarItem>
    </TabBar>
  );
};

export default App;
```

### Props

- `children`: Content to be rendered within the tab bar item.
- `pressColor` (optional): Press color effect.
- `pressOpacity` (optional): Opacity of the press effect.
- `style` (optional): Style of the tab bar item.

# BottomTabsRoutes (mobile only)

Wrapper component for `TabsRoute` that automatically sets the tab placement to `BOTTOM`.

## Usage

```tsx
import react from 'react';
import { SafeAreaView, Text } from 'react-native';
import { BottomTabRoute } from '@resourge/react-router/mobile';

const App = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <BottomTabsRoute>
                <BottomTabsRoute.Tab path="/home" label="Home">
                    <Text>Home Screen</Text>
                </BottomTabsRoute.Tab>
                <BottomTabsRoute.Tab path="/settings" label="Settings">
                    <Text>Settings Screen</Text>
                </BottomTabsRoute.Tab>
            </BottomTabsRoute>
        </SafeAreaView>
    );
};

export default App;
```

## Props

- `children`: The child components to be rendered as tabs.
- `renderTabBar` (optional): A function to render the custom tab bar.
	```tsx
	<TabsRoute
	  placement="BOTTOM"
	  renderTabBar={({ placement, children }) => (
	    <CustomTabBar placement={placement}>
	      {children}
	    </CustomTabBar>
	  )}
	>
	  {/* Tab definitions */}
	</TabsRoute>
	```
- `historyMode` (optional): Mode for handling history.
- `onPress` (optional): Function to handle press events.
- `renderLabel` (optional): Render the label of each tab.
- `renderTabBarItem` (optional): Function to render each tab item.
	```tsx
	<TabsRoute
	  placement="BOTTOM"
	  renderTabBarItem={(props) => (
	    <CustomTabBarItem {...props} />
	  )}
	>
	  {/* Tab definitions */}
	</TabsRoute>
	```
- `animated` (optional): Boolean to enable animations.
- `duration` (optional): Duration of animations.

# TopTabsRoutes (mobile only)

Wrapper component for `TabsRoute` that automatically sets the tab placement to `TOP`.

## Usage

```tsx
import react from 'react';
import { SafeAreaView, Text } from 'react-native';
import { TopTabsRoutes } from '@resourge/react-router/mobile';

const App = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopTabsRoutes>
                <TopTabsRoutes.Tab path="/home" label="Home">
                    <Text>Home Screen</Text>
                </TopTabsRoutes.Tab>
                <TopTabsRoutes.Tab path="/settings" label="Settings">
                    <Text>Settings Screen</Text>
                </TopTabsRoutes.Tab>
            </TopTabsRoutes>
        </SafeAreaView>
    );
};
export default App;
```

## Props

- `children`: The child components to be rendered as tabs.
- `renderTabBar` (optional): A function to render the custom tab bar.
	```tsx
	<TabsRoute
	  placement="BOTTOM"
	  renderTabBar={({ placement, children }) => (
	    <CustomTabBar placement={placement}>
	      {children}
	    </CustomTabBar>
	  )}
	>
	  {/* Tab definitions */}
	</TabsRoute>
	```
- `historyMode` (optional): Mode for handling history.
- `onPress` (optional): Function to handle press events.
- `renderLabel` (optional): Render the label of each tab.
- `renderTabBarItem` (optional): Function to render each tab item.
	```tsx
	<TabsRoute
	  placement="BOTTOM"
	  renderTabBarItem={(props) => (
	    <CustomTabBarItem {...props} />
	  )}
	>
	  {/* Tab definitions */}
	</TabsRoute>
	```
- `animated` (optional): Boolean to enable animations.
- `duration` (optional): Duration of animations.

# LanguageRoute (web only)

`LanguageRoute` component ensures that the language is present at the beginning of the route path within a react application. By analyzing the URL and enforcing language-specific routing rules, developers can create multilingual web applications that seamlessly adapt to user language preferences, enhancing accessibility and user experience.

Functionality: 
- `Language Detection`: Detects the language parameter in the URL and ensures that it is present at the beginning of the route path.
- `Language Validation`: Developers can provide custom logic to validate the language parameter, ensuring that only supported languages are accepted.
- `Fallback Handling`: The component handles scenarios where the language is missing or unsupported, redirecting users to the appropriate language-specific route.

## Usage

```tsx
import react from 'react';
import { Router, LanguageRoute, Route } from '@resourge/react-router';

const App = () => {
  return (
    <Router>
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
    </Router>
  );
};
```

## Props

- `children` (ReactNode): The children components representing different routes to be rendered within the language-aware context.
- `languages` (string[]): An array of supported languages for the application.
- `checkLanguage` ((lang?: string) => boolean)(optional): Optional custom function to validate the language parameter.
- `fallbackLanguage` (string)(optional): Fallback language to use when the language is missing or unsupported.

# Navigate

`Navigate` component facilitates navigation to a specified destination using the `useNavigate` hook.

## Usage

```tsx
import { Router, Navigate } from '@resourge/react-router';

const MyComponent = () => {
  return (
    <Router>
      <h1>Welcome to My Component</h1>
      <Navigate to="/new-page" replace preventScrollReset />
    </Router>
  );
};
```

## Props

- `to` (string | URL | { searchParams: Record<string, any> }): Specifies the destination URL or object containing search parameters for navigation.
- `action` (ActionType): Specifies the type of action to be performed during navigation. This option allows for fine-grained control over how navigation actions are handled. Possible values include:
	- 'push': Pushes a new entry onto the browser history stack.
	- 'replace': Replaces the current entry in the browser history stack.
	- 'pop': Navigates back to the previous entry in the browser history stack.
	- 'initial': Indicates that the navigation action is the initial page load.
- `preventScrollReset` (boolean)(web only): Determines whether the scroll position should be preserved during navigation. When set to true, the browser will not reset the scroll position to the top of the page after navigation. This option is particularly useful for maintaining the user's scroll position when navigating within long pages or scrollable containers.
- `replace` (boolean): Specifies whether the navigation action should replace the current URL in the browser history stack instead of adding a new entry. When set to true, the current URL will be replaced with the destination URL, effectively modifying the browser history without creating a new entry. 
- `stack` (boolean)(mobile only): Determines whether to clear the history stack after the current URL before adding a new entry. Setting this option to true ensures that all history entries after the current URL are removed before the navigation creates a new history entry.

# Redirect

`Redirect` component is designed to facilitate redirection from one route to another within a react application. It combines the functionality of the `Route` and `Navigate` components to achieve seamless navigation transitions based on specified conditions.

## Usage

```tsx
import { Router, Redirect } from '@resourge/react-router';

const App = () => {
  return (
    <Router>
      {/* Redirect from /old-path to /new-path */}
      <Redirect from="/old-path" to="/new-path" replace />
    </Router>
  );
};
```

## Props

- `from` (string): Specifies the path from which the redirection should occur. When the current route matches the from path, the redirection defined by the to prop will be triggered.
- `to` (string | URL | { searchParams: Record<string, any> }): Specifies the destination path or URL to which the redirection should occur. This can be a string representing the path, a URL object, or an object containing search parameters for the destination URL.
- `replace` (boolean)(optional): Determines whether the redirection should replace the current URL in the browser history stack instead of adding a new entry. When set to true, the current URL will be replaced with the destination URL.

# Link

`Link` component enhances navigation functionality within react applications, providing seamless navigation to a specified destination (`to`). It integrates with the `useLink` hook to manage navigation logic and utilizes the `url` hook to match the current route and apply styling based on the match status.

## Usage (web only)

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

## Usage (mobile only)

```tsx
import { Link } from '@resourge/react-router/mobile';

const MyComponent = () => {
  return (
    <Link 
      to="/about" 
      matchStyle={styles.activeLink}
      onPress={handleClick}
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
- `className` (string)(optional)(web only): Specifies the CSS class(es) to be applied to the link element.
- `matchClassName` (string)(optional)(web only): Specifies the CSS class to be applied to the link element when the destination URL matches the current route. This allows developers to apply custom styling to active links.
- `matchStyle` (string)(optional)(mobile only): Specifies the style to be applied to the link element when the destination URL matches the current route. This allows developers to apply custom styling to active links.
- `exact` (boolean)(optional): Determines whether the link should match the URL exactly. Defaults to false.
- `hash` (boolean)(optional): Specifies whether to include the hash part of the URL when matching. Defaults to false.
- `children` (ReactNode)(optional): Content to be rendered inside the link element.
- `onClick` ((event: MouseEvent<HTMLAnchorElement>) => void)(optional)(web only): Callback function to be executed when the link is clicked.
- `onPress` ((event: GestureResponderEvent) => void)(optional)(mobile only): Callback function to be executed when the link is clicked.
- `...otherAnchorHTMLAttributes` (AnchorHTMLAttributes<HTMLAnchorElement>)(optional)(web only): Additional attributes supported by the `<a>` element, such as `target`, `rel`, etc.
- `...viewProps` (ViewProps)(optional)(mobile only): Additional attributes supported by the `<Pressable>` element.

# Title (web only)

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

# Meta (web only)

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

- `children` (ReactNode)(optional): The content to be wrapped by the Prompt component.
- `when` (boolean | Blocker): When true, it will prompt the user before navigating away from a screen. It also accepts a function that returns a boolean value.
- `message` (string | ((currentUrl: URL, nextUrl: URL, action: ActionType) => string))(optional)(web only): When set, it will prompt the user with a native confirm dialog and the specified message.

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

`useNavigate` hook provides a method for navigation by generating and manipulating URLs based on the provided destination and options. It offers a convenient way to handle navigation actions within a react application while allowing for customization through various options.

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

- `to` (string | URL | { searchParams: Record<string, any> }): Specifies the destination URL or object containing search parameters for navigation.
- `action` (ActionType): Specifies the type of action to be performed during navigation. This option allows for fine-grained control over how navigation actions are handled. Possible values include:
	- 'push': Pushes a new entry onto the browser history stack.
	- 'replace': Replaces the current entry in the browser history stack.
	- 'pop': Navigates back to the previous entry in the browser history stack.
	- 'initial': Indicates that the navigation action is the initial page load.
- `preventScrollReset` (boolean)(web only): Determines whether the scroll position should be preserved during navigation. When set to true, the browser will not reset the scroll position to the top of the page after navigation. This option is particularly useful for maintaining the user's scroll position when navigating within long pages or scrollable containers.
- `replace` (boolean): Specifies whether the navigation action should replace the current URL in the browser history stack instead of adding a new entry. When set to true, the current URL will be replaced with the destination URL, effectively modifying the browser history without creating a new entry. 
- `stack` (boolean)(mobile only): Determines whether to clear the history stack after the current URL before adding a new entry. Setting this option to true ensures that all history entries after the current URL are removed before the navigation creates a new history entry.

# useBackNavigate

`useBackNavigate` hook provides a method for navigation backwards or forwards based on the provided delta number. By default without delta, it will go back.

## Usage

```tsx
import { useBackNavigate } from '@resourge/react-router';

const MyComponent = () => {
  const goBack = useBackNavigate();

  const handleClick = () => {
    goBack();
  };

  return (
    <button onClick={handleClick}>Navigate to Previous Page</button>
  );
};
```

## Parameters

- `delta` (number)(optional): The position in the history to which you want to move, relative to the current page. A negative value moves backwards, a positive value moves forwards. So, for example, backNavigate(2) moves forward two pages and backNavigate(-2) moves back two pages. When undefined it will go back.

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

`useSearchParams` hook is a utility hook designed to retrieve and manage the current search parameters from the URL. It parses the search parameters and provides a reactive way to access and update them within a react component.

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
- `searchParams` (string or string[])(optional): Specifies mandatory search parameters required for route matching.
- `exact` (boolean, default: false)(optional): Specifies whether the URL must exactly match the route path.
- `hash` (boolean, default: false)(optional): Indicates whether to treat the route path as a hash route.

# useSwitch

`useSwitch` hook provides a mechanism for first matching route based on URL paths within react applications. By analyzing the children components provided and matching them against the current URL, developers can dynamically determine which component to render, enhancing application navigation and user experience.

## Usage

```tsx
import react from 'react';
import { Router, useSwitch, Route, Navigate, Redirect } from '@resourge/react-router';

const App = () => {
  return (
    <Router>
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
    </Router>
  );
};
```

## Parameters

- `children` (Array<ReactElement<BaseRouteProps>> | ReactElement<BaseRouteProps>): Children components representing different routes to be rendered.
- `animated` (ReactNode)(optional)(mobile only): Enables screen transition animations.
- `animation` (ReactNode)(optional)(mobile only): Specifies a custom animation style for screen transitions.
- `duration` (ReactNode)(optional)(mobile only): Sets the duration of the screen transition animations.

# useLink

`useLink` hook provides functionality to generate an `href` value and a method for navigation within react application. It leverages the `useNavigate` and `useNormalizeUrl` hooks internally to facilitate seamless navigation to the specified destination.

## Usage (web only)

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

## Usage (mobile only)

```tsx
import { useLink } from '@resourge/react-router/mobile';

const MyComponent = () => {
  const [href, onPress] = useLink({ to: '/new-page', replace: true });

  return (
    <Pressable onPress={onPress}>
      Click me to navigate to the new page
    </Pressable>
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
- `message` (string | ((currentUrl: URL, nextUrl: URL, action: ActionType) => string))(optional)(web only): When set, it will prompt the user with a native `confirm` dialog and the specified message. If not set, it will wait for the `continueNavigation` or `finishBlocking` method to be called.

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
- `baseURL` (string)(optional): The base URL string used for resolving relative URLs. If provided, relative URLs are resolved relative to this base URL.

# viteReactRouter

`viteReactRouter` is a Vite plugin designed to simplify routing in react applications built with Vite. It automates the process of generating HTML files and sitemap for routes, making it easier to add SSO in your projects.

## Features

- Automatic extraction of route metadata from files using TypeScript compiler API.
- Generation of HTML files for each route based on metadata.
- Creation of sitemap.xml file containing URLs for all routes with metadata.
- Default configuration options for easy setup.

## Usage

```typescript
import { viteReactRouter } from '@resourge/react-router/vite';

export default {
    plugins: [
        viteReactRouter({
            defaultInitialRoute: '/home',
            defaultLanguage: 'en',
            description: 'My awesome react app',
            keywords: ['react', 'Vite', 'Routing'],
            onDynamicRoutes: undefined, // Define your custom dynamic routes function here
            title: 'My react App',
            url: 'https://example.com'
        })
    ]
}
```

## Parameters

- `defaultInitialRoute` (string)(optional): Default initial route for the application. Defaults to '/'.
- `defaultLanguage` (string)(optional): Default language for the application. Defaults to 'en'.
- `description` (string | Record<string, string>)(optional): Description metadata for the application. Defaults to an empty string.
- `keywords` (string[] | Record<string, string[]>)(optional): Keywords metadata for the application. Defaults to an empty array.
- `onDynamicRoutes` ((routeMetadata: ViteRouteMetadata) => Array<Partial<ViteRouteMetadata>> | undefined | Promise<Array<Partial<ViteRouteMetadata>> | undefined>)(optional): Function to generate dynamic routes based on route metadata. Defaults to undefined.
- `title` (string | Record<string, string>)(optional): Title metadata for the application. Defaults to an empty string.
- `url` (string)(optional): Origin URL for the site. If not set, sitemap will not be generated.

## Documentation

For comprehensive documentation and usage examples, visit the [react-router documentation](https://resourge.vercel.app/docs/react-router/intro).

## Contributing

Contributions to `@resourge/react-router` are welcome! To contribute, please follow the [contributing guidelines](CONTRIBUTING.md).

## License

`@resourge/react-router` is licensed under the [MIT License](LICENSE).

## Contact

For questions or support, please contact the maintainers:
- GitHub: [Resourge](https://github.com/resourge)