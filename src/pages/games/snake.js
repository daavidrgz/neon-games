import React, { useEffect, useState } from 'react';
import anime from 'animejs';
import styles from '../../styles/snake.module.css'

function SnakeCell({position}) {
	return (
		<div
			className={styles.cell}
			id={position}
		>
		</div>
	);
}

export default function Snake() {
	const [cells, setCells] = useState([]);
	const [scores, setScores] = useState(null);

	const fieldSize = { rows: 20, cols: 20 };
	let direction = { row: 0, col: 1 };
	let move, foodCells = [], score = 0;
	let currentLevel = 1, snakeSpeed = 100;

	function generateFood() {
		for ( let k=0; k < 10; k++ ) {
			let row, col;
			do {
				row = Math.floor(Math.random()*fieldSize.rows);
				col = Math.floor(Math.random()*fieldSize.cols);
			} while ( foodCells.findIndex(function(cell) { return cell.row === this.row && cell.col === this.col}, {row: row, col: col}) !== -1 )

			foodCells.push({row: row, col: col});
		}
	}
	
	function setFood() {
		generateFood();

		foodCells.forEach(cell => {
			const food = document.createElement('i');
			food.classList.add('icon-apple', styles.foodIcon);
			document.getElementById(`${cell.row} ${cell.col}`)
			.appendChild(food);
		})
	}

	function createCells() {
		const cells = [];

		for ( let i=0; i < fieldSize.rows; i++ ) {
			for ( let j=0; j < fieldSize.cols; j++ ) {
				cells.push(
					<SnakeCell 
						position={`${i} ${j}`} 
						isFood={foodCells.findIndex(cell => cell.row === i && cell.col === j) !== -1}
						key={Math.random()}
					/>
				);
			}
		}
		return cells;
	}

	function nextPosition({row, col}) {
		return ({
			row: row + direction.row,
			col: col + direction.col
		});
	}
	function isValidPosition(snake) {
		const {row, col} = snake[0];
		if ( row >= fieldSize.rows || row < 0 || col >= fieldSize.cols || col < 0 ) // Out of bounds
			return false;

		if ( snake.findIndex((elem, idx) => idx !== 0 && elem.row === row && elem.col === col) !== -1 ) // Crash with himself
			return false;

		return true;
	}
	function isCellFood({row, col}) {
		return foodCells.findIndex(cell => cell.row === row && cell.col === col) !== -1;
	}

	function nextLevel() {
		// Changing the snake colour
		const activeCells = document.getElementsByClassName(styles[`cellActive${currentLevel}`]);
		Array.from(activeCells).forEach(elem => {
			elem.classList.remove(styles[`cellActive${currentLevel}`]);
			elem.classList.add(styles[`cellActive${currentLevel + 1}`]);
		});

		currentLevel++;

		// Level up sound
		const levelUpSound = new Audio(`/audio/levelUp.mp3`);
		levelUpSound.volume = 0.25;
		levelUpSound.addEventListener('canplaythrough', () => levelUpSound.play());

		// Change the DOM
		const snakeLevel = document.getElementById(styles.snakeLevel);
		anime({
			targets: snakeLevel,
			opacity: [0.7, 1],
			duration: 400,
			easing: 'easeInOutQuad'
		});
		snakeLevel.innerHTML = currentLevel;

		// Reset the food
		setFood();
	}

	function moveSnake() {
		let snake = [{row: 0, col: 0}, {row: 0, col: 0}];

		move = setInterval(() => {
			let lastElem = snake[snake.length - 1];
			document.getElementById(`${lastElem.row} ${lastElem.col}`).classList.remove(styles[`cellActive${currentLevel}`]);

			for ( let i=snake.length - 1; i > 0; i-- ) snake[i] = snake[i-1];
			snake[0] = nextPosition(snake[0]);

			if ( !isValidPosition(snake) ) {
				gameOver();
				return; 
			}

			if ( isCellFood(snake[0]) ) {
				// Eating sound
				const pointSound = new Audio(`/audio/point4.mp3`);
				pointSound.volume = 0.15;
				pointSound.addEventListener('canplaythrough', () => pointSound.play());

				// Removing the food
				const foodCell = document.getElementById(`${snake[0].row} ${snake[0].col}`);
				foodCell.removeChild(foodCell.lastChild);
				foodCells = foodCells.filter(cell => cell.row !== snake[0].row || cell.col !== snake[0].col);

				if ( foodCells.length === 0 )
					nextLevel();

				// Adding a new cell to the snake
				snake.push(lastElem);
				document.getElementById(`${lastElem.row} ${lastElem.col}`).classList.add(styles[`cellActive${currentLevel}`]);

				// Incrementing the score
				const snakeScore = document.getElementById(styles.snakeScore);
				anime({
					targets: snakeScore,
					opacity: [0.9, 1],
					duration: 300,
					easing: 'easeInOutQuad'
				});
				snakeScore.innerHTML = ++score;
			}
				
			document.getElementById(`${snake[0].row} ${snake[0].col}`).classList.add(styles.cellActiveHead);
			document.getElementById(`${snake[1].row} ${snake[1].col}`).classList.remove(styles.cellActiveHead);
			document.getElementById(`${snake[1].row} ${snake[1].col}`).classList.add(styles[`cellActive${currentLevel}`]);
		}, snakeSpeed);
	}

	function changeDirection(e) {
		const keyCodes = [37, 38, 39, 40];
		keyCodes.includes(e.keyCode) && e.preventDefault();

		if ( e.keyCode === 37 && direction.row !== 0 && direction.col !== 1 ) // Left arrow
			direction = {row: 0, col: -1}
		else if ( e.keyCode === 38 && direction.row !== 1 && direction.col !== 0 ) // Up arrow
			direction = {row: -1, col: 0}
		else if ( e.keyCode === 39 && direction.row !== 0 && direction.col !== -1 ) // Right arrow
			direction = {row: 0, col: 1}
		else if ( e.keyCode === 40 && direction.row !== -1 && direction.col !== 0 ) // Down arrow
			direction = {row: 1, col: 0}
	}

	function gameOver() {
		clearInterval(move);
		document.getElementById(styles.gameOverSnakeLevel).innerHTML = `Level: ${currentLevel}`;
		document.getElementById(styles.gameOverSnakeScore).innerHTML = `Points: ${score}`;
		document.querySelector(`.${styles.gameOverPopup}`).classList.add(styles.showGameOverPopup);

		fetch('/api/add-snake-score', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
      	'Content-Type': 'application/json'
			},
			body: JSON.stringify({points: score, level: currentLevel, date: Date.now()})
		}).then(getScores);
	}

	function resetGame() {
		direction = { row: 0, col: 1 };
		foodCells = []
		score = 0;
		currentLevel = 1;

		document.getElementById(styles.snakeScore).innerHTML = score;
		document.getElementById(styles.snakeLevel).innerHTML = currentLevel;
		setCells(createCells());

		document.querySelector(`.${styles.gameOverPopup}`).classList.remove(styles.showGameOverPopup);
		document.querySelector(`.${styles.startButton}`).classList.add(styles.showStartButton);
	}

	function startGame() {
		document.querySelector(`.${styles.startButton}`).classList.remove(styles.showStartButton);
		document.addEventListener('keydown', changeDirection);
		setFood();
		moveSnake();
	}

	async function getScores() {
		const apiRes = await fetch('/api/get-snake-scores');
		const res = await apiRes.json();
		(res === 'Auth required') ? setScores(null) : setScores(res)
	}

	useEffect(() => {
		getScores();
		setCells(createCells());
		setTimeout(() => {
			document.querySelector(`.${styles.startButton}`).classList.add(styles.showStartButton);
		}, 100);

		return () => document.removeEventListener('keydown', changeDirection);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div className={styles.externalContainer}>
				<div className={styles.gameOverPopup}>
					<div className={styles.gameOverContainer}>
						<span className={styles.gameOverText}>Game Over</span>
						<span className={styles.hr} />
						<span id={styles.gameOverSnakeLevel}>Level:</span>
						<span id={styles.gameOverSnakeScore}>Points:</span>
					</div>

					<button className={styles.closeButton} onClick={resetGame}>
						Close
						<i className="icon-close" />
					</button>
				</div>

				<div className={styles.leftContainer}>
					<div className={styles.scoreContainer}>
						<span className={`${styles.sectionTitleText} ${styles.pointsText}`}>
							<span>Points</span>
							<i className={`${styles.pointsIcon} icon-point`} />
							<span className={styles.underline} />
						</span>
						<span className={styles.scoreAndLevel}><span id={styles.snakeScore}>0</span> points</span>
					</div>
					<div className={styles.levelContainer}>
						<span className={`${styles.sectionTitleText} ${styles.levelText}`}>
							<span>Level</span>
							<i className={`${styles.levelIcon} icon-level`} />
							<span className={styles.underline} />
						</span>
						<span className={styles.scoreAndLevel}>Level <span id={styles.snakeLevel}>1</span></span>
					</div>

					<div className={styles.scoresContainer}>
						<span className={`${styles.sectionTitleText} ${styles.scoresText}`}>
							<span>Scores</span>
							<i className={`${styles.scoresIcon} fi-rr-badge`} />
							<span className={styles.underline} />
						</span>
					</div>
					{!scores ?
							<div className={styles.scoresMessage}>
								<span>Authentication required</span>
								<i className="fi-rr-user-remove" />
							</div>
					  : scores.length === 0 ?
							<div className={styles.scoresMessage}>
								<span>Nothing to show</span>
								<i className="fi-rr-eye-crossed" />
							</div>
						:
						<table className={styles.scoresTable}>
								<thead>
									<tr className={styles.firstRowScores}>
										<th><span><span /></span></th>
										<th><span>Level<span /></span></th>
										<th><span>Points<span /></span></th>
										<th><span>Date<span /></span></th>
									</tr>
								</thead>
								
								<tbody>
									{scores.map(function(score, idx) {
										return (
											<tr key={idx}>
												<td>{`${idx+1}º`}</td>
												<td>{score.level}</td>
												<td>{score.points}</td>
												<td>
													{new Date(score.date).toLocaleDateString('en-GB', {
													day: 'numeric',
													month: 'short',
													hour: 'numeric',
													minute: 'numeric',
													year: 'numeric'})}
												</td>
											</tr>
										);
									})}
								</tbody>
						</table>
						}
				</div>

				<div
					className={styles.mainContainer}
					style={{gridTemplateRows: `repeat(${fieldSize.rows}, 1fr)`, gridTemplateColumns: `repeat(${fieldSize.cols}, 1fr)`}}
				>
					{cells}
				</div>

				<button className={styles.startButton} onClick={startGame}>
					Press to start
					<i className="fi-rr-flag" />
				</button>

				<div className={styles.rightContainer}>
					<i className={`icon-snake-alt ${styles.snakeAsset}`}/>
					<div className={styles.snakeContainer}>
						<span>The Snake</span>
					</div>
				</div>
			</div>
		</>
	);
}
