const fs = require('fs');
const bcrypt = require('bcrypt');
const fspro = require('fs').promises;


async function generateHashedPasswords(users, salt) {

    const userPromises = users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user, salt);
        return { username: user, password: hashedPassword };
    });

    return await Promise.all(userPromises);
}

async function saveUsersToJsonFile(users, filename) {
    const jsonData = JSON.stringify(users, null, 2); // Pretty print JSON
    await fspro.writeFile(filename, jsonData, 'utf8');
    console.log(`Data saved to ${filename}`);
}

async function processFile(filePath) {

    console.log("START GEN ...");
    // const salt = await bcrypt.genSalt(10);
    const salt = '$2b$10$cDGdWtXd4Q7WShp.XSGifu'

    let array = []
    let uniq = []
    let jsonString = '';
    const readStream = fs.createReadStream(filePath, { encoding: 'utf8', highWaterMark: 1024 * 1024 });

    readStream.on('data', async (chunk) => {
        jsonString += chunk;

        if (jsonString.trim().endsWith(']')) {
            readStream.pause();
            const jsonArray = JSON.parse(jsonString);

            for (const item of jsonArray) {
                array.push(
                    item['postedBy']
                )
            }

            uniq = [...new Set(array)];


            readStream.resume()

        }
    });

    readStream.on('error', (err) => {
        console.error('Error reading file', err);
    });

    readStream.on('end', async () => {

        const usersWithHashedPasswords = await generateHashedPasswords(uniq, salt);
        await saveUsersToJsonFile(usersWithHashedPasswords, 'users.json');
    });
}

const jsonFilePath = './posts.json';
processFile(jsonFilePath)
    .then(() => {
    })
    .catch(err => {
        console.error('Error processing file', err);
        pool.end();
    });