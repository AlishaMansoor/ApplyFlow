import jwt from 'jsonwebtoken';
const genToken = async (userid, email) => {
    try {
        let token = await jwt.sign({ userid, email }, process.env.JWT_SECRET, { expiresIn: '7d' })
        return token;
    } catch (e) {
        console.log("Error in generating token", e);
    }
}
export default genToken;