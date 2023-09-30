import { Model } from 'mongoose';
import { MongooseModule, getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { MongooseTestModule } from '@trashify/testing';
import { Test, TestingModule } from '@nestjs/testing';
import { Trash, TrashSchema } from '../../src/modules/trash/entities/trash.entity';
import { TrashRepository } from '../../src/modules/trash/repository/trash.repository';
import { TrashTestFactory } from '../../src/modules/trash/repository/test/factories/trash-test-factory';

describe('TrashRepository', () => {
  const mongooseTestModule = new MongooseTestModule();

  const trashTestFactory = new TrashTestFactory();

  let moduleRef: TestingModule;

  let trashRepository: TrashRepository;

  let trashModel: Model<Trash>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        mongooseTestModule.forRoot(),
        MongooseModule.forFeature([{ name: Trash.name, schema: TrashSchema }]),
      ],
      providers: [TrashRepository],
    }).compile();

    trashRepository = moduleRef.get(TrashRepository);
    trashModel = moduleRef.get<Model<Trash>>(getModelToken(Trash.name));
  });

  beforeEach(async () => {
    await trashModel.deleteMany({});
  });

  afterAll(async () => {
    const connection = await moduleRef.get(getConnectionToken());
    await connection.close();
    await mongooseTestModule.stop();
    await moduleRef.close();
  });

  describe('findAll', () => {
    it('returns all saved Trash entities', async () => {
      const trash1 = trashTestFactory.create(),
        trash2 = trashTestFactory.create(),
        trash3 = trashTestFactory.create();

      const trashArray = [trash1, trash2, trash3];

      await trashModel.insertMany(trashArray);

      const result = await trashRepository.findAll();

      result.forEach((trash) => {
        const lookup = trashArray.find((t) => t.uuid === trash.uuid);

        expect(lookup).toBeTruthy();
      });
    });
  });
});
