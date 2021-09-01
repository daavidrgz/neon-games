import { Link } from 'react-router-dom';
import { getNumColor } from './MinesweeperCell';
import styles from '../styles/minesweeper.module.css';
import globalStyles from '../styles/games.module.css';

function CellPrev({isBomb, num, boardSize, showCell}) {
	return (
		<div
			className={`${styles.cellPrev} ${showCell ? styles.clicked : ''} ${isBomb ? styles.bombCell : styles.normalCell}`}
		>
			{isBomb ? 
			<i className="icon-mine" style={{fontSize: `${3 - boardSize*2/20}rem`}}/> 
			:
			<span
				style={{
					color: getNumColor(num),
					textShadow: `0 0 5px ${getNumColor(num)}, 0 0 50px ${getNumColor(num)}`,
					fontSize: `${3 - boardSize*2/20}rem`
				}}
				className={`${showCell ? styles.showItem : ''}`}
			>
				{num}
			</span>}
		</div>
	);
}

function createCells(boardSize) {
	let cells = [];

	for ( let i=0; i < boardSize; i++ ) {
		for ( let j=0; j < boardSize; j++ ) {
			cells.push(
				<CellPrev
					isBomb={false}
					showCell={Math.random() < 0.5}
					num={(i+j) % 4}
					key={Math.random()}
					boardSize={boardSize}

					style={styles.showItem}
				/>
			);
		}
	}
		
	return cells;
}

const MinesweeperPrev = () => {
	const boardSize = 6;

	return (
		<div>
			<header className={`${globalStyles.gameTitle} ${styles.minesweeperTitle}`}>
				<Link to="/games/minesweeper">
					<span>
						Minesweeper
						<span className={styles.titleBorder} />
					</span>
				</Link>
				
			</header>

			<Link to="/games/minesweeper">
				<span className={`${globalStyles.previewContainer} ${styles.previewContainer}`}>
					<i className={`icon-mine ${styles.mineAssetPrev}`} />

					<div 
						className={styles.mainContainerPrev} 
						style={{gridTemplateRows: '1fr '.repeat(boardSize), gridTemplateColumns: '1fr '.repeat(boardSize)}}
					>
						{createCells(boardSize)}
					</div>
				</span>
			</Link>

		</div>
	);
}

export default MinesweeperPrev;
