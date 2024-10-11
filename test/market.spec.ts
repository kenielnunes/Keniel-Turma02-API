import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { base, faker } from '@faker-js/faker';

describe('Mercado', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api-desafio-qa.onrender.com/mercado';
  let marketId = undefined;

  p.request.setDefaultTimeout(30000);

  beforeAll(() =>  
    p.reporter.add(rep)
  );
  afterAll(() => p.reporter.end());

  beforeEach(() => {
    console.log('marketId',marketId)
  })

  it('Cria um mercado', async () => {
     marketId = await p
      .spec()
      .post(baseUrl)
      .expectStatus(StatusCodes.CREATED)
      .withJson({
        nome: faker.company.name(),
        // cria com a regra de cnpj com 14 dígitos
        cnpj: faker.string.numeric({ length: 14 }),
        endereco: faker.location.street(),
      })
      .returns(ctx => ctx.res.body.novoMercado.id);

    console.log('marketId:', marketId);
  });

  it('Busca um mercado pelo id', async () => {
    // busca o mercado cadastrado no teste anterior
    await p
     .spec()
     .get(`${baseUrl}/${marketId}`)
     .expectStatus(StatusCodes.OK)
     // valida o schema do retorno
     .expectJsonSchema({
        $schema: 'http://json-schema.org/draft-04/schema#',
        type: 'object',
        properties: {
          nome: {
            type: 'string',
          },
          cnpj: {
            type: 'string'
          },
          endereco: {
            type: 'string'
          },
        },
      })
     .returns(ctx => ctx.res.body);
  });

  it('Atualiza os dados de um mercado existente', async () => {
    const updatedMarket = await p
     .spec()
     .put(`${baseUrl}/${marketId}`)
     .expectStatus(StatusCodes.OK).withJson({
        nome: faker.company.name(),
        cnpj: faker.string.numeric({ length: 14 }),
        endereco: faker.location.street(),
      }).expectBodyContains(`Mercado com ID ${marketId} atualizado com sucesso.`)
     .returns(ctx => ctx.res.body);

    console.log('updatedMarket:', updatedMarket);
   });

   it('Busca os produtos de um mercado', async () => {
      const products = await p
     .spec()
     .get(`${baseUrl}/${marketId}/produtos`)
     .expectStatus(StatusCodes.OK)
     .returns(ctx => ctx.res.body).inspect();

     console.log('products',products)
   });

   it('Adiciona um novo produto à subcategoria de frutas de um mercado', async () => {
        await p
     .spec()
     .post(`${baseUrl}/${marketId}/produtos/hortifruit/frutas`)
     .expectStatus(StatusCodes.CREATED).withJson({
        nome: faker.food.fruit(),
        valor: faker.number.int({max: 15})
     })
     .returns(ctx => ctx.res.body).inspect();
   });

   it('Adiciona um novo produto à subcategoria de salgados de um mercado', async () => {
        await p
        .spec()
        .post(`${baseUrl}/${marketId}/produtos/padaria/salgados`)
        .expectStatus(StatusCodes.CREATED).withJson({
           nome: "Coxinha",
           valor: faker.number.int({max: 15})
        })
        .returns(ctx => ctx.res.body).inspect();
    });

   it('Adiciona um novo produto à subcategoria de doces de um mercado', async () => {
        await p
        .spec()
        .post(`${baseUrl}/${marketId}/produtos/padaria/doces`)
        .expectStatus(StatusCodes.CREATED).withJson({
           nome: "Brigadeiro",
           valor: faker.number.int({max: 15})
        })
        .returns(ctx => ctx.res.body).inspect();
    });

   it('Adiciona um novo produto à subcategoria de legumes de um mercado', async () => {
        await p
        .spec()
        .post(`${baseUrl}/${marketId}/produtos/hortifruit/legumes`)
        .expectStatus(StatusCodes.CREATED).withJson({
           nome: "Cenoura",
           valor: faker.number.int({max: 15})
        })
        .returns(ctx => ctx.res.body).inspect();
    });

   it('Adiciona um novo produto à subcategoria de bovinos de um mercado', async () => {
        await p
        .spec()
        .post(`${baseUrl}/${marketId}/produtos/acougue/bovinos`)
        .expectStatus(StatusCodes.CREATED).withJson({
           nome: "Picanha/Abóbora",
           valor: faker.number.int({max: 25})
        })
        .returns(ctx => ctx.res.body).inspect();
    });

    it('Adiciona um novo produto à subcategoria de peixes de um mercado', async () => {
        await p
        .spec()
        .post(`${baseUrl}/${marketId}/produtos/peixaria/peixes`)
        .expectStatus(StatusCodes.CREATED).withJson({
           nome: "Corvina",
           valor: faker.number.int({max: 17})
        })
        .returns(ctx => ctx.res.body).inspect();
    });

   it('Busca os legumes de um mercado', async () => {
        await p
     .spec()
     .get(`${baseUrl}/${marketId}/produtos/hortifruit/legumes`)
     .expectStatus(StatusCodes.OK)
     .returns(ctx => ctx.res.body).inspect();
   });

   it('Busca os doces de um mercado', async () => {
        await p
     .spec()
     .get(`${baseUrl}/${marketId}/produtos/padaria/doces`)
     .expectStatus(StatusCodes.OK)
     .returns(ctx => ctx.res.body).inspect();
   });

   it('Busca os salgados de um mercado', async () => {
        await p
     .spec()
     .get(`${baseUrl}/${marketId}/produtos/padaria/salgados`)
     .expectStatus(StatusCodes.OK)
     .returns(ctx => ctx.res.body).inspect();
   });

   it('Busca os bovinos de um mercado', async () => {
        await p
     .spec()
     .get(`${baseUrl}/${marketId}/produtos/acougue/bovinos`)
     .expectStatus(StatusCodes.OK)
     .returns(ctx => ctx.res.body).inspect();
   });

    it('Deleta um mercado', async () => {
      await p
     .spec()
     .delete(`${baseUrl}/${marketId}`)
     .expectStatus(StatusCodes.OK).expectBodyContains(`Mercado com ID ${marketId} foi removido com sucesso.`)
     .returns(ctx => ctx.res.body).inspect();
   });
});
