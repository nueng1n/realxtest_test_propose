"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostTag = void 0;
const typeorm_1 = require("typeorm");
const Tag_1 = require("./Tag");
const Post_1 = require("./Post");
let PostTag = class PostTag {
};
exports.PostTag = PostTag;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], PostTag.prototype, "post_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], PostTag.prototype, "tag_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Post_1.Post, post => post.tags),
    __metadata("design:type", Post_1.Post)
], PostTag.prototype, "post", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tag_1.Tag, tag => tag.posts),
    __metadata("design:type", Tag_1.Tag)
], PostTag.prototype, "tag", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], PostTag.prototype, "index_order", void 0);
exports.PostTag = PostTag = __decorate([
    (0, typeorm_1.Entity)('post_tags')
], PostTag);
