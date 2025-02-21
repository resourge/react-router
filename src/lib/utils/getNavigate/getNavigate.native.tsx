import { Navigate } from '../../components/index.native';

export function getNavigate(to: string) {
	return {
		component: (
			<Navigate
				to={to}
			/>
		)
	};
}
