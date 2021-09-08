import { Link } from 'react-router-dom';
import styles from '../styles/snake.module.css';
import globalStyles from '../styles/games.module.css';

function SnakeCell({position, isFood, isActive, isHead}) {
	return (
		<div
			className={`${styles.cell} ${isHead ? styles.cellActiveHead : (isActive ? styles.cellActive7 : '')}`}
			id={position}
		>
			{isFood &&
				<i className={`icon-apple ${styles.foodIcon}`}/>
			}
		</div>
	);
}

const SnakePrev = () => {
	const boardSize = 10;
	const foodCells = [{row: 0, col: 1}, {row: 2, col: 3}, {row: 1, col: 5}, {row: 9, col: 8},
		{row: 10, col: 1}, {row: 7, col: 2}, {row: 3, col: 8}];
	const head = {row: 8, col: 8};
	const snake = [{row: 7, col: 8}, {row: 6, col: 8}, {row: 6, col: 7}, {row: 6, col: 6}, {row: 6, col: 5},
		{row: 6, col: 4}, {row: 5, col: 4}, {row: 4, col: 4}, {row: 4, col: 3}, {row: 4, col: 2}, {row: 4, col: 1}];

	function createCells() {
		const cells = [];

		for ( let i=0; i < boardSize; i++ ) {
			for ( let j=0; j < boardSize; j++ ) {
				cells.push(
					<SnakeCell 
						position={`${i} ${j}`} 
						isFood={foodCells.findIndex(cell => cell.row === i && cell.col === j) !== -1}
						isActive={snake.findIndex(cell => cell.row === i && cell.col === j) !== -1}
						isHead={i === head.row && j === head.col}
						key={Math.random()}
					/>
				);
			}
		}
		return cells;
	}


	return (
		<div>
			<header className={`${globalStyles.gameTitle} ${styles.snakeTitle}`}>
				<Link to="/games/snake">
					<span>
						The Snake
						<span className={styles.titleBorder} />
					</span>
				</Link>
				
			</header>

			<Link to="/games/snake">
				<span className={`${globalStyles.previewContainer} ${styles.previewContainer}`}>
					<i className={`icon-snake ${styles.snakeAssetPrev}`} />

					<div 
						className={styles.mainContainerPrev} 
						style={{gridTemplateRows: '1fr '.repeat(boardSize), gridTemplateColumns: '1fr '.repeat(boardSize)}}
					>
						{createCells()}
					</div>
				</span>
			</Link>

		</div>
	);
}

export default SnakePrev;
