import { Navigate } from '../../components/index';

export function getNavigate(to: string) {
	return {
		component: (
			<Navigate
				to={to}
			/>
		)
	};
}
