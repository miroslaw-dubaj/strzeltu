const express = require('express');
const app = express();

// prepare server
// app.use('/api', api); // redirect API calls
// app.use('/', express.static(__dirname + '/www')); // redirect root
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing')
});

app.get('/ranges', (req, res) => {
  const ranges = [
    {
      name: 'Strzelnica PZŁ w Borze',
      image:'http://wilczeecha.net.pl/wp-content/uploads/2015/04/Szkolenie8.jpg'
    },
    {
      name: 'Strzelnica Strzelka w Zabajce',
      image: 'http://strzelka.pl/images/galeria/22.jpg'
    },
    {
      name: 'Strzelnica Husar w Rudna Wielka',
      image: 'http://husar-akademia.pl/images/view/index/get/id,39'
    },
    {
      name: 'Strzelnica CEL w Łańcucie',
      image: 'https://scontent-waw1-1.xx.fbcdn.net/v/t31.0-8/20507437_489561561402070_2222920359021455001_o.jpg?_nc_cat=0&oh=31e244b1527b82025acb37575a11ebe5&oe=5B30106F'
    }
  ];

  res.render('ranges', {ranges: ranges});
})

app.listen(8080, 'localhost', () => {
  console.log('Server serving Strzeltu.pl')
})