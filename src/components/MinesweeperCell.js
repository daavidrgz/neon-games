import React from 'react';
import styles from '../styles/minesweeper.module.css';

function getNumColor(num) {
	if ( num === 0 ) return "#00000000";
	if ( num === 1 ) return "#006eff";
	if ( num === 2 ) return "#63ee39";
	if ( num === 3 ) return "#cf0000";
	if ( num === 4 ) return "#fdca40";
	if ( num === 5 ) return "#93329e";
	if ( num === 6 ) return "#00917c";
	if ( num === 7 ) return "#f0a500";
	if ( num === 8 ) return "#03506f";
}

export default function Cell({isBomb, num, cellClicked, cellRightClicked, position, boardSize}) {
	return (
		<div
			data-isbomb={isBomb}
			data-num={num}
			className={`${styles.cell} ${isBomb ? styles.bombCell : styles.normalCell}`}
			onClick={cellClicked}
			onContextMenu={cellRightClicked}
			id={position}
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
			>
				{num}
			</span>}
		</div>
	);
}

export { getNumColor };
