import loadish from 'lodash';

export class GalleryService {
  constructor({ galleryRepository }) {
    this.galleryRepository = galleryRepository;
  }

  // 갤러리 전체 조회
  async getAll() {
    try {
      return await this.galleryRepository.getAll();
    } catch (e) {
      throw new Error('Failed to get all gallery');
    }
  }

  // 갤러리 글 작성
  async createPosts(post) {
    try {
      return await this.galleryRepository.createPosts(post);
    } catch (e) {
      throw new Error('Failed to create gallery');
    }
  }
}
