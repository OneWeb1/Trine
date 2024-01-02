import { FC } from 'react';

import { Link } from 'react-router-dom';

interface ICustomLink {
	value: string;
	to: string;
}

const styles = {
	textDecoration: 'none',
	color: '#0053D0',
	fontWeight: 600,
};

const CustomLink: FC<ICustomLink> = ({ value, to }) => {
	return (
		<Link style={styles} to={to}>
			{value}
		</Link>
	);
};

export default CustomLink;
