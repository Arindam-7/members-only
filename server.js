const express = require('express')
const compression = require('compression')
const MongoStore = require('connect-mongo')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const logger = require('morgan')
const passport = require('passport')
const path = require('path')

const { deserialize, localStrategy, serialize } = require('./config/passportjs.config')

const { userAvailableInTemplate } = require('./middlewares/auth.middleware')

const { connectToDb } = require('./db/db')

const authRoutes = require('./routes/auth.routes')
const postRoutes = require('./routes/post.routes')
const userRoutes = require('./routes/user.routes')

require('dotenv').config()

const app = express()
const PORT = process.env.PORT


// template engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


// middlewares
app.use(logger('dev'))

app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          imgSrc: [`'self'`, `data:`],
          scriptSrc: [`'self'`, `'unsafe-eval'`, `'unsafe-inline'`],
        },
      },
    })
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(compression())
app.use(express.static(path.join(__dirname, './public')))


// Session
const sessionStore = new MongoStore({
    collectionName: 'sessions',
    mongoUrl: `mongodb+srv://arindam:${process.env.PASS}@cluster0.jtibas8.mongodb.net/?retryWrites=true&w=majority`,
  });
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'SET A REAL SECRET',
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        maxAge: 1000 * 60 * 60 * 12, // equals 12 hours
      },
    })
);


// Passport.js configuration
passport.use(localStrategy);
passport.serializeUser(serialize);
passport.deserializeUser(deserialize);

app.use(passport.initialize());
app.use(passport.session());
app.use(userAvailableInTemplate);


// Routes
app.use('/', authRoutes)
app.use('/posts', postRoutes)
app.use('/users', userRoutes)
app.use('/', (req, res, next) => {
    return res.redirect('/posts')
})


// Error Handler middleware
const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err);

  res.status(500).json({ error : 'Internal Server Error' });
};

app.use(errorHandlerMiddleware)


app.listen(PORT, () => {
    console.log(`Access server on http://localhost:${PORT}`)
})