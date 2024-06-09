import {
	FC,
	Dispatch,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from 'react';
import './style.css';

import { RootState as CustomRootState } from '../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setAccount, setVisibleModal } from '../../store/slices/app.slice';
import WheelFortuneService from '../../services/WheelFortuneService';
import Spinner from '../spinner';
import AdminService from '../../services/AdminService';

type typeSector = { color: string; label: string };

interface WheelProps {
	bet: number;
	setBet: Dispatch<SetStateAction<number>>;
}

const Wheel: FC<WheelProps> = ({ bet }) => {
	const dispatch = useDispatch();
	const { account } = useSelector((state: CustomRootState) => state.app);
	const [sectors, setSectors] = useState<typeSector[]>([]);
	const [isVisibleBorder, setIsVisibleBorder] = useState<boolean>(false);
	const [deg, setDeg] = useState<number>(180);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const spinRef = useRef<HTMLDivElement | null>(null);
	const timeClickRef = useRef<number | null>(Number(new Date()) - 10000);
	const rand = (min: number, max: number) => Math.floor(max - min + 1 + min);

	const wheelContainer = (sectors: typeSector[]) => {
		if (!canvasRef.current) return;

		const tot = sectors.length;
		const ctx = canvasRef.current.getContext('2d');
		const dia = canvasRef.current.width;
		const rad = dia / 2;
		const PI = Math.PI;
		const TAU = 2 * PI;
		const arc = TAU / sectors.length;

		let angVel = 0; // Angular velocity
		const ang = 0; // Angle in radians

		const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;
		const prizeIdxs: { [key: number]: number } = { 4: 0, 2: 1, 0: 2, 8: 3 };

		const drawSector = (
			sector: { color: string; label: string },
			i: number,
		) => {
			if (!ctx) return;
			const ang = arc * i;

			ctx.save();

			ctx.beginPath();
			ctx.fillStyle = sector.color;
			ctx.moveTo(rad, rad);
			ctx.arc(rad, rad, rad, ang, ang + arc);
			ctx.lineTo(rad, rad);
			ctx.fill();

			ctx.translate(rad, rad);
			ctx.rotate(ang + arc / 2);
			ctx.textAlign = 'right';
			ctx.fillStyle = '#181818';
			ctx.font = '600 30px monospace';
			ctx.fillText(sector.label, rad - 10, 10);
			ctx.restore();
		};

		const rotate = async () => {
			if (!canvasRef.current) return;
			if (!spinRef.current) return;
			const sector = sectors[getIndex()];

			spinRef.current.textContent = angVel
				? sector.label
				: `Крутити за ${bet}₴`;

			spinRef.current.style.background = '#012031';
		};

		const getPrizeId = (angle: number) => {
			const normalizedAngle = ((angle % 360) + 360) % 360;
			if (normalizedAngle >= 0 && normalizedAngle < 90) {
				return 4;
			} else if (normalizedAngle >= 90 && normalizedAngle < 180) {
				return 2;
			} else if (normalizedAngle >= 180 && normalizedAngle < 270) {
				return 0;
			} else {
				return 8;
			}
		};

		const getRandomDegrees = (prevAngle: number, nextPrizeId: number) => {
			const nextAngle = prevAngle + rand(1000, 1600);
			const currentPrizeId = getPrizeId(nextAngle);
			const offsetAngle =
				(prizeIdxs[nextPrizeId] - prizeIdxs[currentPrizeId]) * 90;
			return nextAngle + offsetAngle;
			8;
		};

		const init = () => {
			sectors.forEach(drawSector);
			rotate();
			const spinHandler = async () => {
				if (!timeClickRef.current) return;
				if (Number(new Date()) - Number(timeClickRef.current) > 5000) {
					timeClickRef.current = Number(new Date());
				} else return;
				if (account.balance < bet) {
					dispatch(setVisibleModal('dp'));
					return;
				}
				try {
					const { data } = await WheelFortuneService.getResult(bet);

					setDeg(prev => {
						if (canvasRef.current) {
							canvasRef.current.style.transition = `5s`;
							canvasRef.current.style.transform = `rotate(${getRandomDegrees(
								prev,
								Number(data.multiplier),
							)}deg)`;
						}
						return prev + 1000 || deg;
					});
					setTimeout(async () => {
						const { data } = await AdminService.getMeProfile();
						dispatch(setAccount(data));
					}, 5000);
					angVel = rand(0.25, 0.45);
				} catch (e) {
					console.log(e);
				}
			};
			if (spinRef.current) spinRef.current.onclick = spinHandler;
		};
		init();
	};

	useEffect(() => {
		const getMultipliers = async () => {
			const sectors: typeSector[] = [] as typeSector[];

			try {
				const { data } = await WheelFortuneService.getState();

				const { multipliers } = data;
				let color = 'blue';

				for (let i = 0; i < multipliers.length; i++) {
					color = i % 2 === 0 ? '#0091CF' : '#fff';
					sectors.push({ color, label: multipliers[i] + 'x' });
				}
				setTimeout(() => {
					wheelContainer(sectors);
					setIsVisibleBorder(true);
				}, 100);
				setSectors(sectors);
			} catch (e) {
				console.log(e);
			}

			return () => {
				if (spinRef.current) spinRef.current.onclick = null;
			};
		};

		getMultipliers();
	}, [bet]);

	return (
		<>
			{!sectors.length ? (
				<div className='flex'>
					<Spinner black='black' />
				</div>
			) : (
				<div className='wrapper'>
					{isVisibleBorder && (
						<img className='wheel-image' src='/assets/wheel.png' alt='wheel' />
					)}
					<div id='wheelOfFortune'>
						<canvas
							ref={canvasRef}
							id='wheel'
							width='260'
							height='260'></canvas>
						<div ref={spinRef} id='spin'></div>
					</div>
				</div>
			)}
		</>
	);
};

export default Wheel;
