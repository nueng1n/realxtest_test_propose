import fspro from 'fs/promises';
import fs from 'fs';
import { AppDataSource } from "./data-source"
import { Tag } from "./entity/Tag";
import { Post } from "./entity/Post";
import { User } from "./entity/User"
import { PostTag } from "./entity/PostTag";

export async function LoadDataAndInsertUserHashPassword(filePath: string): Promise<Map<string, User>> {
    const jsonData = await fspro.readFile(filePath, 'utf-8');
    const usersData = JSON.parse(jsonData);

    // const insertedUsers = await Promise.all(usersData.map(async (userData: { username: string, password: string }) => {
    //     const user = new User();
    //     user.username = userData.username;
    //     user.password = userData.password;
    //     return await AppDataSource.manager.save(user);


    // }));


    const usernameToIdMap = new Map<string, User>();

    await AppDataSource.transaction(async (transactionalEntityManager) => {
        const insertedUsers = await Promise.all(usersData.map(async (userData: { username: string, password: string }) => {
            const user = new User();
            user.username = userData.username;
            user.password = userData.password;
            return await transactionalEntityManager.save(user);
        }));



        insertedUsers.forEach(user => {
            usernameToIdMap.set(user.username, user);
        });


    })

    return usernameToIdMap;


}



interface PostData {
    title: string;
    content: string;
    postedAt: string;
    postedBy: string;
    tags: string[];
}




async function processTagsWithoutGranatreeIncrementID(items: PostData[]): Promise<Map<string, Tag>> {
    const tagMap: Map<string, Tag> = new Map<string, Tag>();
    const tagsToInsert: string[] = [];

    for (const item of items) {
        if (item.tags && Array.isArray(item.tags)) {
            for (const tagName of item.tags) {
                if (!tagMap.has(tagName)) {
                    tagsToInsert.push(tagName);
                    tagMap.set(tagName, new Tag());
                }
            }
        }
    }

    if (tagsToInsert.length > 0) {
        await AppDataSource.transaction(async (transactionalEntityManager) => {
            const tagRepository = transactionalEntityManager.getRepository(Tag);
            const queryBuilder = tagRepository.createQueryBuilder()
                .insert()
                .into(Tag, ["tag_name"])
                .values(tagsToInsert.map(tag => ({ tag_name: tag })))
                .onConflict(`("tag_name") DO UPDATE SET "tag_name" = EXCLUDED.tag_name`)
                .returning(["tag_id", "tag_name"]);

            const result = await queryBuilder.execute();

            for (const row of result['raw']) {
                const tag = new Tag();
                tag.tag_id = row.tag_id;
                tag.tag_name = row.tag_name;
                tagMap.set(row.tag_name, tag);
            }
        });
    }

    return tagMap;
}

async function insertDataPostTags(chunk: PostData[], insertedIds: Post[], tagIdsMap: Map<string, Tag>) {
    try {
        await AppDataSource.transaction(async transactionalEntityManager => {


            for (const [index, item] of chunk.entries()) {
                let postId = insertedIds[index];

                if (item.tags && Array.isArray(item.tags)) {
                    for (const [index_, tagName] of item.tags.entries()) {
                        const postTag = new PostTag();
                        postTag.post_id = postId['post_id'];
                        postTag.tag_id = tagIdsMap.get(tagName)?.tag_id as number;
                        postTag.index_order = index_;
                        postTag.post = postId
                        postTag.tag = tagIdsMap.get(tagName) as Tag
                        await transactionalEntityManager.save(postTag);
                    }
                }
            }
        });
    } catch (err) {
        console.error('Error inserting data', err);
    }
}


async function insertDataPost(chunk: PostData[], usernameToIdMap: Map<string, User>): Promise<Post[]> {
    const insertedIds: Post[] = [];

    try {

        await AppDataSource.transaction(async (transactionalEntityManager) => {

            for (const item of chunk) {

                const post = new Post();
                post.post_title = item.title;
                post.post_content = item.content;
                post.post_at = new Date(item.postedAt);
                post.user = usernameToIdMap.get(item.postedBy) as User;

                const insertedPost = await transactionalEntityManager.save(post);
                insertedIds.push(insertedPost);

            }
        });

    } catch (err) {
        console.error('Error inserting data', err);
    }

    return insertedIds;
}

export async function LoadDataAndInsertPost(filePath: string, usernameToIdMap: Map<string, User>): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {

        let jsonString = '';
        let jsonArray: PostData[]
        const chunkSize = 2;
        const readStream = fs.createReadStream(filePath, { encoding: 'utf8', highWaterMark: 1024 * 1024 });


        readStream.on('data', async (chunk: string) => {
            jsonString += chunk;


            if (jsonString.trim().endsWith(']')) {
                readStream.pause();

                jsonArray = JSON.parse(jsonString);

                readStream.resume();
            }

        });

        readStream.on('error', (err: Error) => {
            console.error('Error reading file', err);
            reject(false)
        });

        readStream.on('end', async () => {

            let batch: PostData[] = [];

            for (const item of jsonArray) {
                batch.push(item);

                if (batch.length >= chunkSize) {

                    console.log("... ", new Date().toISOString());
                    


                    let tagIdsMap = await processTagsWithoutGranatreeIncrementID(batch)
                    // console.log(tagIdsMap);

                    let insertedIds = await insertDataPost(batch, usernameToIdMap)
                    // console.log(inse);

                    await insertDataPostTags(batch, insertedIds, tagIdsMap)

                    batch = [];
                }

            }

            if (batch.length > 0) {
                console.log("... ", new Date().toISOString());

                let tagIdsMap = await processTagsWithoutGranatreeIncrementID(batch)
                // console.log(tagIdsMap);

                let insertedIds = await insertDataPost(batch, usernameToIdMap)
                // console.log(inse);

                await insertDataPostTags(batch, insertedIds, tagIdsMap)




            }

            resolve(true)
        })




    });
}