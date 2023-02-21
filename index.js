/**
 * react-router vundefined
 *
 * Copyright (c) resourge.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
import { useUrl, parseSearchParams, parseParams, createNewUrlWithSearch } from '@resourge/react-search-params';
import { createContext, useContext, useRef, cloneElement, forwardRef, useEffect, useState, Children, useMemo } from 'react';
import invariant from 'tiny-invariant';
import 'urlpattern-polyfill';
import { jsx, Fragment } from 'react/jsx-runtime';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const RouterContext = /*#__PURE__*/createContext(null);

/**
 * Hook to access to current URL
 */
const useRouter = () => {
  const context = useContext(RouterContext);
  if (process.env.NODE_ENV !== "production") {
    !context ? process.env.NODE_ENV !== "production" ? invariant(false, 'useUrl can only be used in the context of a <RouterContext>.') : invariant(false) : void 0;
  }
  return useContext(RouterContext);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const RouteContext = /*#__PURE__*/createContext(null);

/**
 * Hook to access first parent 'Route'.
 */
const useRoute = () => {
  return useContext(RouteContext);
};

// To remove when URLPattern becomes native
const cacheCompile = new Map();
const cacheLimit = 10000;
const getUrlPattern = ({
  path,
  baseURL,
  hash,
  hashPath,
  exact
}) => {
  const _exact = exact != null ? exact : false;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (cacheCompile.has(`${path}_${String(hashPath)}_${String(exact)}`)) return cacheCompile.get(`${path}_${String(hashPath)}_${String(exact)}`);
  const pathname = !hash ? `${path}${_exact ? '' : '{/*}?'}` : '*';
  const _hash = hash ? `${hashPath != null ? hashPath : ''}${_exact ? '' : '*'}` : '*';
  const generator = new URLPattern({
    baseURL,
    hostname: '*',
    port: '*',
    protocol: '*',
    pathname,
    hash: _hash,
    search: '*'
  });
  if (cacheCompile.size < cacheLimit) {
    cacheCompile.set(`${path}_${String(hash)}`, generator);
  }
  return generator;
};

/**
 * Method to match href to {@link MatchProps path}
 * @param href {string}
 * @param matchProps {@link MatchProps} - props to define the route
 */
const matchPath = (href, matchProps) => {
  const {
    hash,
    path,
    hashPath
  } = matchProps;
  const pattern = getUrlPattern(matchProps);
  const match = pattern.exec(href);
  if (match) {
    const matchUrl = hash ? match.hash : match.pathname;
    const pathname = matchUrl.groups[0] ? matchUrl.input.replace(`/${matchUrl.groups[0]}`, '') : matchUrl.input;
    const search = hash ? '' : match.search.input;
    const url = new URL(`${pathname}${search ? `?${search}` : ''}`, window.location.origin);
    const params = Object.entries(matchUrl.groups).reduce((obj, [key, value]) => {
      if (key !== '0' && value) {
        obj[key] = value;
      }
      return obj;
    }, {});
    const unique = hash ? href.substring(href.indexOf(match.hash.input), href.length) : href.substring(0, href.lastIndexOf(match.hash.input));
    return {
      unique,
      path,
      url,
      params,
      urlPattern: pattern,
      match,
      hash,
      hashPath
    };
  }
  return null;
};

/**
 * Method to match `url` to `url`
 * 
 * @param url {URL} - Current url.
 * @param matchRoute {MatchRouteProps}
 * @param parentRoute {MatchResult} - Current route parent.
 */
const matchRoute = (url, {
  path,
  hash,
  exact
}, parentRoute) => {
  const baseURL = url.origin;
  const href = url.href;
  const paths = Array.isArray(path) ? path : [path];
  const length = paths.length;
  for (let i = 0; i < length; i++) {
    const p = paths[i];
    let _path = paths[i];
    let hashPath = hash ? p : undefined;
    if (parentRoute) {
      _path = `${parentRoute.path}${!hash ? _path.replace(parentRoute.path, '') : ''}`;
      if (parentRoute.hashPath) {
        var _hashPath;
        hashPath = `${parentRoute.hashPath}${((_hashPath = hashPath) != null ? _hashPath : '').replace(parentRoute.hashPath, '')}`;
      }
    }
    const match = matchPath(href, {
      path: _path,
      hash,
      hashPath,
      baseURL,
      exact
    });
    if (match) {
      return match;
    }
  }
  return null;
};

/**
 * Hook to match path to current `url`.
 * @returns null if it is a no match, otherwise returns {@link MatchResult}
 */
const useMatchRoute = (matchProps, matchResult) => {
  const {
    url
  } = useRouter();
  const parentRoute = useRoute();
  const ref = useRef();
  const _matchResult = matchResult != null ? matchResult : matchRoute(url, matchProps, parentRoute);

  // This is to make sure only routes that changed are render again
  if (!ref.current || !_matchResult || ref.current.unique !== _matchResult.unique) {
    ref.current = _matchResult;
  }
  return ref.current;
};

const validateRouteProps = process.env.NODE_ENV !== "production" ? matchProps => {
  var _matchProps$path;
  matchProps.path = matchProps.path ? matchProps.path : '';
  !(matchProps.hash === true && (Array.isArray(matchProps.path) && matchProps.path.find(p => p.startsWith('#'))
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  || typeof matchProps.path === 'string' && matchProps.path.startsWith('#')) || matchProps.hash !== true && (Array.isArray(matchProps.path) && matchProps.path.every(p => !p.startsWith('#')) || typeof matchProps.path === 'string' && !matchProps.path.startsWith('#'))) ? process.env.NODE_ENV !== "production" ? invariant(false, typeof matchProps.path === 'string' ? `Path '${matchProps.path}' ${matchProps.hash === true ? 'doesn\'t start' : 'start'} with # but 'Route' ${matchProps.hash === true ? 'has' : 'doesn\'t have'} prop hash.` : `Paths '${((_matchProps$path = matchProps.path) != null ? _matchProps$path : []).filter(p => p.startsWith('#')).join(', ')}' start with # but 'Route' doesn't have prop hash.`) : invariant(false) : void 0;
} : () => {};

/**
 * Component that only renders at a certain path.
 *
 * Note: This component mainly uses `useMatchRoute` hook. And Route without `path` will be treated as normal components.
 */
const Route = ({
  children,
  component,
  computedMatch,
  ...matchProps
}) => {
  validateRouteProps(matchProps);
  if (matchProps.path === undefined) {
    return /*#__PURE__*/jsx(Fragment, {
      children: component ? /*#__PURE__*/cloneElement(component, {}, component.props.children, children) : children
    });
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const match = useMatchRoute(matchProps, computedMatch);
  if (match) {
    return /*#__PURE__*/jsx(RouteContext.Provider, {
      value: match,
      children: component ? /*#__PURE__*/cloneElement(component, {}, component.props.children, children) : children
    });
  }
  return null;
};

/**
 * First component that creates the context for the rest of the children.
 *
 * Note: This component mainly uses `useUrl` hook from '@resourge/react-search-params'.
 */
const BrowserRouter = ({
  base = '',
  children,
  ...routeProps
}) => {
  const [url, action] = useUrl();
  return /*#__PURE__*/jsx(RouterContext.Provider, {
    value: {
      url,
      action
    },
    children: /*#__PURE__*/jsx(Route, {
      path: base,
      ...routeProps,
      children: children
    })
  });
};

/**
 * Converter param's of path into there respective value.
 * @param path {string}
 * @param params {T} Object containing key and values of path params
 * @returns 
 */
function generatePath(path, params) {
  return path.replace(/{{0,1}:(\w+)\?{0,1}(\(.*\)){0,1}}{0,1}/g, (originalKey, key) => {
    const value = params[key];
    if (process.env.NODE_ENV !== "production") {
      !!(!originalKey.includes('?') && value === undefined) ? process.env.NODE_ENV !== "production" ? invariant(false, `Value of key '${key}' for path '${path}' cannot be undefined.`) : invariant(false) : void 0;
    }
    return value != null ? value : '';
  }).replace(/\/*\*$/, () => params['*'] == null ? '' : params['*'].replace(/^\/*/, '/'));
}

/* eslint-disable no-useless-escape */

/**
 * Method to resolve `URL`'s
 *  Ex:
 * baseUrl: /home/dashboard
 * 
 * url: "/home" // /home
 * url: "home" // /home/dashboard/home
 * url: "about" // /home/dashboard/about
 * url: "./about" // /home/dashboard/about
 * url: "/about" // /about
 * url: "../contact" // /home/contact
 * url: "../../products" // /products
 * url: "../../../products" // /products
 */
function resolveLocation(url, _baseURL) {
  const baseURL = _baseURL ? _baseURL.lastIndexOf('/') === _baseURL.length - 1 ? _baseURL : `${_baseURL}/` : undefined;
  const m = String(url).replace(/^\s+|\s+$/g, '').match(/^([^:\/?#]+:)?(?:\/\/(?:([^:@\/?#]*)(?::([^:@\/?#]*))?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
  if (!m) {
    throw new RangeError();
  }
  let pathname = m[7] || '';
  let search = m[8] || '';
  const hash = m[9] || '';
  if (baseURL !== undefined) {
    const base = resolveLocation(baseURL);
    if (pathname === '' && search === '') {
      search = base.search;
    }
    /* if (pathname.charAt(0) !== '/') {
    	pathname = (pathname !== '' ? `${(base.pathname === '' ? '/' : '')}${base.pathname.lastIndexOf('/') !== base.pathname.length ? `${base.pathname}/` : base.pathname}${pathname}` : base.pathname);
    } */
    if (pathname.charAt(0) !== '/') {
      pathname = pathname !== '' ? `${base.pathname === '' ? '/' : ''}${base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1)}${pathname}` : base.pathname;
    }
    // dot segments removal
    const output = [];
    pathname.replace(/^(\.\.?(\/|$))+/, '').replace(/\/(\.(\/|$))+/g, '/').replace(/\/\.\.$/, '/../').replace(/\/?[^\/]*/g, p => {
      if (p === '/..') {
        output.pop();
      } else {
        output.push(p);
      }
      return p;
    });
    pathname = output.join('').replace(/^\//, pathname.charAt(0) === '/' ? '/' : '');
  }
  return new URL(pathname + search + hash, window.location.origin);
}

const normalizeUrl = (to, path, params, url, routeUrl) => {
  // If to is string, resolve to with current url
  if (typeof to === 'string') {
    return resolveLocation(to, url.href);
  }
  // If to is URL, just navigate to URL
  else if (to instanceof URL) {
    return to;
  } else if (typeof to === 'function') {
    return normalizeUrl(to(url, routeUrl), path, params, url, routeUrl);
  } else {
    const newUrl = new URL(url);
    if (to.params) {
      if (path) {
        const newParams = {
          ...params,
          ...to.params
        };
        const newPath = generatePath(path, newParams);
        newUrl.pathname = newPath;
      }
    } else {
      Object.entries(to).forEach(([key, value]) => {
        newUrl[key] = value;
      });
    }
    return newUrl;
  }
};

/**
 * Returns a method for making a url from `to`.
 */
const useNormalizeUrl = () => {
  const {
    url
  } = useRouter();
  const {
    url: routeUrl,
    params,
    path
  } = useRoute();
  return to => {
    return normalizeUrl(to, path, params, url, routeUrl);
  };
};

/**
 * Returns a method for navigation `to`.
 */
const useNavigate = () => {
  const generateUrl = useNormalizeUrl();
  return (to, options = {}) => {
    const {
      replace = false,
      action
    } = options;
    const url = generateUrl(to);
    if (window.location.href === url.href) {
      return;
    }
    window.history[replace ? 'replaceState' : 'pushState'](action ? {
      action
    } : null, '', url);
  };
};

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

/**
 * Hook that returns 'href' and onClick method to navigate to link
 */
const useLink = ({
  to,
  replace,
  ...aProps
}) => {
  const navigate = useNavigate();
  const normalizeUrl = useNormalizeUrl();
  const url = normalizeUrl(to);
  const onClick = event => {
    try {
      if (aProps.onClick) aProps.onClick(event);
    } catch (ex) {
      event.preventDefault();
      throw ex;
    }
    if (!event.defaultPrevented && event.button === 0 && (!aProps.target || aProps.target === '_self') && !isModifiedEvent(event)) {
      event.preventDefault();
      navigate(url, {
        replace
      });
    }
  };
  return [url.href, onClick];
};

/**
 * Component extends element `a` and navigates to `to`.
 * 
 * Note: This component mainly uses `useLink` hook to navigate to `to` and `useMatchRoute` to match route.
 */
const Link = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    to,
    replace,
    exact,
    hash,
    className,
    matchClassName,
    ...aProps
  } = props;
  const {
    url
  } = useRouter();
  const [href, onClick] = useLink(props);
  const match = href === url.href;
  const _class = [className, match ? matchClassName : ''].filter(cn => cn);
  const _className = _class && _class.length ? _class.join(' ') : undefined;
  return (
    /*#__PURE__*/
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    jsx("a", {
      ...aProps,
      ref: ref,
      className: _className,
      href: href,
      onClick: onClick
    })
  );
});
Link.displayName = 'Link';

/**
 * Navigates to `to`.
 *
 * Note: This component mainly uses `useNavigate` hook to navigate to `to`.
 */
const Navigate = ({
  to,
  ...navigateOptions
}) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, navigateOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PromptNextContext = /*#__PURE__*/createContext(null);

/**
 * To use inside Prompt components.
 * Contains the `next` method to navigate after "Prompt" is finished.
 */
const usePromptNext = () => {
  const context = useContext(PromptNextContext);
  if (process.env.NODE_ENV !== "production") {
    !context ? process.env.NODE_ENV !== "production" ? invariant(false, 'usePromptNext can only be used in the context of a <PromptContext/Prompt> component.') : invariant(false) : void 0;
  }
  return context;
};

/**
 * Fires before the route changes.
 * @param beforeURLChange
 *  If result:
 * 		`true` routing will occur normally
 *  	`false` will prevent route from changing
 */
const useBeforeURLChange = beforeURLChange => {
  const beforeURLChangeRef = useRef(beforeURLChange);
  beforeURLChangeRef.current = beforeURLChange;
  useEffect(() => {
    const _beforeURLChange = event => beforeURLChangeRef.current(event);
    window.addEventListener('beforeURLChange', _beforeURLChange, false);
    return () => {
      window.removeEventListener('beforeURLChange', _beforeURLChange, false);
    };
  }, []);
};

/**
 * Fires before the route change, and serves to block or not the current route.
 * @param blocker {Blocker}
 * @returns blockerResult {BlockerResult}
 */
const useBlocker = blocker => {
  const {
    url
  } = useRoute();
  const [{
    isBlocking,
    continueNavigation
  }, setBlocker] = useState({
    isBlocking: false,
    continueNavigation: () => {}
  });
  const finishBlocking = () => {
    setBlocker({
      isBlocking: false,
      continueNavigation: () => {}
    });
  };
  useBeforeURLChange(event => {
    const continueNavigation = () => {
      event.next();
      finishBlocking();
    };
    const isBlocking = blocker(url, event.url, event.action);
    if (isBlocking) {
      setBlocker({
        isBlocking: true,
        continueNavigation
      });
    }
    return !isBlocking;
  });
  return {
    isBlocking,
    continueNavigation,
    finishBlocking
  };
};

/**
 * @param when When `true` it will prompt the user 
 * 	before navigating away from a screen. 
 *  (accepts method that return's boolean).
 * @param message When set, will prompt the user with native `confirm` and message.
 * 	When `undefined` will wait `[1]` method to be called
 * @returns promptResult {BlockerResult}
 */
const usePrompt = ({
  when,
  message
}) => {
  const _blocker = typeof when === 'boolean' ? () => when : when;
  return useBlocker((routeUrl, url, action) => {
    const isBlocking = _blocker(routeUrl, url, action);
    if (isBlocking && message) {
      const _message = typeof message === 'string' ? message : message(routeUrl, url, action);
      return !window.confirm(_message);
    }
    return isBlocking;
  });
};

/**
 * Component for prompting the user before navigating.
 * 
 * * Note: This component mainly uses `usePrompt` hook.
 */
const Prompt = ({
  children,
  ...promptProps
}) => {
  const promptResult = usePrompt(promptProps);
  if (!promptResult.isBlocking) {
    return /*#__PURE__*/jsx(Fragment, {});
  }
  return /*#__PURE__*/jsx(PromptNextContext.Provider, {
    value: promptResult,
    children: children
  });
};

/**
 * Navigates from `path` to `to`.
 *
 * Note: This component uses the component Route and Navigate.
 */
const Redirect = ({
  from,
  to,
  replace,
  ...routeProps
}) => /*#__PURE__*/jsx(Route, {
  path: from,
  ...routeProps,
  children: /*#__PURE__*/jsx(Navigate, {
    replace: replace,
    to: to
  })
});

/**
 * Method to match `search(s)` to `url`
 * 
 * @param url {URL} - Current url.
 * @param matchRoute {UseSearchRouteProps}
 * @param parentRoute {MatchResult} - Current route parent.
 */
const matchSearchRoute = (url, {
  search,
  hash,
  exact
}, parentRoute) => {
  const _search = Array.isArray(search) ? search : [search];
  const hashUrl = new URL(url.hash.replace('#', ''), url.origin);
  if (_search.every(search => hashUrl.searchParams.has(search))) {
    const matchProps = {
      path: '*',
      exact,
      hash
    };
    return matchRoute(url, matchProps, parentRoute);
  }
  return null;
};

/**
 * Hook to match search(s) to current `url`.
 * @returns null if it is a no match, otherwise returns {@link MatchResult}
 */
const useSearchRoute = (matchSearchProps, computedMatch) => {
  const {
    url
  } = useRouter();
  const parentRoute = useRoute();
  const ref = useRef();
  const _matchResult = computedMatch != null ? computedMatch : matchSearchRoute(url, matchSearchProps, parentRoute);

  // This is to make sure only routes that changed are render again
  if (!ref.current || !_matchResult || ref.current.unique !== _matchResult.unique) {
    ref.current = _matchResult;
  }
  return ref.current;
};

/**
 * Component that only renders at a certain `search`.
 *
 * Note: This component mainly uses `useSearchRoute` hook.
 */
const SearchRoute = ({
  children,
  component,
  computedMatch,
  ...matchProps
}) => {
  const match = useSearchRoute(matchProps, computedMatch);
  if (match) {
    return /*#__PURE__*/jsx(RouteContext.Provider, {
      value: match,
      children: component ? /*#__PURE__*/cloneElement(component, {}, children) : children
    });
  }
  return null;
};

const isNavigateOrRedirect = props => {
  return props.to !== undefined;
};
const isSearchRoute = props => {
  return props.search !== undefined;
};
const isRoute = props => {
  return !isNavigateOrRedirect(props) && !isSearchRoute(props);
};
const getMatchFromProps = (url, parentRoute, props) => {
  var _path;
  if (process.env.NODE_ENV !== "production") {
    !(props.search || props.to || !props.path || props.path) ? process.env.NODE_ENV !== "production" ? invariant(false, '`useSwitch` can only accept component\'s with `path`, `search`, `from` or `to` attributes') : invariant(false) : void 0;
  }
  const searchBaseProps = props;
  if (isSearchRoute(searchBaseProps)) {
    return matchSearchRoute(url, {
      ...searchBaseProps
    }, parentRoute);
  }
  const path = (_path = props.path) != null ? _path : props.from;
  if (path) {
    validateRouteProps({
      ...props,
      path
    });
    return matchRoute(url, {
      ...props,
      path
    }, parentRoute);
  }
  return matchRoute(url, {
    ...searchBaseProps,
    path: '*'
  }, parentRoute);
};

/**
 * Returns the first children component with props `path`, `search`, `to/from` that matches the current location or without previous props.
 */
const useSwitch = children => {
  const {
    url
  } = useRouter();
  const parentRoute = useRoute();
  const childArray = Children.toArray(children);
  for (let i = 0; i < childArray.length; i++) {
    const child = childArray[i];
    if (isRoute(child.props) && child.props.path === undefined) {
      return child;
    }
    const match = getMatchFromProps(url, parentRoute, child.props);
    if (match) {
      return /*#__PURE__*/cloneElement(child, {
        // @ts-expect-error computedMatch does exist but I want it so be exclusive to switch
        computedMatch: match
      });
    }
  }
  return null;
};

/**
 * Component that makes sure the first matching path renders.
 *
 * Note: This component mainly uses `useSwitch` hook.
 */
const Switch = ({
  children
}) => {
  return useSwitch(children);
};

/**
 * Hook to access action that lead to the current `URL`.
 */
const useAction = () => {
  return useRouter().action;
};

/**
 * Returns the current route params
 *
 * @param transformsParams Method to transform the params
 */
const useParams = (transformsParams = params => params) => {
  const route = useRoute();
  const params = {
    ...route.params
  };
  return transformsParams(params);
};

/**
 * Returns the current search parameters and a method to change
 * @param defaultParams {T}
 */
const useSearchParams = defaultParams => {
  const {
    hash,
    url: routeUrl
  } = useRoute();
  const {
    url
  } = useRouter();
  const navigate = useNavigate();
  const search = routeUrl.search;
  const _searchParams = routeUrl.searchParams;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchParams = useMemo(() => parseSearchParams(_searchParams, defaultParams), [search]);
  const setParams = newParams => {
    const newSearch = parseParams(newParams);
    if (search !== newSearch) {
      const newURL = createNewUrlWithSearch(url, newSearch, hash);
      navigate(newURL);
    }
  };
  return [searchParams, setParams];
};

class ParamPath {
  constructor() {
    this.key = '';
    this.param = '';
  }
}
const Param = (param, config) => {
  if (process.env.NODE_ENV !== "production") {
    !!param.includes(':') ? process.env.NODE_ENV !== "production" ? invariant(false, 'Don\'t use \':\' inside `param`.') : invariant(false) : void 0;
  }
  const instance = new ParamPath();
  instance.param = `:${param}`;
  instance.key = param;
  if (config != null && config.optional) {
    instance.param = `{${instance.param}}?`;
  }
  instance.config = config;
  return instance;
};

/* eslint-disable @typescript-eslint/prefer-reduce-type-parameter */
function createPathWithCurrentLocationHasHash(path) {
  const newPath = new URL(path, window.location.origin);
  const windowURL = new URL(window.location);
  newPath.hash = window.location.pathname && window.location.pathname !== '/' ? windowURL.href.replace(windowURL.origin, '') : '';
  return newPath.href;
}
class Path {
  constructor(config) {
    this.config = {};
    this.paths = [];
    this.config = config != null ? config : {};
  }
  clone() {
    const _this = new Path();
    _this.paths = [...this.paths];
    _this._routes = {
      ...this._routes
    };
    _this._includeCurrentURL = this._includeCurrentURL;
    _this.config = this.config;
    return _this;
  }

  /**
   * Makes method `get` to return the current path as hash.
   * @param includeCurrentURL {boolean}
   */
  includeCurrentURL(includeCurrentURL) {
    const _this = this.clone();
    _this._includeCurrentURL = includeCurrentURL;
    return _this;
  }

  /**
   * Add's new value to the path. (Add's the value into the path in the calling other).
   * @param path {string} - new path part
   */
  addPath(path) {
    const _this = this.clone();
    if (path) {
      _this.paths.push(path);
    }
    return _this;
  }

  /**
   * Add's param to the path. (Add's the param into the path in the calling other).
   * @param value {string} - param name
   */

  /**
   * Add's param to the path. (Add's the param into the path in the calling other).
   * @param value {string} - param name
   * @param config {ParamsConfig<ParamsValue>} - param configuration.
   */
  param(value, config) {
    const _this = this.clone();
    if (value instanceof ParamPath) {
      _this.paths.push(value);
      return _this;
    }
    _this.paths.push(Param(value, config));
    return _this;
  }

  /**
   * Children path's of current path.
   * 
   * @param routes {Record<string, Path<any, any>>} - object containing the current path children path's
   */
  routes(routes) {
    const _this = this.clone();
    if (process.env.NODE_ENV !== "production") {
      !Object.entries(routes).find(([key, value]) => {
        return !(value.config.hash || value.config.hashModal);
      }) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Path\'s inside \'.routes({ ... })\' cannot be hash path\'s') : invariant(false) : void 0;
    }
    _this._routes = routes;
    return _this;
  }
  getBasePath(basePath = '') {
    let newBasePath = basePath;
    if (this.config.hash || this.config.hashModal) {
      newBasePath = '#';
    }
    if (this.config.isModal || this.config.hashModal) {
      newBasePath += '/modal';
    }
    return newBasePath;
  }
  createPath(basePath, transforms, beforePaths) {
    var _this$_routes;
    // Groups new transformations with transformations from parents
    const _transforms = transforms ? [...transforms] : [];
    // Groups new transformations with transformations from parents
    const _beforePaths = beforePaths ? [...beforePaths] : [];

    // Creates path for current route
    const path = `${this.getBasePath(basePath)}/${this.paths.map(path => {
      var _path$config, _path$config2;
      if (typeof path === 'string') {
        return path;
      }
      if ((_path$config = path.config) != null && _path$config.transform) {
        _transforms.push(params => {
          params[path.key] = path.config.transform(params[path.key]);
        });
      }
      if ((_path$config2 = path.config) != null && _path$config2.beforePath) {
        _beforePaths.push(params => {
          params[path.key] = path.config.beforePath(params[path.key]);
        });
      }
      return path.param;
    }).join('/')}`;

    // Generates routes
    const paths = Object.entries((_this$_routes = this._routes) != null ? _this$_routes : {}).reduce((obj, [key, value]) => {
      obj[key] = value.createPath(path === '/' ? '' : path, _transforms, _beforePaths);
      return obj;
      // Too hard to put a working type that doesn't create a problem in return
    }, {});
    return {
      path,
      get: params => {
        const _params = params ? {
          ...params
        } : {};
        _beforePaths.forEach(beforePaths => {
          beforePaths(_params);
        });
        let newPath = generatePath(path, _params);
        if (this._includeCurrentURL) {
          newPath = createPathWithCurrentLocationHasHash(newPath);
        }
        return newPath;
      },
      useParams: () => {
        return useParams(params => {
          _transforms.forEach(transform => {
            transform(params);
          });
          return params;
        });
      },
      ...paths
    };
  }
}

/**
 * Creates a new path
 * @param path {string} - path base/start
 */
const path = (path, config) => {
  return new Path(config).addPath(path);
};

/**
 * Creates the path's structure.
 * @param paths {R} - object with path's structure.
 */
const SetupPaths = paths => {
  return Object.entries(paths).reduce((obj, [key, value]) => {
    // @ts-expect-error I want createPath as private for use
    obj[key] = value.createPath();
    return obj;
  }, {});
};

export { BrowserRouter, Link, Navigate, Param, Prompt, PromptNextContext, Redirect, Route, RouteContext, RouterContext, SearchRoute, SetupPaths, Switch, generatePath, matchPath, matchRoute, path, resolveLocation, useAction, useBeforeURLChange, useBlocker, useLink, useMatchRoute, useNavigate, useNormalizeUrl, useParams, usePrompt, usePromptNext, useRoute, useRouter, useSearchParams, useSearchRoute, useSwitch };
//# sourceMappingURL=index.js.map
