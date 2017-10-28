const supertest = require('supertest');
var app = require ('../app');



//registers an MFI
supertest(app)
  .get('/MFIs')
  //.expect('Content-Type', /json/)
  //.attach('logo', 'D:\\Projects\\Smart Africa\\UX UI\\09_Program_Sessions.png')
  //.field ('name', 'Buusa Gonofa')
  .expect('Content-Length', '163')
  //.expect().
  //.send()
  .end(function(err, res) {
   	if (err) 
			console.log(err)
			//throw err;
    console.log(res)
  });