# react-router

`@resourge/react-router` is a client side routing system that allows your app to update the url without making another request for another HTML from the server.
Built with hooks in mind and components after, giving the developer the opportunity to, if they desire, do "things" differently.

Visit our website [resourge-react-router.netlify.app](https://resourge-react-router.netlify.app/)

## Features

- Build with typescript.
- Build on top of native browser navigation, works with native browser navigation.
- Uses native URLPattern (with a polyfill for unsupported browsers(to be removed in the future)).
- 'react-router v5' look alike.
- Methods to simplify path's creation with [SetupPaths](##setupPaths).
- Small (even smaller if you ignore the polyfill(it will be removed in future when all browsers support it))


## Installation

Install using [Yarn](https://yarnpkg.com):

```sh
yarn add @resourge/react-router
```

or NPM:

```sh
npm install @resourge/react-router --save
```

## Usage

```JSX
import React from 'react'

import {
  BrowserRouter,
  Link,
  Route,
  Switch,
  Navigate,
  path,
  Redirect,
  SetupPaths, 
  path
} from '@resourge/react-router'

// Lazy loads
const ProductList = React.lazy(() => import('./ProductList'));
// Lazy loads
const ProductForm = React.lazy(() => import('./ProductForm'));

const RoutePaths = SetupPaths({
  HOME: path(),
  PRODUCT: path('product')
  .routes({
    LIST: path('list').searchParams<{ perPage: number, itemsPerPage: number }>('perPage', 'itemsPerPage'),
    FORM: path().param('productId')
  })
})

function App() {
  return (
    <BrowserRouter>
      <button onClick={() => {
        window.history.pushState(null, '', RoutePaths.HOME.get())
      }}
      >
        Home
      </button>
      <Link
        to={RoutePaths.PRODUCT.LIST.get({ searchParams: { perPage: 0, itemsPerPage: 10 } })}
      >
        Product List
      </Link>
      <Link
        to={
          RoutePaths.PRODUCT.FORM.get({
            productId: Math.random().toFixed(0)
          })
        }
      >
        Product
      </Link>
      <Switch>
        <Route path={RoutePaths.HOME}>
          Home
        </Route>
        <Route 
          path={RoutePaths.PRODUCT}
        >
          <ProductList />
        </Route>
        <Route path={RoutePaths.PRODUCT.FORM}>
          <ProductForm />
        </Route>
        {/* Redirect */}
        <Redirect from={'*'} to={RoutePaths.HOME.get()} />
        {/* OR */}
        <Navigate to={RoutePaths.HOME.get()} />
        {/* Redirect */}
      </Switch>
    </BrowserRouter>
  )
}

export default App

```

## SetupPaths

SetupPaths serves to simplify navigation between routes, by putting path creation, path transformation, useParams and useSearchParams all in one place.

```Typescript
// Build Routes
// It's Optional
// It's basically a helper to setup paths, returns {
//   path // actual built path. ex: '/product', '/product/:productId/
//   get // method that returns the path. In case the path contains 
//          params, the method will require an object containing the keys
//	        and values. ex:
//            RoutePaths.PRODUCT.FORM.get({
//              productId: '....'
//            })
//   useParams // react hook that returns the params of the route. 
//                Depending on the 'options' ("param('productId', <<options>>)")
//                it will automatically transform the params into there respective value, ex:
//	                param('productId', {
//                    // Makes productId optional
//                    optional: true, 
//                    // Transforms productId from string to number
//                    onUseParams: (productId) => Number(productId) 
//	                })
//                In this example 'const { productId } = RoutePaths.PRODUCT.FORM.useParams()', productId will be number because of transform
// }
import { SetupPaths, path, param } from '@resourge/react-router';

// For multiple instance of the same param
const deliveryIdParam = param('deliveryId', {
	onUseParams: (deliveryId) => Number(deliveryId)
})

const RoutePaths = SetupPaths({
  HOME: path(),
  PRODUCT: path('product')
  .routes({
  	LIST: path('list').searchParams<{ perPage: number, itemsPerPage: number }>('perPage', 'itemsPerPage'),
    FORM: path().param('productId'),
    FORM_V2: path('v2')
	.param('productId', {
		onUseParams: (productId) => Number(productId)
	})
	.param('productName', {
		optional: true
	})
  }),
  DELIVERY: path('delivery').param(deliveryIdParam).addPath('details')
})


RoutePaths.HOME.path // '/home'
RoutePaths.HOME.get() // '/home'

RoutePaths.PRODUCT.path // '/product/list'
RoutePaths.PRODUCT.get({ searchParams: { perPage: 0, itemsPerPage: 10 } }) // '/product/list?perPage=0&itemsPerPage=10'
RoutePaths.PRODUCT.useSearchParams() // '{ perPage: 0, itemsPerPage: 10 }'

RoutePaths.PRODUCT.LIST.path // '/product'
RoutePaths.PRODUCT.LIST.get() // '/product'

RoutePaths.PRODUCT.FORM.path // '/product/:productId'
RoutePaths.PRODUCT.FORM.get({ product: '1' }) // '/product/1'
// To add searchParams
RoutePaths.PRODUCT.FORM.get({ product: '1', searchParams: { q: 'Search Query'} }) // '/product/1?q=Search Query'
RoutePaths.PRODUCT.FORM.useParams() // '{ productId: '1' }'

RoutePaths.PRODUCT.FORM_V2.path // '/product/v2/:productId/{:productName?}'
RoutePaths.PRODUCT.FORM_V2.get({ product: 1 }) // '/product/v2/1/'
RoutePaths.PRODUCT.FORM_V2.useParams() // '{ productId: 1, productName: undefined }'

RoutePaths.DELIVERY.path // '/delivery/:id/details'
RoutePaths.DELIVERY.get({ id: 1 }) // '/delivery/1/details'
RoutePaths.DELIVERY.useParams() // '{ id: 1 }'
```

## BrowserRouter

First component that creates the context for the rest of the children. <br>
_Note: This component mainly uses `useUrl` hook from '@resourge/react-search-params'._

```JSX
import { BrowserRouter } from '@resourge/react-router'

function App() {
  return (
    <BrowserRouter>
	  ....
    </BrowserRouter>
  )
}
```

## Route

Component that only renders at a certain path. <br>
_Note: This component mainly uses `useMatchRoute` hook._

```JSX
import { Route } from '@resourge/react-router'

<Route 
	path={'/'} // Route path(s), can be an array
	// exact // Makes it so 'URL' path needs to be exactly as the path (default: false)
	// hash // Turn 'route' into 'hash route' (default: false)
	// component={<>Home page</>} When defined Route children will be injected into the component
	// fallback // Component to be used inside suspense
>
	Home page
</Route>
```

## LanguageRoute

Component that makes sure language is present at the begin of the route.

```JSX
import { LanguageRoute } from '@resourge/react-router'

<LanguageRoute
	// Languages allowed
	languages={['en', 'pt']}
	/**
	 * Incase there is no language or the language is not accepted
	 */
	// fallbackLanguage='pt' // Incase there is no language or the language is not accepted
	// checkLanguage={(lang) => true} // For custom language validation
>
	....
</LanguageRoute>
```

### useLanguageContext

```JSX
import { useLanguageContext } from '@resourge/react-router'

// Route language in case LanguageRoute exist's.
const language = useLanguageContext(); 
```

### updateLanguageRoute

Method to update language in route.

```JSX
import { updateLanguageRoute } from '@resourge/react-router'

updateLanguageRoute('en')
```

## Link

Component extends element `a` and navigates to `to`. <br>
_Note: This component mainly uses `useLink` hook to navigate to `to` and `useMatchRoute` to match route._ <br>
_Note: 'to' also gets [normalize](##normalize)_

```JSX
import { Link } from '@resourge/react-router'

<Link
  to={'/'}
>
  Home Link
</Link>
```

## Navigate

Navigates to `to`. <br>
_Note: This component mainly uses `useNavigate` hook to navigate to `to`._ <br>
_Note: 'to' also gets [normalize](##normalize)_

```JSX
import { Navigate } from '@resourge/react-router'

<Navigate
  to={'/'}
/>
```

## Prompt

Component for prompting the user before navigating. <br>
_Note: This component mainly uses `usePrompt` hook._

```JSX
import { Prompt } from '@resourge/react-router'

<Prompt
  // Boolean that defines if it's going to be triggered on route change
  // Can be a method "(routeUrl: URL, url: URL, action: EVENTS) => boolean"
  when={true} 
/>
```

## Redirect

Navigates from `path` to `to`. <br>
_Note: This component uses the component Route and Navigate._ <br>
_Note: 'to' also gets [normalize](##normalize)_

```JSX
import { Redirect } from '@resourge/react-router'

<Redirect from={'*'} to={'/'} />
```

## Switch

Component that makes sure the first matching path renders. <br>
_Note: This component mainly uses `useSwitch` hook._

```JSX
import { Switch } from '@resourge/react-router'

<Switch>
  <Route path={'/'}>
    HomePage
  </Route>
  <Route path={'/product'}>
    ProductPage
  </Route>
</Switch>
```

## Title

Title component. <br>
_Note: This component is not the same as Title from SSR._

```JSX
import { Title } from '@resourge/react-router'

<Title>
  Title content
</Title>
```

## Meta

Meta component. <br>
_Note: This component is not the same as Meta from SSR._

```JSX
import { Meta } from '@resourge/react-router'

<Meta {...metaProps}/>
```

## useBeforeURLChange

Fires before the route changes.
If result:
  `true` routing will occur normally
  `false` will prevent route from changing

```JSX
import { useBeforeURLChange } from '@resourge/react-router'

useBeforeURLChange(() => {
  return true; // or false
})
```

## useBlocker

Fires before the route change, and serves to block or not the current route.
Returns:
  isBlocking - true/false for if it is blocking
  next - Method that is going to call the original navigation

```JSX
import { useBlocker } from '@resourge/react-router'

const [isBlocking, next] = useBlocker(() => {
  return true; // or false
})
```

## useLink

Hook that returns 'href' and onClick method to navigate to link <br>
_Note: 'to' also gets [normalize](##normalize)_

```JSX
import { useLink } from '@resourge/react-router'

const [href, onClick] = useLink({
  to: '/product'
})
```

## useMatchPath

Hook to match path to current `url`.
Returns null if it is a no match, otherwise returns match result.

```JSX
import { useMatchPath } from '@resourge/react-router'

const match = useMatchPath({
  path: '/product'
})
```

## useNavigate

Returns a method for navigation `to`. <br>
to - Can an string, URL or { searchParams: object }. <br>
_Note: { searchParams: object } will replace current `URL` URLSearchParams_
_Note: 'to' also gets [normalize](##normalize)_

```JSX
import { useNavigate } from '@resourge/react-router'

const navigate = useNavigate()
```

## useNormalizeUrl

Returns a method for normalize a url from `to`. <br>
to - Can an string, URL or { searchParams: object }. <br>
_Note: { searchParams: object } will replace current `URL` URLSearchParams_
_Note: 'to' also gets [normalize](##normalize)_

```JSX
import { useNormalizeUrl } from '@resourge/react-router'

const normalizeUrl = useNormalizeUrl()
...

const url = normalizeUrl('/product');
```

## useParams

Returns the current route params

```JSX
import { useParams } from '@resourge/react-router'

const params = useParams()

// or

const params = useParams((params) => {
  return {
    productId: Number(params.productId)
  }
})
```

## usePrompt

Fires before the route change and prompts the user
Returns:
  isBlocking - true/false for if it is blocking
  next - Method that is going to call the original navigation

```JSX
import { usePrompt } from '@resourge/react-router'

const [isBlocking, next] = usePrompt({
  // When `true` it will prompt the user 
  // before navigating away from a screen. 
  // (accepts method that return's boolean).
  when,
  // When set, will prompt the user with native `confirm` and message.
  // When `undefined` will wait `[1]` method to be called
  message
})
```

## useSearchParams

Returns the current search parameters.

```JSX
import { useSearchParams } from '@resourge/react-router'

const searchParams = useSearchParams({} /* default params */)
```

## useSwitch

Returns the first children component who props `path` or `search` matches the current location.

```JSX
import { useSwitch } from '@resourge/react-router'

const matchComponent = useSwitch(children)
```

## useRoute

Hook to access first parent 'Route'.

```JSX
import { useRoute } from '@resourge/react-router'

const route = useRoute()
```

## useRouter

Hook to access to current URL.

```JSX
import { useRouter } from '@resourge/react-router'

const { url, action } = useRouter()
```

## useAction

Hook to access action that lead to the current `URL`.

```JSX
import { useAction } from '@resourge/react-router'

const action = useAction()
```

## usePromptNext

To use inside Prompt components.
Contains the `next` method to navigate after "Prompt" is finished.

```JSX
import { usePromptNext } from '@resourge/react-router'

const next = usePromptNext()
```

## Utils

### generatePath

Converter param's of path into there respective value.

```Typescript
import { generatePath } from '@resourge/react-router'

const newPath = generatePath('/product/:productId', { productId: 1 })
```
### resolveLocation

Method to resolve `URL`'s. <br>
_Note: 'to' also gets [normalize](##normalize)_

```Typescript
import { resolveLocation } from '@resourge/react-router'

const to = '../contact';

const newUrl = resolveLocation(to, '/home/dashboard') // URL pathName '/home/contact'
```

### matchPath

Method to match href to path

```Typescript
import { matchPath } from '@resourge/react-router'

const math = matchPath('/product', {
	path: '/product'
});
```

## Normalize

Ex:
  baseUrl: /home/dashboard
  
  to: "/home" // /home
  to: "home" // /home/dashboard/home
  to: "about" // /home/dashboard/about
  to: "./about" // /home/dashboard/about
  to: "/about" // /about
  to: "../contact" // /home/contact
  to: "../../products" // /products
  to: "../../../products" // /products

## Why

I love react-router, but the new version it's just not for me. It takes a lot of freedom and functionalities (prompt) for few specific new functionalities (loader, etc).
Things I dislike about the new react-router version:
  - Removal of multiple "path"'s;
  - Removal of optional params and having to duplicate routes feels uglier;
  - Removal of prompt/blocker;
  - Not being able to put layout/components inside routes and having to use outlet for routes that most of the times are specific to a specific page;
  - Having to duplicate a lot of routes;
  - Removal of custom Route's, for example "ProtectedRoute";

## License

MIT Licensed.
