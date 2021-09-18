const mongoose = require('mongoose');

const dbURI = process.env.MONGO_URI;
// mongodb+srv://root:root@cluster0.w9kzx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
mongoose
	.connect(dbURI, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useFindAndModify: false,
	})
	.then(() => console.log('MongoDB Connected'))
	.catch((err) => console.log(err));

mongoose.set('useCreateIndex', true);
