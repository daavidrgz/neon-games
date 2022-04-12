import anime from 'animejs';
import ConfettiGenerator from 'confetti-js';
import React, { useEffect, useState } from 'react';
import { startClock, stopClock, resetClock } from '../../components/Clock'
import styles from '../../styles/minesweeper.module.css'
import Cell from '../../components/MinesweeperCell';

function WinPopup({closePopup, resetGame}) {
	return (
		<div id="winPopup" className={styles.winLosePopup}>

			<canvas id={styles.confettiCanvas}></canvas>

			<audio id="winGameMusic" src="/audio/winGame.mp3">
					Your browser does not support the
					<code>audio</code> element.
			</audio>

			<div className={styles.winLoseExternalContainer}>
				<div className={styles.winContainer}>
					<span className={styles.winText}>You Win!!</span>
					<div className={styles.gameTimeContainer}>
						<span>Time: <span id="winTime"></span></span>
					</div>
				</div>

				<div className={styles.winLoseButtonsContainer}>
					<button className={styles.closeBtn} onClick={() => closePopup('winPopup')}>
						Close
						<i className="icon-close" />
					</button>
					<button className={styles.resetBtn} onClick={resetGame}>
						Reset
						<i className="icon-refresh" />
					</button>
				</div>
			</div>
		</div>
	);
}

