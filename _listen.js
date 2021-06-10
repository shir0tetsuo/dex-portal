// Parse as json
X.use(express.json());
X.use(bparse.urlencoded({ extended: false }));
X.use(bparse.json());
X.use(cookies())
// load /img/ media from folder 'img'
X.use('/pub', express.static('pub'));
X.use('/favicon.ico', express.static('favicon.ico'));
X.use('/robots.txt', express.static('robots.txt'));

X.use(function(err, req, res, next) {
  console.error(err.stack);
  //res.status(500).send('500 PLEASE CONTACT ADMINISTRATOR')
})


X.listen(
  PORT,
  () => console.log(`Connection Open @ localhost:${PORT}`)
)
