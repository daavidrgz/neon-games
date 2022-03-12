import React from 'react';
import styles from '../styles/nav.module.css'

export default function ProfilePanel() {
	return (
		<>
			<div className={styles.backgroundDimmer} onClick={() => {
				document.querySelector(`.${styles.profilePanel}`).classList.remove(styles.showProfilePanel);
				document.querySelector(`.${styles.backgroundDimmer}`).classList.remove(styles.activeBackgroundDimmer);
			}}/>

			<ul className={styles.profilePanel}>
				<a className={styles.profilePanelItem} href="/auth/logout">
					<span>Logout</span>
					<i className="fi-rr-sign-out" />
					<div className={styles.underline}/>
				</a>
				<li className={styles.profilePanelSeparator}/>
			</ul>
		</>
		
	);
}
