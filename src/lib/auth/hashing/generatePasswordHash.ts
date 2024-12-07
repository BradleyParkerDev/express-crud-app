import bcrypt from  'bcrypt';

const generatePasswordHash = async (password:string, saltRounds:number) => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

export default generatePasswordHash;