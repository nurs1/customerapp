var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var expressValidator = require('express-validator')
var app = express();
var mongojs = express('mongojs')
var db = mongojs('customerapp', ['users'])


//view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname, 'public')))

// Express validator middleware
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.')
		, root		  = namespace.shift()
		, formParam	  = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']'
		}
		return {
			param : formParam,
			msg	  : msg,
			value : value
		}
	}
}))

// Global variables
app.use(function (req, res, next) {
	res.locals.errors = null;
	next();
});

var users = [
	{
		id: 1,
		first_name: 'John',
		last_name: 'Doe',
		email: 'johndoe@gmail.com'
	},
	{
		id: 2,
		first_name: 'Bob',
		last_name: 'Smith',
		email: 'bobsmith@gmail.com'
	},
	{
		id: 3,
		first_name: 'Jill',
		last_name: 'Jackson',
		email: 'jjackson@gmail.com'
	}
]

app.get('/', function(req, res){
	db.users.find(function(err, docs){
		console.log(docs)
		res.render('index', {
			title: 'Customer',
			users: users
		})
	})
	
})

app.post('/users/add', function(req, res){
	req.checkBody('first_name', 'The First Name is required').notEmpty()
	req.checkBody('last_name', 'The Last Name is required').notEmpty()
	req.checkBody('email', 'The Email is required').notEmpty()
	
	var errors = req.validationErrors()
	
	function getErrors(){
		res.render('index', {
			title: 'Customers',
			users: users,
			errors: errors
		})
	}

	if(errors){
		getErrors()
		console.log('Errors')
	} else{
		var person = {
			fn: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email
		}
		
		console.log(person);
	}

	
})

app.listen(3000, function(){
	console.log('Server started on Port 3000...')
})
