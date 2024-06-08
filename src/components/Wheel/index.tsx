import {
	FC,
	Dispatch,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from 'react';
import './style.css';
import WheelFortuneService from '../../services/WheelFortuneService';
import Spinner from '../spinner';

type typeSector = { color: string; label: string };

interface WheelProps {
	bet: number;
	setBet: Dispatch<SetStateAction<number>>;
}

const Wheel: FC<WheelProps> = ({ bet, setBet }) => {
	const [sectors, setSectors] = useState<typeSector[]>([]);
	const [isVisibleBorder, setIsVisibleBorder] = useState<boolean>(false);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const spinRef = useRef<HTMLDivElement | null>(null);

	const rand = (min: number, max: number) => Math.random() * (max - min) + min;

	const wheelContainer = (sectors: typeSector[]) => {
		if (!canvasRef.current) return;

		const tot = sectors.length;
		const ctx = canvasRef.current.getContext('2d');
		const dia = canvasRef.current.width;
		const rad = dia / 2;
		const PI = Math.PI;
		const TAU = 2 * PI;
		const arc = TAU / sectors.length;

		const friction = 0.991; // 0.995=soft, 0.99=mid, 0.98=hard

		let angVel = 0; // Angular velocity
		let ang = 0; // Angle in radians
		let val: string | null = null;
		const indexes: { [key: string]: number } = {
			'0x': 0,
			'2x': 1,
			'4x': 2,
			'8x': 3,
		};

		const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;

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
			canvasRef.current.style.transform = `rotate(${ang - PI / 2}rad)`;

			if (angVel < 0.008 && angVel && sector.label !== val) {
				let diff = 0;
				if (val)
					diff = (Math.abs(indexes[val] - indexes[sector.label]) * 1.5) / 200;
				angVel += Math.abs(diff);
			} else if (angVel < 0.009 && angVel && sector.label === val) {
				setTimeout(() => {
					angVel = 0;

					setBet(bet);
					val = null;
				}, 4000);
			}
			spinRef.current.textContent = angVel
				? sector.label
				: `Крутити за ${bet}₴`;

			spinRef.current.style.background = '#012031';
		};

		const frame = () => {
			if (!angVel) return;
			angVel *= friction;
			if (angVel < 0.002) angVel = 0;
			ang += angVel;
			ang %= TAU;
			rotate();
		};

		const engine = () => {
			frame();
			requestAnimationFrame(engine);
		};

		const rotateToTarget = (targetIndex: number) => {
			const targetAngle = targetIndex * arc;
			let angleDifference = targetAngle - ang;
			angleDifference = ((angleDifference + PI) % TAU) - PI;

			// Add multiple full rotations
			const n = 5; // Number of full rotations
			const finalAngle = ang + angleDifference + TAU * n;

			const rotateFrame = () => {
				if (!canvasRef.current) return;
				if (angVel < 0.001) {
					// Small threshold to stop
					angVel = 0;
					ang = finalAngle % TAU;
					canvasRef.current.style.transform = `rotate(${ang - PI / 2}rad)`;
					setTimeout(() => {
						setBet(bet);
					}, 3000);
					return;
				}
				angVel *= friction;
				ang += angVel;
				ang %= TAU;
				canvasRef.current.style.transform = `rotate(${ang - PI / 2}rad)`;
				requestAnimationFrame(rotateFrame);
			};

			angVel = 0.4; // Initial velocity
			requestAnimationFrame(rotateFrame);
		};

		const init = () => {
			sectors.forEach(drawSector);
			rotate();
			engine();
			const spinHandler = async () => {
				if (angVel) return;
				angVel = rand(0.25, 0.45);
				setTimeout(async () => {
					const result = await WheelFortuneService.getResult(bet);
					val = result.data.multiplier + 'x';
					const targetIndex = indexes[val];
					rotateToTarget(targetIndex);
				}, 7000);
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
