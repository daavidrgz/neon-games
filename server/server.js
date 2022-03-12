require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-find-or-create');
const path = require('path');

const app = express();
app.use('/static', express.static(__dirname + '../public'));
app.use(require("body-parser").json());
app.use(cors());
app.use(session({
	secret: process.env.SESSION,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb+srv://admin-david:' + process.env.DB_PASS + '@cluster0.gm6au.mongodb.net/neonGamesDB', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

const minesweeperScoreSchema = new mongoose.Schema({
	timeStr: String,
	timeMs: Number,
	board: String,
	date: Date
});

const snakeScoreSchema = new mongoose.Schema({
	points: Number,
	level: Number,
	date: Date
})

const userSchema = new mongoose.Schema({
	name: String,
	email: String,
	googleId: String,
	picture: String,
	minesweeperScores: [minesweeperScoreSchema],
	snakeScores: [snakeScoreSchema]
});
userSchema.plugin(findOrCreate);

const MinesweeperScore = mongoose.model('Minesweeper_score', minesweeperScoreSchema);
const SnakeScore = mongoose.model('Snake_score', snakeScoreSchema);
const User = mongoose.model('User', userSchema);

passport.serializeUser(function(user, done) {
	done(null, user._id);
});
passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

passport.use(new GoogleStrategy({
	clientID: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	callbackURL: "http://localhost:3001/auth/google/main",
},
function(accessToken, refreshToken, profile, cb) {
	let { email, picture, name, sub: googleId } = profile._json;
	User.findOrCreate({ googleId: googleId }, { googleId: googleId, email: email, picture: picture, name: name }, function (err, user) {
		return cb(err, user);
	});
}));

app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
app.get('/auth/google/main', passport.authenticate('google'), function(req, res) {
	res.redirect("http://localhost:3000/games");
});

app.get('/auth/logout', function(req, res) {
	req.logout();
	res.redirect(req.headers.referer);
});

app.get('/api/get-user', function(req, res) {
	if ( !req.isAuthenticated() ) {
		res.status(403).send();
		return;
	}

	User.findOne({googleId: req.user.googleId}, function (err, user) {
		if ( !err ) {
			res.status(200).send({name: user.name, email: user.email, picture: user.picture});
			return;
		}

		res.status(404).send();
	});

});

// POST REQUESTS
app.post('/api/add-snake-score', function(req, res) {
	if ( !req.isAuthenticated() ) {
		res.status(403).send();
		return;
	}

	const { points, level, date } = req.body;
	const newSnakeScore = new SnakeScore({
		points: points,
		level: level,
		date: date
	});

	User.findOne({ googleId: req.user.googleId }, function (err, user) {
		if ( !err ) {
			const scores = user.snakeScores;
			const newScores = scores;
			let i = scores.length;
			while ( i > 0 && scores[i-1].points < points ) {
				newScores[i] = scores[i-1];
				i--;
			}
			newScores[i] = newSnakeScore;

			user.snakeScores = newScores;
			user.save();
			res.status(200).json('OK');
			return;
		}

		res.status(404).send();
	});
});

app.post('/api/add-minesweeper-score', function(req, res) {
	if ( !req.isAuthenticated() ) {
		res.status(403).send();
		return;
	}

	const { timeStr, board, date, timeMs } = req.body;
	const newMinesweeperScore = new MinesweeperScore({
		timeStr: timeStr,
		timeMs: timeMs,
		board: board,
		date: date
	});

	User.findOne({googleId: req.user.googleId}, function (err, user) {
		if ( !err ) {
			const scores = user.minesweeperScores;
			const newScores = scores;
			let i = scores.length;
			while ( i > 0 && scores[i-1].timeMs > timeMs ) {
				newScores[i] = scores[i-1];
				i--;
			}
			newScores[i] = newMinesweeperScore;

			user.minesweeperScores = newScores;
			user.save();
			res.status(200).json('OK');
			return;
		}

		res.status(404).send();
	});
});

app.post('/api/get-minesweeper-scores', function(req, res) {
	if ( !req.isAuthenticated() ) {
		res.status(403).json('Auth required');
		return;
	}

	const { board } = req.body;
	User.findOne({googleId: req.user.googleId}, function(err, user) {
		if ( !err ) {
			const scores = user.minesweeperScores.filter(score => score.board === board);
			const filteredScores = [];

			for ( let i = 0; i < scores.length && i < 4; i++ ) // Only send the best four scores
				filteredScores.push(scores[i]);

			res.status(200).send(filteredScores);
			return;
		}

		res.status(404).json('Auth required');
	});
});

app.get('/api/get-snake-scores', function(req, res) {
	if ( !req.isAuthenticated() ) {
		res.status(403).json('Auth required');
		return;
	}

	User.findOne({googleId: req.user.googleId}, function(err, user) {
		if ( !err ) {
			const scores = user.snakeScores;
			const filteredScores = [];

			for ( let i = 0; i < scores.length && i < 4; i++ ) // Only send the best four scores
				filteredScores.push(scores[i]);

			res.status(200).send(filteredScores);
			return;
		}

		res.status(404).json('Auth required');
	});
});

app.get('/', function(req, res) {
	res.sendFile(path.resolve(__dirname + '/../build/index.html'));
});
app.get('/style.css', function(req, res) {
	res.sendFile(path.resolve(__dirname + '/../build/style.css'));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>
	console.log(`Server listening on port: ${PORT}`)
);
