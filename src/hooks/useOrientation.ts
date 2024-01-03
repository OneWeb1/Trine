import { useEffect, useState } from 'react';

const useOrientation = () => {
	const [orientation, setOrientation] = useState(getOrientation());

	useEffect(() => {
		const handleOrientationChange = () => {
			setOrientation(getOrientation());
		};

		window.addEventListener('orientationchange', handleOrientationChange);
		window.addEventListener('resize', handleOrientationChange);

		return () => {
			window.removeEventListener('orientationchange', handleOrientationChange);
			window.removeEventListener('resize', handleOrientationChange);
		};
	}, []);

	return orientation;
};

const getOrientation = () => {
	if (window.matchMedia('(orientation: portrait)').matches) {
		return 'portrait';
	} else if (window.matchMedia('(orientation: landscape)').matches) {
		return 'landscape';
	}

	return 'unknown';
};

export default useOrientation;