function LosePopup({closePopup, resetGame}) {
	return (
		<div id="losePopup" className={styles.winLosePopup}>
			<audio id="gameOverMusic" src="/audio/gameOver.mp3">
					Your browser does not support the
					<code>audio</code> element.
			</audio>


			<div className={styles.winLoseExternalContainer}>
				<div className={styles.loseContainer}>
					<span className={styles.loseText}>You Lose :(</span>
				</div>

				<div className={styles.winLoseButtonsContainer}>
					<button className={styles.closeBtn} onClick={() => closePopup('losePopup')}>
						Close
						<i className="icon-close" />
					</button>
					<button className={styles.resetBtn} onClick={resetGame}>
						Reset
						<i className="icon-refresh" />
					</button>
				</div>
			</div>
		</div>
	);
}

function AuthReqMsg() {
	return (
		<div className={styles.scoresMessage}>
			<span>Authentication required</span>
			<i className="fi-rr-user-remove" />
		</div>
	);
}

function NothingToShowMsg() {
	return (
		<div className={styles.scoresMessage}>
			<span>Nothing to show</span>
			<i className="fi-rr-eye-crossed" />
		</div>
	);
}

function ScoresTable({scores}) {
	return (
		<table className={styles.scoresTable}>
			<thead>
				<tr className={styles.firstRowScores}>
					<th><span><span /></span></th>
					<th><span>Time<span /></span></th>
					<th><span>Date<span /></span></th>
				</tr>
			</thead>
			
			<tbody>
				{scores.map(function(score, idx) {
					return (
						<tr key={idx}>
							<td>{`${idx+1}º`}</td>
							<td>{score.timeStr}</td>
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
	);
}

export default function Minesweeper() {
	const [fieldSize, setFieldSize] = useState({
		i: 8,
		j: 8
	});
	const [allCells , setAllCells] = useState([]);
	const [scoreElem, setScoreElem] = useState(<></>);
	let bombs = [];
	let cellsClicked = 0;
	let notClickable = false;

	function getAroundCells({i, j}) {
		return [{i: i-1, j: j-1}, {i: i-1, j: j}, {i: i-1, j: j+1},
			{i: i, j: j-1}, {i: i, j: j+1}, {i: i+1, j: j-1}, {i: i+1, j: j}, {i: i+1, j: j+1}];
	}
	function isABomb({i, j}) {
		let isBomb = false;
		bombs.forEach(bomb => isBomb = isBomb || (bomb.i === i && bomb.j === j));
		return isBomb;
	}
	
	function createCells() {
		let cells = [];
		bombs = [];
	
		// Generating the bombs position
		for ( let k=0; k < fieldSize.i * fieldSize.j / 6; k++ ) {
			let i, j;
			do {
				i = Math.floor(Math.random()*fieldSize.i);
				j = Math.floor(Math.random()*fieldSize.j);
			} while ( bombs.findIndex(function(bomb) { return bomb.i === this.i && bomb.j === this.j }, {i: i, j: j}) !== -1 )

			bombs.push({i: i, j: j});
		}

		for ( let i=0; i < fieldSize.i; i++ ) {
			for ( let j=0; j < fieldSize.j; j++ ) {
				let isBomb = isABomb({i: i, j: j});
				let cellNum = 0;
				
				if ( !isBomb )
					getAroundCells({i: i, j: j}).forEach(cell => isABomb(cell) && cellNum++);
	
				cells.push(
					<Cell
						isBomb={isBomb}
						num={cellNum}
						cellClicked={cellClicked}
						cellRightClicked={cellRightClick}
						position={`${i} ${j}`}
						key={Math.random()}
						boardSize={fieldSize.i}
					/>
				);
			}
		}
		
		return cells;
	}

	async function showBombs(startingBomb) {
		const [i, j] = startingBomb.split(" ");
		const idx = bombs.findIndex(pos => pos.i === parseInt(i) && pos.j === parseInt(j));
		const bombCells = [];

		for ( let k=0; k < bombs.length; k++ ) {
			const pos = bombs[(idx + k) % bombs.length];
			const elem = document.getElementById(`${pos.i} ${pos.j}`);

			if ( elem.children.length !== 1 ) // Remove the flag
				elem.removeChild(elem.lastChild);

			bombCells.push(elem.firstChild);
		}

		var animation = anime.timeline().add({
			targets: bombCells,
			opacity: ['0', '1'],
			translateY: ['-10px', '0px'],
			color: ['#ffd7d7', '#ff5656', '#ffd7d7'],
			duration: 400,
			delay: anime.stagger(100, {easing: 'easeOutQuad'})
		});

		return animation.finished;
	}

	function showNextCells([i, j]) {
		getAroundCells({i: parseInt(i), j: parseInt(j)}).forEach(cell => {
			const elem = document.getElementById(`${cell.i} ${cell.j}`);
			elem && elem.click();
		});
	}

	function cellClicked(e) {
		let {isbomb, num} = e.target.dataset;

		if ( e.target.classList.contains(styles.clicked) || notClickable ) return;

		if ( cellsClicked === 0 ) startClock(document.getElementById('elapsedTime'));

		// LOSE
		if ( isbomb === 'true' ) { 
			loseGame(e.target.id);
			return;
		}

		// Remove the flag
		if ( e.target.children.length !== 1 ) e.target.removeChild(e.target.lastChild);

		e.target.firstChild.classList.add(styles.showItem);
		e.target.classList.add(styles.clicked);

		cellsClicked++;
		if ( cellsClicked === fieldSize.i * fieldSize.j - bombs.length ) { // WIN
			winGame();
			return;
		}

		if ( num === '0' ) showNextCells(e.target.id.split(" "));
	}

	function cellRightClick(e) {
		if ( notClickable ) return;
		e.preventDefault();
		if ( e.target.classList.contains(styles.clicked) ) return;

		if ( e.target.children.length !== 1 ) { // Remove the flag
			e.target.removeChild(e.target.lastChild);
			return;
		}

		var node = document.createElement('i');
		node.classList.add('icon-flag', styles.flagIcon, styles.showItem);
		node.style['font-size'] = `${3 - fieldSize.i*2/20}rem`; // Adjusting the flag size depending on the board size
		e.target.appendChild(node);
	}

	function winGame() {
		const { elapsedTimeStr, elapsedTimeMs } = stopClock();
		notClickable = true;
		document.getElementById('winTime').innerText = elapsedTimeStr;
		document.getElementById('winGameMusic').play();
		document.getElementById('winPopup').classList.add(styles.showWinLosePopup);
		document.getElementById(styles.confettiCanvas).classList.add(styles.showItem);

		fetch('/api/add-minesweeper-score', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				timeStr: elapsedTimeStr,
				timeMs: elapsedTimeMs,
				board: `${fieldSize.i} ${fieldSize.j}`,
				date: Date.now()
			})
		});
	}

	function loseGame(startingBombId) {
		stopClock();
		notClickable = true;
		document.getElementById('gameOverMusic').play();
		document.getElementById('bg-music').volume = 0.05;
		showBombs(startingBombId).then(() => {
			document.getElementById('losePopup').classList.add(styles.showWinLosePopup);
		});
	}

	function getScores() {
		setScoreElem(<></>);
		
		fetch('/api/get-minesweeper-scores', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({board: `${fieldSize.i} ${fieldSize.j}`})
		})
		.then(res => res.json())
		.then(res => {
			if ( res === 'Auth required' )
				setScoreElem(<AuthReqMsg />)
			else if ( res.length === 0 )
				setScoreElem(<NothingToShowMsg />)
			else
				setScoreElem(<ScoresTable scores={res}/>)
		});
	}

	function resetGame() {
		stopClock(); resetClock(document.getElementById('elapsedTime'));
		setAllCells(createCells());
		getScores();
		
		document.getElementById('altResetBtn').classList.remove(styles.showResetBtn);
		document.getElementById('bg-music').volume = 0.2;
		document.getElementById('winPopup').classList.remove(styles.showWinLosePopup);
		document.getElementById('losePopup').classList.remove(styles.showWinLosePopup);
	}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(resetGame, [fieldSize]);

	function closePopup(id) {
		setTimeout(() => {
			document.getElementById('altResetBtn').classList.add(styles.showResetBtn);
		}, 500);
		document.getElementById('bg-music').volume = 0.2;
		document.getElementById(styles.confettiCanvas).classList.remove(styles.showItem);
		document.getElementById(id).classList.remove(styles.showWinLosePopup);
	}
	
	useEffect(() => {
		const confettiSettings = { target: styles.confettiCanvas, rotate: true };
		const confetti = new ConfettiGenerator(confettiSettings);
		confetti.render();
		document.getElementById('gameOverMusic').volume = 0.4;
		document.getElementById('winGameMusic').volume = 0.4;
	}, []);

	return (
		<>
			<div className={styles.externalContainer}>

				<div className={styles.decorationContainer}>
					<i className={`icon-mine ${styles.mineAsset}`} />
					<div className={styles.minesweeperContainer}>
						<span>Minesweeper</span>
					</div>
				</div>

				<WinPopup resetGame={resetGame} closePopup={closePopup} />
				<LosePopup resetGame={resetGame} closePopup={closePopup} />

				<div
					className={styles.mainContainer} 
					style={{gridTemplateRows: `repeat(${fieldSize.i}, 2fr)`, gridTemplateColumns: `repeat(${fieldSize.j}, 2fr)`}}
				>
					{allCells}
				</div>
				
				<div className={styles.rightContainer}>
					<div className={styles.sizeSelectorContainer}>
						<div className={`${styles.sectionTitleText} ${styles.sizeSelectorText}`}>
							<span>Board Size</span>
							<i className={`${styles.sizeSelectorIcon} fi-rr-grid-alt`} />
							<span className={styles.underline} />
						</div>
						
						<select 
							className={styles.sizeSelector}
							onChange={e => setFieldSize({i: +e.target.value, j: +e.target.value})}
						>
							<option value="8">8x8</option>
							<option value="10">10x10</option>
							<option value="12">12x12</option>
							<option value="15">15x15</option>
						</select>
					</div>

					<div className={styles.currentTimeContainer}>
						<div className={`${styles.sectionTitleText} ${styles.currentTimeText}`}>
							<span>Elapsed Time</span>
							<i className={`${styles.currentTimeIcon} fi-rr-hourglass-end`} />
							<span className={styles.underline} />
						</div>
						<span className={styles.currentTime} id="elapsedTime">00m 00s</span>
					</div>
					
					<div className={styles.scoresExternalContainer}>
						<div className={`${styles.sectionTitleText} ${styles.scoresText}`}>
							<span>{`Scores (${fieldSize.i}x${fieldSize.j})`}</span>
							<i className={`${styles.scoresIcon} fi-rr-badge`} />
							<span className={styles.underline} />
						</div>
						
						{scoreElem}
					</div>
				</div>
				
				<button id='altResetBtn' className={`${styles.resetBtn} ${styles.altResetBtn}`} onClick={resetGame}>
					Reset
					<i className="icon-refresh" />
				</button>
			</div>
		</>
	);
}
