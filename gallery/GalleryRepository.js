import { BaseRepository } from '../BaseRepository/BaseRepository.js';
import { EntityKeyConverter } from '../utils/entityKeyConverter.js';

export class GalleryRepository extends BaseRepository {
  constructor() {
    super('compnay_gallery');
    this.converter = new EntityKeyConverter();
  }

  // 갤러리 글 생성
  async createPosts(post) {
    try {
      const postKeys = this.converter.convertKeysToSnakeCase(Object.keys(post));
      const postValues = Object.values(post);
      const posts = this.create(post, postKeys, postValues);
      return this.converter.convertEntitySnakeToCamelCaseKeys(posts);
    } catch (e) {
      throw new Error('Failed to create gallery');
    }
  }
}
