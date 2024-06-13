import { useDispatch } from 'react-redux';
import { setVisibleModal } from '../store/slices/app.slice';
import styles from './../stylesheet/styles-ui/VaweButton.module.scss';

import { TbLivePhoto } from 'react-icons/tb';

const VaweButton = () => {
	const dispatch = useDispatch();
	const clickHandler = () => {
		dispatch(setVisibleModal('lw'));
	};

	return (
		<button className={styles.button} onClick={clickHandler}>
			<TbLivePhoto style={{ fontSize: '16px' }} /> <span>Лайв виграші</span>
		</button>
	);
};

export default VaweButton;
