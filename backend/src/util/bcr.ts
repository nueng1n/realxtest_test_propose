import bcrypt from 'bcrypt';


export async function calHashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, process.env['B_SALT'] as string);
    return hashedPassword
}

export async function checkHashPassword(myPlaintextPassword:any , hash:any) :Promise<boolean> {
    let result = await bcrypt.compare(myPlaintextPassword, hash)
    return result
}