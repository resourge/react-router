import { useAction } from './useAction';
import { useBeforeURLChange } from './useBeforeURLChange';
import { useBlocker } from './useBlocker';
import { type Blocker } from './useBlocker';
import { useLink } from './useLink';
import { type UseLinkProps } from './useLink';
import { useMatchRoute, matchRoute } from './useMatchRoute';
import { type MatchPropsRoute } from './useMatchRoute';
import { useNavigate } from './useNavigate';
import { type NavigateOptions } from './useNavigate';
import { type NavigateTo } from './useNormalizeUrl';
import { useNormalizeUrl } from './useNormalizeUrl';
import { useParams } from './useParams';
import { type UsePromptProps } from './usePrompt';
import { usePrompt } from './usePrompt';
import { useSearchParams } from './useSearchParams';
import { useSearchRoute } from './useSearchRoute';
import { type UseSearchRouteProps } from './useSearchRoute';
import { useSwitch } from './useSwitch';

export { 
	useAction,
	useBeforeURLChange,
	
	useBlocker,
	type Blocker,
	
	useNormalizeUrl,
	type NavigateTo,

	useLink,
	type UseLinkProps,

	useMatchRoute, matchRoute,
	type MatchPropsRoute,

	useNavigate,
	type NavigateOptions,

	useParams,

	usePrompt,
	type UsePromptProps,

	useSearchParams,

	useSearchRoute,
	type UseSearchRouteProps,

	useSwitch
}
