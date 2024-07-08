import express from 'express';
import { ResponseDTO } from '../DTO/responseDTO.js';
import loadish from 'lodash';

export class GalleryController {
  constructor({ galleryService }) {
    this.userService = galleryService;
    this.router = express.Router();
    this.routes();
  }

  routes() {
    this.router.post('/', this.createPosts.bind(this));
    this.router.get('/', this.getAll.bind(this));
  }

  // 갤러리 글 작성
  // req.body = { title: string, content: string, img: string}
  async createPosts(req, res) {
    try {
      const gallery = req.body;
      if (loadish.isEmpty(gallery)) {
        throw new Error('Request body is empty');
      }
      const galleryPosts = await this.galleryService.createPosts(gallery);
      res.status(200).json(new ResponseDTO(galleryPosts));
    } catch (e) {
      res.status(500).json(new ResponseDTO(e.message));
    }
  }

  // 갤러리 전체 조회
  async getAll(req, res) {
    try {
      const galleryPosts = await this.galleryService.getAll();
      res.status(200).json(new ResponseDTO(galleryPosts));
    } catch (e) {
      res.status(500).json(new ResponseDTO(e.message));
    }
  }
}
