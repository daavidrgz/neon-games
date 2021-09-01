let clock;
let elapsedTime;
let delta;

function startClock(elem) {
	const gameStartTime = Date.now();
	clock = setInterval(() => {
		delta = Date.now() - gameStartTime;
		elapsedTime = new Date(delta).toTimeString().slice(3, 8);
		const [min, sec] = elapsedTime.split(":");

		if ( min === '00' )
			elapsedTime = `${sec}s`;
		else
			elapsedTime = `${min}m ${sec}s`;
		elem.innerText = elapsedTime;
	}, 1000);
}
function stopClock() {
	if ( clock ) clearInterval(clock);
	return {elapsedTimeStr: elapsedTime, elapsedTimeMs: delta};
}
function resetClock(elem) {
	elem.innerText = '00m 00s';
}

export {startClock, stopClock, resetClock}
