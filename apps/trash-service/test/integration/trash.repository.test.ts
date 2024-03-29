/* eslint-disable jest/no-conditional-expect */

import { CoordinatesGenerator, MongooseTestModule, ScalarGenerator } from '@trashify/testing';
import { Model } from 'mongoose';
import { MongooseModule, getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { RawTrash, TrashTestFactory } from '../factories/trash-test-factory';
import { RepositoryError } from '../../src/common/exceptions/repository.exception';
import { Test, TestingModule } from '@nestjs/testing';
import { TrashDraft } from '../../src/modules/trash/dtos/trash.draft';
import { TrashRawEntity, TrashSchema } from '../../src/modules/trash/entities/trash.entity';
import { TrashRepository } from '../../src/modules/trash/repository/trash.repository';
import { TrashTags } from '../../src/modules/trash/enums/trash-tags.enum';
import { TrashUpdateDto } from '../../src/modules/trash/dtos';
import { getDistance } from 'geolib';

describe('TrashRepository', () => {
  const mongooseTestModule = new MongooseTestModule();
  const trashTestFactory = new TrashTestFactory();
  let moduleRef: TestingModule;
  let trashRepository: TrashRepository;
  let trashModel: Model<TrashRawEntity>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        mongooseTestModule.forRoot(),
        MongooseModule.forFeature([{ name: TrashRawEntity.name, schema: TrashSchema }]),
      ],
      providers: [TrashRepository],
    }).compile();

    trashRepository = moduleRef.get(TrashRepository);
    trashModel = moduleRef.get<Model<TrashRawEntity>>(getModelToken(TrashRawEntity.name));
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

  async function createTestTrash(): Promise<RawTrash[]> {
    const trash1 = trashTestFactory.create(),
      trash2 = trashTestFactory.create(),
      trash3 = trashTestFactory.create(),
      trash4 = trashTestFactory.create(),
      trash5 = trashTestFactory.create();

    const trashArray = [trash1, trash2, trash3, trash4, trash5];

    await trashModel.insertMany(trashArray);

    return trashArray;
  }

  describe('findAll', () => {
    it('returns all saved Trash entities', async () => {
      const trashArray = await createTestTrash();

      const result = await trashRepository.findAll();

      result.forEach((trash) => {
        const lookup = trashArray.find((t) => t.uuid === trash.uuid);

        expect(lookup).toBeTruthy();

        expect(trash).toMatchObject(lookup as RawTrash);
      });
    });

    it('returns an empty array - when no entities exist', async () => {
      const result = await trashRepository.findAll();

      expect(result).toHaveLength(0);
    });
  });

  describe('findByTags', () => {
    it('returns an empty array - when called with no tags', async () => {
      await createTestTrash();

      const result = await trashRepository.findByTags({ tags: [] });

      expect(result).toHaveLength(0);
    });

    it('returns only trash with specified tags', async () => {
      await createTestTrash();

      const batteriesTrash = trashTestFactory.create({
          tag: TrashTags.batteries,
        }),
        bioTrash = trashTestFactory.create({
          tag: TrashTags.bio,
        });

      await trashModel.insertMany([batteriesTrash, bioTrash]);

      const result = await trashRepository.findByTags({
        tags: [TrashTags.batteries],
      });

      expect(result).not.toHaveLength(0);

      result.forEach((trash) =>
        expect(trash.tag === TrashTags.bio || trash.tag === TrashTags.batteries).toBeTruthy(),
      );
    });
  });

  describe('findInDistance', () => {
    it('returns objects within a sphere', async () => {
      await trashModel.deleteMany({});

      const startingLatitude = CoordinatesGenerator.latitude({ precision: 10 });

      const startingLongitude = CoordinatesGenerator.longitude({ precision: 10 });

      const maxDistance = 5000;

      const dummyTrashArray = Array.from({ length: 100 }).map(() =>
        trashTestFactory.create({
          geolocation: {
            type: 'Point',
            coordinates: CoordinatesGenerator.coordinates({
              latitudeOptions: {
                min: startingLatitude - 0.455691,
                max: startingLatitude + 0.455691,
                precision: 10,
              },
              longitudeOptions: {
                min: startingLongitude - 0.455691,
                max: startingLongitude + 0.455691,
                precision: 10,
              },
            }),
          },
        }),
      );

      await trashModel.insertMany(dummyTrashArray);

      /* Wondering What in the flying Hells?
       * You are in no luck, as I ain't gonna explain this.
       * If you wanna know more, here you go: https://community.esri.com/t5/coordinate-reference-systems-blog/distance-on-a-sphere-the-haversine-formula/ba-p/902128
       * ...BUT, as a little bonus, this is not the same model used by Mongo.
       * They are using something called WGS 84, which the geolib library implements.
       * Bless Manuel Bieh, author of this library.
       * :)
       */
      const expectedResults = dummyTrashArray
        .map((trash) => {
          const [longitude, latitude] = trash.geolocation.coordinates;

          const distanceInMeters = getDistance(
            {
              latitude,
              longitude,
            },
            {
              latitude: startingLatitude,
              longitude: startingLongitude,
            },
          );

          if (distanceInMeters < maxDistance) {
            return trash;
          }
        })
        .filter(Boolean);

      const foundTrash = await trashRepository.findInDistance({
        coordinates: [startingLongitude, startingLatitude],
        maxDistance,
        minDistance: 0,
      });

      expect(foundTrash.length).toEqual(expectedResults.length);
    });
  });

  describe('save', () => {
    it('persists a new Trash - when given TrashDraft', async () => {
      const trashDraft = new TrashDraft({
        geolocation: CoordinatesGenerator.coordinates({}),
        tag: TrashTags.batteries,
      });

      await trashRepository.save({
        trash: trashDraft,
      });

      const rawTrash = await trashModel.findOne({
        geolocation: trashDraft.geolocation,
        tag: trashDraft.tag,
      });

      expect(rawTrash).toBeDefined();
    });

    it('updates existing Trash - when given TrashDto', async () => {
      const trash = trashTestFactory.create({
        tag: TrashTags.municipal,
      });

      await trashModel.create(trash);

      const trashUpdate = new TrashUpdateDto({
        geolocation: CoordinatesGenerator.coordinates({}),
        tag: TrashTags.mixed,
        uuid: trash.uuid,
      });

      await trashRepository.save({ trash: trashUpdate });

      const rawTrash = await trashModel
        .findOne({
          uuid: trash.uuid,
        })
        .lean();

      expect(rawTrash).toBeDefined();

      expect(rawTrash?.geolocation).toStrictEqual(trashUpdate.geolocation);

      expect(rawTrash?.tag).toEqual(trashUpdate.tag);
    });

    it('throws an error - when given TrashDto, but does not exist', async () => {
      expect.assertions(2);

      const trashUpdate = new TrashUpdateDto({
        geolocation: CoordinatesGenerator.coordinates({}),
        tag: TrashTags.mixed,
        uuid: ScalarGenerator.uuid(),
      });

      try {
        await trashRepository.save({ trash: trashUpdate });
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryError);

        const repositoryError = error as RepositoryError;

        expect(repositoryError.context).toEqual({
          entityName: 'Trash',
          operation: 'save',
          uuid: trashUpdate.uuid,
          reason: 'Entity does not exist.',
        });
      }
    });
  });

  describe('delete', () => {
    it('deletes Trash from db', async () => {
      const testTrash = trashTestFactory.create();

      await trashModel.insertMany([testTrash]);

      await trashRepository.delete(testTrash.uuid);

      const rawTrash = await trashModel
        .findOne({
          uuid: testTrash.uuid,
        })
        .lean();

      expect(rawTrash).toBeNull();
    });
  });
});
