import jwt from 'jsonwebtoken';
const genToken = async (userid) => {
    try {
        let token = await jwt.sign({ userid }, process.env.JWT_SECRET, { expiresIn: '7d' })
        return token;
    } catch (e) {
        console.log("Error in generating token", e);
    }
}
export default genToken;