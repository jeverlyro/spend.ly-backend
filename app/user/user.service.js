//Layer Service adalah layer 
const getUserById = async (id) => {
    const user = await Users.findById(id);
    if (!user) {
        throw Error('User not found');
    }
    return user;
}
module.exports = {
    getUserById
}
