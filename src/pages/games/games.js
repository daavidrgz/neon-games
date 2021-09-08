import Nav from '../../components/Nav'
import MinesweeperPrev from '../../components/MinesweeperPrev'
import SnakePrev from '../../components/SnakePrev'
import styles from '../../styles/games.module.css'
import Glider from 'glider-js/glider.min.js'
import { useEffect } from 'react'
import { Switch, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Snake from './snake'
import Minesweeper from './minesweeper'

function GamesHome() {

	useEffect(() => {
		const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
		let duration;
		
		if ( vw > 1000 )
			duration=0.3;
		else
			duration=0.8;

		new Glider(document.querySelector(`.${styles.glider}`), {
			duration: duration,
			dots: document.querySelector(`.${styles.gliderDots}`),
			arrows: {
				next: document.querySelector(`.${styles.gliderNext}`),
				prev: document.querySelector(`.${styles.gliderPrev}`)
			},
			draggable: false,
			dragVelocity: 2,
			scrollLock: true,
			rewind: true

		});
	}, []);

	return (
		<>
			<div className={styles.gliderContainer}>
				<button aria-label="Previous" className={styles.gliderPrev}><span>«</span></button>

				<div className={styles.glider}>
					<MinesweeperPrev />
					<SnakePrev />
				</div>
				
				<button aria-label="Next" className={styles.gliderNext}><span>»</span></button>
				<div role="tablist" className={styles.gliderDots}></div>
			</div>
		</>
	);
}

export default function Games() {
	const location = useLocation();

	return (
		<>
			<Nav />
			
			<AnimatePresence exitBeforeEnter initial={false}>
				<Switch location={location} key={location.pathname}>
					<Route path="/games/minesweeper">
						<motion.div
							initial={{opacity: 0}}
							animate={{opacity: 1}}
							exit={{opacity: 0}}
							transition={{duration: 0.25}}
						>
							<Minesweeper />
						</motion.div>
					</Route>

					<Route path="/games/snake">
						<motion.div
							initial={{opacity: 0}}
							animate={{opacity: 1}}
							exit={{opacity: 0}}
							transition={{duration: 0.25}}
						>
							<Snake />
						</motion.div>
					</Route>

					<Route path="/games">
						<motion.div
							initial={{opacity: 0}}
							animate={{opacity: 1}}
							exit={{opacity: 0}}
							transition={{duration: 0.25}}
						>
							{/* Forcing to refresh glider js */}
							<GamesHome key={Math.random()} />
						</motion.div>
					</Route>
				</Switch>
			</AnimatePresence>
		</>
	);
}
