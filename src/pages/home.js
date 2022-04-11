import { Link } from 'react-router-dom';
import styles from '../styles/home.module.css'
import anime from 'animejs';
import React, { useEffect } from 'react';
import OpenNeonImg from '../assets/Open Neon.svg';

export default function Home() {

  useEffect(() => {
    let t1 = anime.timeline({
      easing: 'easeInOutCubic',
      duration: 100
    });
  
    t1.add({
      targets: document.getElementById(styles.theText),
      translateY: ['-13vh', '0vh'],
      skewX: ['20deg', '20deg'],
      opacity: ['0', '1'],
      duration: 350,

    }).add({
      targets: document.getElementById(styles.neonText),
      translateX: ['-10vw', '0vw'],
      skewX: ['-10deg', '-10deg'],
      opacity: ['0', '1'],
      duration: 350,

    }).add({
      targets: document.getElementById(styles.gamesText),
      translateY: ['6vh', '0vh'],
      opacity: ['0', '1'],
      duration: 700,
    });

    anime({
      targets: document.getElementById(styles.neonOpenImg),
      opacity: ['0', '1'],
      translateY: ['-20vh', '0vh'],
      rotate: '-5deg',
      duration: 500,
      easing: 'easeOutBack',
      delay: 800,
    });

  }, []);

  return (
    <div className={styles.homeContainer}>
      <div id={styles.neonOpenImg}>
        <img src={OpenNeonImg} alt="" />
      </div>
      
      <div className={styles.titleTextContainer}>
        <span className={styles.titleText} id={styles.theText}>The</span>
        <span className={styles.titleText} id={styles.neonText}>Neon</span>
        <span className={styles.titleText} id={styles.gamesText}>Games</span>
      </div>

      <div className={styles.buttonContainer}>
        <Link to="/games">
          <span className={styles.startPlayingBtn}>
            Start Playing
          </span>
        </Link>

        <a className={styles.googleAuthBtn} href="/auth/google">
          <span>Enter with Google</span>
          <i className="icon-google" />
        </a>
      </div>
    </div>
  )
}
