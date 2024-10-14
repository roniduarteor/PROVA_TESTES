import request from "supertest";
import app from "../app";
import { User } from "../models/User";

describe("Testando rotas da API", () => {
  let email = "test@jest.com";
  let password = "1234";

  beforeAll(async () => {
    await User.sync({ force: true });
  });

  it("Deve ping pong", (done) => { // feito pelo professor
    request(app)
      .get("/ping")
      .then((response) => {
        expect(response.body.pong).toBeTruthy();
        return done();
      });
  });

  it("Deve registrar um novo usuario", (done) => { // feito pelo professor
    request(app)
      .post("/register")
      .send(`email=${email}&password=${password}`) 
      .then((response) => {
        expect(response.body.error).toBeUndefined();
        expect(response.body).toHaveProperty("id");
        return done();
      });
  });

  it("Não deve registrar um novo usuario com email existente", (done) => {
    request(app)
      .post("/register") // pega a rota post e o caminho
      .send(`email=${email}&password=${password}`) // envia o email que foi definido lá em cima no let e tb a senha, como se estivesse enviando na rota url
      .then((response) => { // isso aqui vai ta vendo oq ta sendo respondido
        expect(response.body.error).not.toBeUndefined(); // aí aqui se a resposta que vier no erro lá que ta dentro do corpo não for undefined, o teste vai passar

        // aqui ele vê se ta retornando um Erro lá da verificação do email
        return done();
      });
  });

  it("Não deve registrar um novo usuário sem a senha", (done) =>{
    request(app)
      .post("/register")
      .send(`email=${email}`)
      .then((response) => {
        expect(response.body.error).toBe('E-mail e/ou senha não enviados.')
        // se não colocar email ou senha vai cair no último erro do controller de registro
        // vê também se o erro ta vindo com a mensagem esperada
        return done()
      })
  })

  it("Não deve registrar um novo usuário sem a email", (done) =>{
    request(app)
      .post("/register")
      .send(`password=${password}`)
      .then((response) => {
        expect(response.body.error).toBe('E-mail e/ou senha não enviados.')
        // mesma coisa do teste de cima
        return done()
      })
  })

  it("Não deve registrar um novo usuário sem os dados", (done) =>{
    request(app)
      .post("/register")
      .send(``)
      .then((response) => {
        expect(response.body.error).toBe('E-mail e/ou senha não enviados.')
        // mesma coisa do teste de cima, já que não está enviando o que pediu lá
        return done()
      })
  })

  it("Deve logar corretamente", (done) =>{
    request(app)
      .post("/login")
      .send(`email=${email}&password=${password}`)
      .then((response) => {
        expect(response.body.status).toBeTruthy()
        // Aqui ele cai na condição de ver se a senha ta correta e também do email, que lá retorna o status true se conseguir passar com tudo igual
        return done()
    
      })
  })

  it("Não deve logar com os dados incorretos", (done) => {
    request(app)
    .post('/login')
    .send(`email=ronaldinho@email&password=asdasdasd`)
    .then((response) => {
      expect(response.body.status).toBeFalsy()
      // mesma coisa do de cima, mas agr como ele ta enviando os dados incorretos ele vai passar a validação e vai cair no de status false
      return done()
    }) 
  })

  it("Deve listar os usuários", (done) => {
    request(app)
    .get('/list')
    .then((response) => {
      expect(response.body.list.length).toBeGreaterThan(0) // Se o tamanho da lista que ta vindo for maior que zero significa que está conseguindo retornar as coisinha
      expect(response.body.list).toBeInstanceOf(Array) // se o tipo do negócio lá que vir for um array ele vai passar no teste
      return done()
    })
  })

  it("Deve excluir um usuário", (done) => {
    request(app)
    .delete(`/delete/${email}`) // ta pegando o email pela rota, como se fosse quando fazia com o Id do usuário
    .then((response) => {
      expect(response.body.error).toBeUndefined();
      // ele vai passar no teste se o erro for indefinido, ou seja, vai ter dado tudo certo e n vai ter erro algum
      return done()
    })
  })

  it("Não deve excluir um usuário inexistente", (done) => {
    request(app)
    .delete(`/delete/aeada@email`)
    .then((response) => {
      expect(response.status).toBe(404)
      // se o usuário não existir então ele vai cair lá no response de 404, que diz que não encontrou o usuário, e ali mesmo já vai parar de executar as coisinha
      return done()
    })
  })



});
