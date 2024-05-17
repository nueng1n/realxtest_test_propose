
import jwt from 'jsonwebtoken';

const secretKey = process.env['JWT_SECERT_KEY'];

export function generateToken(username: any): string {
    return jwt.sign(username, secretKey as string, { expiresIn: '1800s' });
}

export function checkToken(token: any): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {
        jwt.verify(token, secretKey as string, (err: any, user: any) => {

            if (err) {
                console.log(err);
                
                resolve(false)
            }

            resolve(true)

        })

    })


}