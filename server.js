//importo le librerie
var express = require('express');
var request = require('request');
var session = require('express-session');
var mdb = require('moviedb')('4b10523401b47e7acc9a274b5534d26f');

var app = express();

var CLIENT_ID="475724565966039";
var APP_SECRET="9a3f73277eb1b42a4cea662adacaad7e";

var PATH= "/Users/Shany/Desktop/ProgettoReti-master/ProgettoReti";

//istanzio una sessione per mantere l' access_token
app.use(session( {
	name: 'Movies',
	secret: '123456qwerty'
} ));

app.use(express.static(PATH+'/public'));
app.use(express.static(PATH+'/public/stylesheets'));

//variabile globale per la sessione
var sessione;

//get sulla root, rispondo con la pagina html che contiene il bottone di login
app.get('/', function (req, res) {
   res.sendFile(PATH+'/public/prova.html');
});


//rindirizzo sulla pagina facebook, dove do i consensi
app.get('/login', function(req,res){
    //user_actions.videos
   res.redirect("https://www.facebook.com/dialog/oauth?client_id="+CLIENT_ID+"&scope=user_photos&redirect_uri=http://localhost:3000/login/confirm");
  });
  
  
//estraggo il code
app.get('/login/confirm',function(req,res){
    sessione=req.session;
    var code=req.query.code;
    console.log("questo è il code:\n");
   console.log(code+"\n\n\n");
   //faccio una get a facebook per ottenere l'access token
   var url="https://graph.facebook.com/v2.3/oauth/access_token?client_id="+CLIENT_ID+"&redirect_uri=http://localhost:3000/login/confirm&client_secret="+APP_SECRET+"&code="+code;
   request.get(url ,function(error,response,body){
                        if(!error && response.statusCode===200){
                        var access_token =JSON.parse(body).access_token;
                        sessione.access_token=access_token;
                        console.log("questo è l' access_token: \n");
                        console.log(sessione.access_token);
                        res.redirect('http://localhost:3000/welcomePage');
                        
                        request.get("https://graph.facebook.com/me?access_token="+sessione.access_token ,function(error,response,body){
                            if(!error && response.statusCode===200){
                                risp= JSON.parse(body);
                                console.log("questo è l' id: \n");
                                console.log(risp.id);
                                //console.log(sessione.access_token);
                                request.get("https://graph.facebook.com/me/access_token="+sessione.access_token ,function(error,response,body){
                                        if(!error && response.statusCode===200){
                                        risp= JSON.parse(body);
                                        console.log("questi sono i film: \n");
                                        console.log(risp.data[0]);
                                        //console.log(sessione.access_token);
                            }
                            else{
                                console.log("errore :\n");
                                console.log(error);
                            }
                        });
                            }
                            else{
                                console.log("errore :\n");
                                console.log(error);
                            }
                        });
                        }
                        else{
                            console.log("errore :\n");
                            console.log(error);
                            }
                            
    });
    
});
   
app.get('/welcomePage', function (req, res) {
   res.sendFile(PATH+'/public/welcome.html');
});

app.get('/watched', function(req,res){
    res.sendFile(PATH+'/public/images/fiore.jpg');
  });
  

app.get('/logout', function(req, res){
     //https://graph.facebook.com/me/permissions        
     request.del("https://graph.facebook.com/me/permissions?access_token="+sessione.access_token ,function(error,response,body){
                        if(!error && response.statusCode===200){
                            res.redirect('http://localhost:3000/');  
                        }
                        else{
                            console.log("errore :\n");
                            console.log(error);
                            }
    });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
  });     

app.post('/static', function (req, res) {
  res.sendFile(PATH+'/public/images/fiore.jpg');
});



app.listen(3000, function () {
  console.log('In ascolto sulla porta 3000!');
});





mdb.searchMovie({query: 'Alien' }, function(err, res){
  console.log(res);
});
