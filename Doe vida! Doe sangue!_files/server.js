
// configurando o servidor
const express = require("express")
const server = express()

// configurando o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

// habilitar body do formulário (input de dados)
server.use(express.urlencoded({extended: true}))

//configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'sophia10',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})


// configurando a apresentação da página
server.get("/", function(req, res) {
    db.query("SELECT * FROM donors", function (err, result){
        if (err) return res.send("Erro no banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })
    
})

server.post("/", function(req, res){
    //pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood
    
    // não permitir que nenhum campo esteja vazio
    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios!")
    }

    //colocar valores dentro do banco de dados
    const query = `
        INSERT INTO donors("name", "email", "blood") 
        VALUES($1, $2, $3)`
    
    
    const values = [name, email, blood]
    
    db.query(query, values, function (err){
        if (err) return res.send("Erro no banco de dados.")

        return res.redirect("/")        
    })
    
})


// ligar o servidot a permitir o acesso na porta
server.listen(5500, function(){
    console.log("Iniciei o servidor!")
})

