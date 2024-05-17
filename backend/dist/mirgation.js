"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadDataAndInsertPost = exports.LoadDataAndInsertUserHashPassword = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const fs_1 = __importDefault(require("fs"));
const data_source_1 = require("./data-source");
const Tag_1 = require("./entity/Tag");
const Post_1 = require("./entity/Post");
const User_1 = require("./entity/User");
const PostTag_1 = require("./entity/PostTag");
function LoadDataAndInsertUserHashPassword(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const jsonData = yield promises_1.default.readFile(filePath, 'utf-8');
        const usersData = JSON.parse(jsonData);
        // const insertedUsers = await Promise.all(usersData.map(async (userData: { username: string, password: string }) => {
        //     const user = new User();
        //     user.username = userData.username;
        //     user.password = userData.password;
        //     return await AppDataSource.manager.save(user);
        // }));
        const usernameToIdMap = new Map();
        yield data_source_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
            const insertedUsers = yield Promise.all(usersData.map((userData) => __awaiter(this, void 0, void 0, function* () {
                const user = new User_1.User();
                user.username = userData.username;
                user.password = userData.password;
                return yield transactionalEntityManager.save(user);
            })));
            insertedUsers.forEach(user => {
                usernameToIdMap.set(user.username, user);
            });
        }));
        return usernameToIdMap;
    });
}
exports.LoadDataAndInsertUserHashPassword = LoadDataAndInsertUserHashPassword;
function processTagsWithoutGranatreeIncrementID(items) {
    return __awaiter(this, void 0, void 0, function* () {
        const tagMap = new Map();
        const tagsToInsert = [];
        for (const item of items) {
            if (item.tags && Array.isArray(item.tags)) {
                for (const tagName of item.tags) {
                    if (!tagMap.has(tagName)) {
                        tagsToInsert.push(tagName);
                        tagMap.set(tagName, new Tag_1.Tag());
                    }
                }
            }
        }
        if (tagsToInsert.length > 0) {
            yield data_source_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                const tagRepository = transactionalEntityManager.getRepository(Tag_1.Tag);
                const queryBuilder = tagRepository.createQueryBuilder()
                    .insert()
                    .into(Tag_1.Tag, ["tag_name"])
                    .values(tagsToInsert.map(tag => ({ tag_name: tag })))
                    .onConflict(`("tag_name") DO UPDATE SET "tag_name" = EXCLUDED.tag_name`)
                    .returning(["tag_id", "tag_name"]);
                const result = yield queryBuilder.execute();
                for (const row of result['raw']) {
                    const tag = new Tag_1.Tag();
                    tag.tag_id = row.tag_id;
                    tag.tag_name = row.tag_name;
                    tagMap.set(row.tag_name, tag);
                }
            }));
        }
        return tagMap;
    });
}
function insertDataPostTags(chunk, insertedIds, tagIdsMap) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield data_source_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                for (const [index, item] of chunk.entries()) {
                    let postId = insertedIds[index];
                    if (item.tags && Array.isArray(item.tags)) {
                        for (const [index_, tagName] of item.tags.entries()) {
                            const postTag = new PostTag_1.PostTag();
                            postTag.post_id = postId['post_id'];
                            postTag.tag_id = (_a = tagIdsMap.get(tagName)) === null || _a === void 0 ? void 0 : _a.tag_id;
                            postTag.index_order = index_;
                            postTag.post = postId;
                            postTag.tag = tagIdsMap.get(tagName);
                            yield transactionalEntityManager.save(postTag);
                        }
                    }
                }
            }));
        }
        catch (err) {
            console.error('Error inserting data', err);
        }
    });
}
function insertDataPost(chunk, usernameToIdMap) {
    return __awaiter(this, void 0, void 0, function* () {
        const insertedIds = [];
        try {
            yield data_source_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                for (const item of chunk) {
                    const post = new Post_1.Post();
                    post.post_title = item.title;
                    post.post_content = item.content;
                    post.post_at = new Date(item.postedAt);
                    post.user = usernameToIdMap.get(item.postedBy);
                    const insertedPost = yield transactionalEntityManager.save(post);
                    insertedIds.push(insertedPost);
                }
            }));
        }
        catch (err) {
            console.error('Error inserting data', err);
        }
        return insertedIds;
    });
}
function LoadDataAndInsertPost(filePath, usernameToIdMap) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let jsonString = '';
            let jsonArray;
            const chunkSize = 2;
            const readStream = fs_1.default.createReadStream(filePath, { encoding: 'utf8', highWaterMark: 1024 * 1024 });
            readStream.on('data', (chunk) => __awaiter(this, void 0, void 0, function* () {
                jsonString += chunk;
                if (jsonString.trim().endsWith(']')) {
                    readStream.pause();
                    jsonArray = JSON.parse(jsonString);
                    readStream.resume();
                }
            }));
            readStream.on('error', (err) => {
                console.error('Error reading file', err);
                reject(false);
            });
            readStream.on('end', () => __awaiter(this, void 0, void 0, function* () {
                let batch = [];
                for (const item of jsonArray) {
                    batch.push(item);
                    if (batch.length >= chunkSize) {
                        console.log("... ", new Date().toISOString());
                        let tagIdsMap = yield processTagsWithoutGranatreeIncrementID(batch);
                        // console.log(tagIdsMap);
                        let insertedIds = yield insertDataPost(batch, usernameToIdMap);
                        // console.log(inse);
                        yield insertDataPostTags(batch, insertedIds, tagIdsMap);
                        batch = [];
                    }
                }
                if (batch.length > 0) {
                    console.log("... ", new Date().toISOString());
                    let tagIdsMap = yield processTagsWithoutGranatreeIncrementID(batch);
                    // console.log(tagIdsMap);
                    let insertedIds = yield insertDataPost(batch, usernameToIdMap);
                    // console.log(inse);
                    yield insertDataPostTags(batch, insertedIds, tagIdsMap);
                }
                resolve(true);
            }));
        });
    });
}
exports.LoadDataAndInsertPost = LoadDataAndInsertPost;
