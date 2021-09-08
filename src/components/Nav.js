import { Link } from 'react-router-dom'
import DelayLink from 'react-delay-link'
import { useState, useEffect } from 'react'
import anime from 'animejs'
import styles from '../styles/nav.module.css'

import ProfilePanel from './ProfilePanel'

function noUserElem() {
	return (
		<a className={styles.noUserProfileContainer} href="/auth/google" >
			<i className="fi-rr-user-remove"/>
			{/* <span className={styles.underline} /> */}
			<span className={styles.authReqText}>Log In</span>
		</a>
	);
}

function userElem({name, email, picture}) {
	return (
		<div className={styles.userProfileContainer}>
			{/* <span className={styles.underline} /> */}
			<div
				className={styles.profileImg}
				style={{background: `url("${picture}")`, backgroundSize: 'cover'}}
				onClick={() => {
					document.querySelector(`.${styles.profilePanel}`).classList.toggle(styles.showProfilePanel);
					document.querySelector(`.${styles.backgroundDimmer}`).classList.toggle(styles.activeBackgroundDimmer);
				}}
			/>
			<span className={styles.profileName}>Hi, {name}!</span>
		</div>
	);
}

export default function Nav() {
	const [userProfileElem, setUserProfileElem] = useState(<></>);

	async function getUser() {
		const rawUserData = await fetch('/api/get-user');

		if ( rawUserData.status !== 200 ) {
			setUserProfileElem(noUserElem());
			return;
		}
 
		const userData = await rawUserData.json();
		setUserProfileElem(userElem(userData));
	}

	function animateLinks(elementClass) {
		const linkSound = new Audio('/audio/linkSound.mp3');
		linkSound.volume = 0.4;
		const linkSound2 = new Audio('/audio/linkSound3.mp3');
		linkSound2.volume = 0.8;

		linkSound.play();
		// linkSound2.play();

		anime({
			targets: document.querySelector(`.${elementClass} div`),
			translateY: [`${Math.floor(Math.random()*2) + 7}`, `${Math.floor(Math.random()*-5) - 2}`, '0px'],
			easing: 'easeOutSine',
			duration: 450
		})
	}

	useEffect(() => {
		getUser();
	}, []);

	return (
		<>
			<nav className={styles.navBar}>
				{/* <span className={styles.gradientBorder} /> */}
				<div className={styles.leftContainer}>
					<Link className={styles.logoContainer} to="/">
						<span className={styles.logoLetter}>T</span>
						<span className={styles.logoLetter}>N</span>
						<span className={styles.logoLetter}>G</span>

						<span className={styles.underline} />
					</Link>
				</div>

				<div className={styles.centerContainer}>
					<div className={styles.linksContainer}>
						<div className={`${styles.homeLinkWraper} ${styles.linkWraper}`}>
							<DelayLink delay={150} to="/" clickAction={() => animateLinks(styles.homeLinkWraper)}>
								<span className={styles.homeLink} >
									Home
									<span className={styles.underline} />
								</span>
							</DelayLink>
							<span className={`${styles.homeWire} ${styles.wire}`} />
						</div>

						<div className={`${styles.minesweeperLinkWraper} ${styles.linkWraper}`}>
							<DelayLink delay={150} to="/games/minesweeper" clickAction={() => animateLinks(styles.minesweeperLinkWraper)}>
								<span className={styles.minesweeperLink}>
									Minesweeper
									<span className={styles.underline} />
								</span>
							</DelayLink>
							<span className={`${styles.minesweeperWire} ${styles.wire}`} />
						</div>

						<div className={`${styles.snakeLinkWraper} ${styles.linkWraper}`} >
							<DelayLink delay={150} to="/games/snake" clickAction={() => animateLinks(styles.snakeLinkWraper)}>
								<span className={styles.snakeLink}>
									The Snake
									<span className={styles.underline} />
								</span>
								
							</DelayLink>
							<span className={`${styles.snakeWire} ${styles.wire}`} />
						</div>

						<div className={`${styles.moreGamesLinkWraper} ${styles.linkWraper}`} >
							<DelayLink delay={150} to="/games" clickAction={() => animateLinks(styles.moreGamesLinkWraper)}>
								<span className={styles.moreGamesLink}>
									More games...
									<span className={styles.underline} />
								</span>
							</DelayLink>
							<span className={`${styles.moreGamesWire} ${styles.wire}`} />
						</div>

					</div>
				</div>

				<div className={styles.rightContainer}>
					{userProfileElem}
				</div>
			</nav>

			<ProfilePanel />
		</>
	);
}
