import React from 'react';
import anime from 'animejs';
import { useEffect, useState } from "react";

export default function Music() {
	const [mutedState, setMutedState] = useState(true);
	let musicCount = 1;

	function manageVolume() {
		const audio = document.getElementById('bg-music');

		if ( audio.volume !== 0.2 && audio.volume !== 0 )
			return;
		
		anime({
			targets: document.querySelector('#mute-button i'),
			opacity: [0.4, 1],
			easing: 'easeInOutSine',
			duration: 600,
		});
		
		mutedState ? playMusic(audio) : pauseMusic(audio); 
		setMutedState(prevValue => !prevValue);
	}

	function pauseMusic(audio) {
		const volumeFader = setInterval(() => {
			audio.volume -= 0.001;

			if ( audio.volume < 0.001 ) {
				audio.volume = 0;
				audio.pause();
				clearInterval(volumeFader);
			}
		}, 5);
	}

	function playMusic(audio) {
		audio.play();
		const volumeFader = setInterval(() => {
			audio.volume += 0.001;

			if ( audio.volume > 0.199 ) {
				audio.volume = 0.2;
				clearInterval(volumeFader);
			}
		}, 5);
	}

	function musicEnded(e) {
		e.target.src = `/audio/bgmusic${(musicCount%4)+1}.mp3`;
		musicCount++;
	}

	useEffect(() => {
		const audio = document.getElementById('bg-music');
		audio.addEventListener('ended', musicEnded);
		audio.volume = 0.2;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<audio id="bg-music" src={`/audio/bgmusic${musicCount}.mp3`}>
					Your browser does not support the
          <code>audio</code> element.
			</audio>
			<div id="mute-button" onClick={manageVolume}>
				<i className={mutedState ? 'icon-no-sound' : 'icon-sound'} />
			</div>
		</>
	);
}
