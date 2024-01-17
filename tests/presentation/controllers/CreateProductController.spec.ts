import 'reflect-metadata'
import { ICreateProductUseCase } from '../../../src/domain/usecases'
import { IHttpRequest } from '../../../src/presentation/interfaces/IHttpRequest'
import { CreateProductController } from '../../../src/presentation/controllers/CreateProductController'
import { Category, Product } from '../../../src/domain/entities/Product'

describe('CreateProductController', () => {
  let createProductUseCaseMock: jest.Mocked<ICreateProductUseCase>
  let controller: CreateProductController

  beforeEach(() => {
    createProductUseCaseMock = {
      create: jest.fn(),
    }

    controller = new CreateProductController(createProductUseCaseMock)
  })

  const mockedHttpRequestParams: IHttpRequest = {
    body: {},
    params: {},
    query: {},
    headers: {},
    method: 'GET',
    url: ''
  }
  it('should return 201 and the product data when creation is successful', async () => {
    const mockedProductData = {
      name: 'Soda',
      category: 'Beverages',
      price: 4.5,
      description: 'A soda',
      image: '://fake.com/image.png',
    }

    mockedHttpRequestParams.body = mockedProductData

    createProductUseCaseMock.create.mockResolvedValue(new Product({ ...mockedProductData, category: Category.Beverages }))

    const response = await controller.handle(mockedHttpRequestParams)

    expect(response.statusCode).toBe(201)
    expect(createProductUseCaseMock.create).toHaveBeenCalledWith(mockedProductData)

    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('createdAt')
    expect(response.body).toHaveProperty('updatedAt')
    expect(response.body.name).toEqual(mockedProductData.name)
    expect(response.body.category).toEqual(mockedProductData.category)
    expect(response.body.price).toEqual(mockedProductData.price)
    expect(response.body.description).toEqual(mockedProductData.description)
    expect(response.body.image).toEqual(mockedProductData.image)
  })
})